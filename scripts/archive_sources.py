#!/usr/bin/env python3
"""Archive-backup tracker for external sources on disabilitywiki.org.

Borrowed from the Langworthywatch fact-check validator, whose sharpest idea is
that external links die and evidence has to outlive them. That project archives
every source URL to the Wayback Machine and records the snapshot alongside the
citation.

This wiki has the same exposure and less defence. Its crisis pages cite ~120
international hotline and support organizations, many as bare URLs on plain
http://. When one of those goes dark, a reader looking for a crisis line gets a
dead link, and the maintainer has no record of what was there.

Two differences from Langworthywatch shaped the design:

1. Snapshots are NOT written inline next to links. Reader-facing crisis pages
   should not carry archive URLs as clutter. They go in a manifest
   (docs/source-archives.json) that maintainers consult when a link breaks.

2. URL extraction handles BARE urls, not just markdown links. This matters more
   than it sounds: the crisis pages write org URLs as plain text, so a
   markdown-only pattern (`](url)`) silently misses ~120 of the highest-stakes
   URLs on the site while appearing to work.

Usage:
    archive_sources.py --check            # report snapshot coverage (read-only)
    archive_sources.py --check --stale 730  # also flag snapshots older than N days
    archive_sources.py --save             # submit unarchived URLs to the Wayback
                                          # Machine (network write; opt-in, slow)
    archive_sources.py --check --json docs/source-archives.json

--save sends URLs to a third-party service. It is never run by CI and never
implied by --check.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
MANIFEST = REPO_ROOT / "docs" / "source-archives.json"

CONTENT_DIRS = [
    "benefits", "community", "conditions", "crisis", "daily-living",
    "education", "employment", "foundations", "get-involved", "glossary",
    "healthcare", "history", "housing", "intersectionality", "media",
    "professionals", "relationships", "research", "rights", "sports",
    "start", "tech", "transport",
]

# Sections where a dead link does the most harm, checked and reported first.
PRIORITY_DIRS = ["crisis", "benefits", "rights", "healthcare"]

# Catches bare URLs as well as markdown link targets. Trailing punctuation is
# stripped separately because prose puts periods and commas against URLs.
URL_RE = re.compile(r'https?://[^\s)>\]"\'`]+')
# Markdown emphasis markers run flush against URLs in prose (`<url>**` or `*<url>*`),
# so strip them alongside sentence punctuation or the URL is checked with a `*` on
# the end and reported as unarchived when it is not.
TRAILING_JUNK = re.compile(r'[.,;:!?*_]+$')

# Hosts that are already archives, or that it makes no sense to snapshot.
SKIP_HOSTS = {
    "web.archive.org", "archive.is", "archive.today", "archive.ph",
    "localhost", "127.0.0.1", "example.com",
}

AVAILABILITY_API = "https://archive.org/wayback/available?url="
SAVE_API = "https://web.archive.org/save/"
UA = "Mozilla/5.0 (compatible; disability-wiki-archive/1.0; +https://disabilitywiki.org)"


def clean(url: str) -> str:
    return TRAILING_JUNK.sub("", url.rstrip(")"))


def host_of(url: str) -> str:
    try:
        return urllib.parse.urlparse(url).netloc.lower()
    except ValueError:
        return ""


def collect_urls(root: Path, dirs: list[str]) -> dict[str, list[str]]:
    """Map each external URL to the content files citing it."""
    found: dict[str, list[str]] = {}
    for d in dirs:
        base = root / d
        if not base.exists():
            continue
        for md in sorted(base.rglob("*.md")):
            try:
                text = md.read_text(encoding="utf-8")
            except (OSError, UnicodeDecodeError):
                continue
            for raw in URL_RE.findall(text):
                url = clean(raw)
                if not url or host_of(url) in SKIP_HOSTS:
                    continue
                rel = str(md.relative_to(root))
                found.setdefault(url, [])
                if rel not in found[url]:
                    found[url].append(rel)
    return found


def wayback_lookup(url: str, timeout: int) -> dict | None:
    """Ask the Wayback availability API for the closest snapshot."""
    req = urllib.request.Request(
        AVAILABILITY_API + urllib.parse.quote(url, safe=""),
        headers={"User-Agent": UA},
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            payload = json.loads(resp.read().decode("utf-8", "replace"))
    except Exception:  # noqa: BLE001 - availability API is flaky by nature
        return None
    snap = (payload.get("archived_snapshots") or {}).get("closest")
    if not snap or not snap.get("available"):
        return None
    return {"url": snap.get("url", ""), "timestamp": snap.get("timestamp", "")}


def snapshot_age_days(timestamp: str, today: dt.date) -> int | None:
    """Wayback timestamps look like 20240115123045."""
    if len(timestamp) < 8:
        return None
    try:
        when = dt.datetime.strptime(timestamp[:8], "%Y%m%d").date()
    except ValueError:
        return None
    return (today - when).days


def wayback_save(url: str, timeout: int) -> bool:
    req = urllib.request.Request(SAVE_API + url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status < 400
    except Exception:  # noqa: BLE001
        return False


def main() -> int:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    ap.add_argument("--check", action="store_true", help="report snapshot coverage (read-only)")
    ap.add_argument("--save", action="store_true",
                    help="submit unarchived URLs to the Wayback Machine (network write)")
    ap.add_argument("--stale", type=int, default=0,
                    help="flag snapshots older than N days (0 disables)")
    ap.add_argument("--only", nargs="*", help="limit to these content dirs")
    ap.add_argument("--priority", action="store_true",
                    help=f"only the high-stakes sections: {', '.join(PRIORITY_DIRS)}")
    ap.add_argument("--limit", type=int, default=0, help="stop after N URLs (0 = all)")
    ap.add_argument("--timeout", type=int, default=20)
    ap.add_argument("--delay", type=float, default=1.0,
                    help="seconds between requests; be polite to archive.org")
    ap.add_argument("--json", dest="json_out", nargs="?", const=str(MANIFEST),
                    help="write the manifest (default docs/source-archives.json)")
    args = ap.parse_args()

    if not (args.check or args.save):
        ap.error("pass --check or --save")

    dirs = PRIORITY_DIRS if args.priority else (args.only or CONTENT_DIRS)
    urls = collect_urls(REPO_ROOT, dirs)
    ordered = sorted(urls)
    if args.limit:
        ordered = ordered[: args.limit]

    today = dt.date.today()
    archived: dict[str, dict] = {}
    missing: list[str] = []
    stale: list[tuple[str, int]] = []

    print("=" * 72)
    print("SOURCE ARCHIVE COVERAGE")
    print("=" * 72)
    print(f"Sections   : {', '.join(dirs)}")
    print(f"Unique URLs: {len(urls)}" + (f" (checking {len(ordered)})" if args.limit else ""))
    print(f"Plain http://: {sum(1 for u in urls if u.startswith('http://'))}")
    print()

    for i, url in enumerate(ordered, 1):
        snap = wayback_lookup(url, args.timeout)
        if snap:
            age = snapshot_age_days(snap["timestamp"], today)
            archived[url] = {
                "archive": snap["url"],
                "captured": snap["timestamp"][:8],
                "age_days": age,
                "cited_in": urls[url],
            }
            if args.stale and age is not None and age > args.stale:
                stale.append((url, age))
        else:
            missing.append(url)
        if i % 25 == 0:
            print(f"  ...{i}/{len(ordered)}")
        time.sleep(args.delay)

    total = len(ordered) or 1
    pct = round(100 * len(archived) / total)
    print()
    print(f"Archived   : {len(archived)}/{len(ordered)}  ({pct}%)")
    print(f"No snapshot: {len(missing)}")
    if args.stale:
        print(f"Stale (>{args.stale}d): {len(stale)}")
    print()

    if missing:
        print("UNARCHIVED — a dead link here leaves no record of what was cited:")
        for url in missing[:30]:
            where = ", ".join(urls[url][:2])
            print(f"  {url}\n      cited in {where}")
        if len(missing) > 30:
            print(f"  ... and {len(missing) - 30} more")
        print()

    if stale:
        print(f"STALE SNAPSHOTS (older than {args.stale} days):")
        for url, age in stale[:15]:
            print(f"  {age:>5}d  {url}")
        print()

    if args.save and missing:
        print(f"Submitting {len(missing)} URLs to the Wayback Machine...")
        ok = 0
        for i, url in enumerate(missing, 1):
            if wayback_save(url, args.timeout):
                ok += 1
            else:
                print(f"  failed: {url}")
            if i % 10 == 0:
                print(f"  ...{i}/{len(missing)} ({ok} saved)")
            time.sleep(max(args.delay, 3.0))  # archive.org save is rate-limited
        print(f"Saved {ok}/{len(missing)}.")
        print("Re-run --check to confirm; snapshots take a moment to become available.")
        print()

    if args.json_out:
        # Resolve before use: a relative --json path is not under REPO_ROOT and
        # relative_to() raises on it, which crashed the run *after* a 121-URL scan.
        out = Path(args.json_out)
        if not out.is_absolute():
            out = (REPO_ROOT / out).resolve()
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(
            json.dumps(
                {
                    "generated": today.isoformat(),
                    "sections": dirs,
                    "total_urls": len(urls),
                    "archived": len(archived),
                    "coverage_pct": pct,
                    "snapshots": archived,
                    "unarchived": {u: urls[u] for u in missing},
                },
                indent=2,
                sort_keys=True,
            ),
            encoding="utf-8",
        )
        try:
            shown = out.relative_to(REPO_ROOT)
        except ValueError:
            shown = out
        print(f"Manifest written to {shown}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
