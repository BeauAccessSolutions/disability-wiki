#!/usr/bin/env python3
"""
Runtime page verifier for Disability Wiki.

Exists because ad-hoc `curl | grep` checks produced three false signals in one
session — every time the page was correct and the check was wrong:

  1. "legal rights DROPPED"  — grepped for `restraining`/`know your rights`;
     the content had survived reworded ("protection order", "accessible
     shelter"). A boolean keyword miss was reported as content loss.
  2. "accent border not live" — polled a hashed CSS URL captured once, so the
     poll kept re-fetching a stale asset after the deploy replaced it.
  3. "ordering incorrect"    — searched whole-page HTML, where the on-this-page
     nav repeats every heading. Heading positions came from the nav, the phone
     number from the body, and comparing them was meaningless.

The shared root cause: grepping raw HTML with boolean pattern-matches instead of
scoping to the rendered content region and comparing sets. This module makes the
correct thing the easy thing.

Usage
-----
    # ordering inside <main> only
    python3 scripts/verify_page.py order URL "In immediate danger" "1-800-799-7233" "Warning signs"

    # phone numbers present in a page (as a set, for diffing)
    python3 scripts/verify_page.py numbers URL

    # nothing was lost between two local markdown files and a rendered page
    python3 scripts/verify_page.py kept URL before1.md before2.md

    # wait for a hashed asset to actually contain a string (re-resolves each poll)
    python3 scripts/verify_page.py await-asset URL 'border-inline-start:3px' --timeout 600

Exit status is 0 on success, 1 on failure, so it can gate a script.
"""

import argparse
import re
import sys
import time
import urllib.error
import urllib.request

# Cloudflare 403s the default urllib agent; use a normal browser UA.
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36"

# Regions that repeat page text and must never be searched for content checks:
# Starlight puts the full heading list in the on-this-page nav and the whole
# site tree in the sidebar, so a heading "appears" long before its real section.
_CHROME_TAGS = ("nav", "header", "footer", "aside", "script", "style", "template")


def fetch(url: str, bust: bool = False) -> str:
    """GET a URL as a browser would. `bust` defeats edge/browser caching."""
    if bust:
        url += ("&" if "?" in url else "?") + f"_cb={int(time.time() * 1000)}"
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Cache-Control": "no-cache"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def main_text(html: str) -> str:
    """
    Visible text of the page's <main>, with nav/sidebar/footer chrome removed.

    This is the only region content assertions may run against. Searching the
    whole document is what made the ordering check meaningless.
    """
    m = re.search(r"<main\b[^>]*>(.*?)</main>", html, re.S | re.I)
    body = m.group(1) if m else html
    for tag in _CHROME_TAGS:
        body = re.sub(rf"<{tag}\b.*?</{tag}>", " ", body, flags=re.S | re.I)
    # Starlight renders an "Section titled “X”" anchor label next to each
    # heading; it duplicates heading text and would double every position.
    body = re.sub(r"Section titled\s*[“\"][^”\"]*[”\"]", " ", body)
    text = re.sub(r"<[^>]+>", " ", body)
    for ent, ch in (("&nbsp;", " "), ("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"),
                    ("&#39;", "'"), ("&quot;", '"'), ("&mdash;", "—"), ("&ldquo;", "“"),
                    ("&rdquo;", "”")):
        text = text.replace(ent, ch)
    return re.sub(r"\s+", " ", text).strip()


# Phone shapes seen across this wiki's crisis pages, incl. UK 0808 and shortcodes.
_PHONE_PATTERNS = (
    r"\b1-800-[\dA-Z-]{3,}\b",
    r"\b\d{3}-\d{3}-\d{4}\b",
    r"\b0\d{3}\s?\d{3}\s?\d{4}\b",
    r"\b\+\d{1,3}[\d\s().-]{6,}\d\b",
    r"\b(?:988|911|999|000|112|741741)\b",
)


def numbers(text: str) -> set:
    """Normalised phone numbers found in text. Compare these as SETS, never booleans."""
    out = set()
    for pat in _PHONE_PATTERNS:
        for m in re.findall(pat, text):
            n = re.sub(r"[\s\-()]", "", m)
            # 1-800-799-7233 matches both the 1-800 and the bare-NANP pattern.
            # Strip the NANP country code so one number is one set member.
            if len(n) == 11 and n.startswith("1"):
                n = n[1:]
            out.add(n)
    return out


def cmd_order(args) -> int:
    """Assert markers appear in the given order inside <main>."""
    text = main_text(fetch(args.url))
    pos = [(m, text.find(m)) for m in args.markers]
    missing = [m for m, i in pos if i < 0]
    if missing:
        print("FAIL missing from <main>:")
        for m in missing:
            print(f"   {m!r}")
        return 1
    ok = all(pos[i][1] > pos[i - 1][1] for i in range(1, len(pos)))
    print(" → ".join(f"{m}@{i}" for m, i in pos))
    print("PASS order holds" if ok else "FAIL out of order")
    return 0 if ok else 1


def cmd_numbers(args) -> int:
    found = numbers(main_text(fetch(args.url)))
    for n in sorted(found):
        print(n)
    print(f"# {len(found)} numbers", file=sys.stderr)
    return 0


def cmd_kept(args) -> int:
    """
    Assert no phone number from the given source files vanished from the page.

    Set difference, not keyword presence — this is the check that would have
    made the "legal rights DROPPED" claim impossible to state.
    """
    before = set()
    for p in args.sources:
        with open(p, encoding="utf-8") as f:
            before |= numbers(f.read())
    after = numbers(main_text(fetch(args.url)))
    lost = before - after
    print(f"sources: {len(before)} numbers | page: {len(after)} | lost: {len(lost)}")
    for n in sorted(lost):
        print(f"   LOST {n}")
    return 1 if lost else 0


def cmd_await_asset(args) -> int:
    """
    Wait until a string appears in one of the page's hashed assets.

    Re-resolves the asset list on EVERY poll and cache-busts each fetch. A deploy
    renames the hashed file, so a URL captured once goes stale and the poll will
    happily report "not live" forever.
    """
    deadline = time.time() + args.timeout
    seen = set()
    while time.time() < deadline:
        try:
            page = fetch(args.url, bust=True)
            assets = set(re.findall(r'/_astro/[^"\'\s>]+\.(?:css|js)', page))
            seen |= assets
            for a in sorted(assets):
                base = args.url.split("/", 3)[:3]
                try:
                    if args.needle in fetch("/".join(base) + a, bust=True):
                        print(f"PASS found in {a}")
                        return 0
                except urllib.error.HTTPError:
                    continue
        except urllib.error.URLError as e:
            print(f"   (retrying: {e})", file=sys.stderr)
        time.sleep(args.interval)
    print(f"FAIL {args.needle!r} not found after {args.timeout}s")
    print(f"     assets checked: {', '.join(sorted(seen)) or 'none'}")
    return 1


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    o = sub.add_parser("order", help="assert markers appear in order inside <main>")
    o.add_argument("url")
    o.add_argument("markers", nargs="+")
    o.set_defaults(fn=cmd_order)

    n = sub.add_parser("numbers", help="list phone numbers found in <main>")
    n.add_argument("url")
    n.set_defaults(fn=cmd_numbers)

    k = sub.add_parser("kept", help="assert no phone number from source files was lost")
    k.add_argument("url")
    k.add_argument("sources", nargs="+")
    k.set_defaults(fn=cmd_kept)

    a = sub.add_parser("await-asset", help="poll until a string appears in a hashed asset")
    a.add_argument("url")
    a.add_argument("needle")
    a.add_argument("--timeout", type=int, default=600)
    a.add_argument("--interval", type=int, default=20)
    a.set_defaults(fn=cmd_await_asset)

    return p


if __name__ == "__main__":
    args = build_parser().parse_args()
    sys.exit(args.fn(args))
