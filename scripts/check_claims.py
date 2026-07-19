#!/usr/bin/env python3
"""Claim-integrity checker for disabilitywiki.org.

Adapted in spirit from the Langworthywatch fact-check validator. That tool
validates that *verification happened* rather than trying to adjudicate truth:
it checks a Sources section exists, that external URLs have archive backups,
and that the claims-to-sources ratio is sane.

This wiki's structure differs. Reference pages don't carry per-page Sources
sections; verification lives centrally in docs/CLAIMS.md. So the analog is:

  their per-page Sources section  ->  our CLAIMS.md ledger
  their archive.org backup check  ->  our archive column + org URL liveness
  their claims regex              ->  same idea, load-bearing figure detection
  their credibility score         ->  our ledger coverage score

Plus one check their domain doesn't need: a REGRESSION GUARD. A verification
pass that rejects a claim produces knowledge that is otherwise lost the moment
the session ends. Six months later the same bad source gets re-imported and the
same wrong number ships again. Rejected claims are recorded in CLAIMS.md and
this script fails the build if one reappears.

Exit codes:
    0  no blocking problems
    1  a rejected claim reappeared in published content (blocking)
    2  bad invocation / ledger unparseable

Advisory findings (stale rows, unledgered figures, dead org URLs) report but
do not block, matching how check_accessibility.py already behaves.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import sys
from dataclasses import dataclass, field, asdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
LEDGER = REPO_ROOT / "docs" / "CLAIMS.md"

# Content lives in category dirs at the repo root and is symlinked into the
# Astro build. Anything not in this list is not published.
CONTENT_DIRS = [
    "benefits", "community", "conditions", "crisis", "daily-living",
    "education", "employment", "foundations", "get-involved", "glossary",
    "healthcare", "history", "housing", "intersectionality", "media",
    "professionals", "relationships", "research", "rights", "sports",
    "start", "tech", "transport", "es",
]

# Re-verification windows. Crisis numbers are the tightest because the ledger
# itself says hotlines change numbers and hours.
STALENESS_DAYS = {
    "crisis": 365,
    "benefits": 365,
    "policy": 180,
    "default": 730,
}

# Figures a reader would act on. Deliberately narrow: broad numeric matching
# drowns the signal in dates, list counts, and prose.
LOAD_BEARING = [
    re.compile(r"\$\s?\d[\d,]*(?:\.\d+)?\s*(?:billion|million|thousand|k\b)?", re.I),
    re.compile(r"\b\d[\d,]*\s*(?:people|women|children|victims|workers|survivors)\b", re.I),
    re.compile(r"\b\d{1,3}(?:\.\d+)?\s?(?:percent|%)", re.I),
    re.compile(r"\b(?:1-)?\d{3}[-.\s]\d{3}[-.\s]\d{4}\b"),
]

ARCHIVE_RE = re.compile(r"https?://(?:web\.archive\.org|archive\.(?:is|today|ph))/\S+")
EXTERNAL_URL_RE = re.compile(r"\]\((https?://[^)\s]+)\)")


@dataclass
class Finding:
    severity: str          # "blocking" | "advisory"
    kind: str
    detail: str
    path: str = ""
    line: int = 0

    def render(self) -> str:
        loc = f"{self.path}:{self.line}" if self.path else "docs/CLAIMS.md"
        mark = "FAIL" if self.severity == "blocking" else "warn"
        return f"  [{mark}] {loc}\n         {self.kind}: {self.detail}"


@dataclass
class Ledger:
    rejected: list[dict] = field(default_factory=list)
    verified_dates: list[tuple[str, str]] = field(default_factory=list)
    archived: int = 0
    total_rows: int = 0


def parse_ledger(path: Path) -> Ledger:
    """Pull machine-readable state out of CLAIMS.md.

    Rejected claims live in a fenced block so they survive prose edits around
    them. Format, one per line:

        <tier> :: <pattern> :: <why>

    where tier is `blocking` or `advisory` and pattern is a regex. The delimiter
    is `::` rather than `|` because the patterns themselves use `|` for regex
    alternation, which silently mangles the split.
    """
    if not path.exists():
        print(f"error: ledger not found at {path}", file=sys.stderr)
        sys.exit(2)

    text = path.read_text(encoding="utf-8")
    led = Ledger()

    block = re.search(
        r"<!--\s*REJECTED-CLAIMS:START\s*-->(.*?)<!--\s*REJECTED-CLAIMS:END\s*-->",
        text,
        re.S,
    )
    if block:
        for raw in block.group(1).splitlines():
            line = raw.strip()
            if not line or line.startswith(("#", "```", "<!--")):
                continue
            parts = [p.strip() for p in line.split("::")]
            if len(parts) < 3:
                continue
            tier, pattern, why = parts[0], parts[1], "::".join(parts[2:])
            try:
                compiled = re.compile(pattern, re.I)
            except re.error as exc:
                print(f"error: bad regex in ledger: {pattern!r} ({exc})", file=sys.stderr)
                sys.exit(2)
            led.rejected.append({"tier": tier, "re": compiled, "raw": pattern, "why": why})

    # Verified dates from ledger tables: "| ... | 2026-07 | ✅ |"
    for m in re.finditer(r"\|\s*(\d{4}-\d{2})\s*\|\s*[✅⚠️⬜🗄️]", text):
        line_no = text[: m.start()].count("\n") + 1
        led.verified_dates.append((m.group(1), str(line_no)))

    led.total_rows = len(re.findall(r"^\|.*\|\s*[✅⚠️⬜🗄️].*\|?\s*$", text, re.M))
    led.archived = len(ARCHIVE_RE.findall(text))
    return led


def iter_content(root: Path, only: list[str] | None = None):
    targets = only if only else CONTENT_DIRS
    for d in targets:
        base = root / d
        if not base.exists():
            continue
        for p in sorted(base.rglob("*.md")):
            yield p


def check_regressions(files, led: Ledger) -> list[Finding]:
    """The core guard: a claim we already rejected must not reappear."""
    out: list[Finding] = []
    if not led.rejected:
        return out
    for path in files:
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except (OSError, UnicodeDecodeError):
            continue
        for i, line in enumerate(lines, 1):
            for rej in led.rejected:
                if rej["re"].search(line):
                    out.append(
                        Finding(
                            severity="blocking" if rej["tier"] == "blocking" else "advisory",
                            kind="rejected-claim",
                            detail=f"matches {rej['raw']!r} — {rej['why']}",
                            path=str(path.relative_to(REPO_ROOT)),
                            line=i,
                        )
                    )
    return out


def check_staleness(led: Ledger, today: dt.date) -> list[Finding]:
    out: list[Finding] = []
    window = STALENESS_DAYS["default"]
    for stamp, line_no in led.verified_dates:
        try:
            when = dt.datetime.strptime(stamp + "-01", "%Y-%m-%d").date()
        except ValueError:
            continue
        age = (today - when).days
        if age > window:
            out.append(
                Finding(
                    severity="advisory",
                    kind="stale-ledger-row",
                    detail=f"verified {stamp}, {age} days ago (window {window}d) — re-verify",
                    line=int(line_no),
                )
            )
    return out


def check_unledgered_figures(files, led: Ledger, limit: int) -> list[Finding]:
    """Advisory: load-bearing figures in content with no ledger row.

    Crude by construction. It cannot know whether a figure is important, only
    whether anyone wrote it down. Noise here is the cost of catching the one
    unsourced number that matters.
    """
    out: list[Finding] = []
    ledger_text = LEDGER.read_text(encoding="utf-8") if LEDGER.exists() else ""
    for path in files:
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except (OSError, UnicodeDecodeError):
            continue
        for i, line in enumerate(lines, 1):
            if line.startswith(("|", ">", "    ")):
                continue
            for pat in LOAD_BEARING:
                m = pat.search(line)
                if not m:
                    continue
                figure = m.group(0).strip()
                digits = re.sub(r"[^\d]", "", figure)
                if len(digits) < 3:
                    continue
                if digits and digits in re.sub(r"[^\d]", "", ledger_text):
                    continue
                out.append(
                    Finding(
                        severity="advisory",
                        kind="unledgered-figure",
                        detail=f"{figure!r} has no docs/CLAIMS.md row",
                        path=str(path.relative_to(REPO_ROOT)),
                        line=i,
                    )
                )
                break
    return out[:limit]


def check_org_urls(files, timeout: int) -> list[Finding]:
    """Link rot defense. Off by default; needs network."""
    import urllib.error
    import urllib.request

    out: list[Finding] = []
    seen: set[str] = set()
    ua = "Mozilla/5.0 (compatible; disability-wiki-linkcheck/1.0)"
    for path in files:
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        for m in EXTERNAL_URL_RE.finditer(text):
            url = m.group(1)
            if url in seen or "archive.org" in url or "archive.is" in url:
                continue
            seen.add(url)
            line = text[: m.start()].count("\n") + 1
            req = urllib.request.Request(url, headers={"User-Agent": ua}, method="HEAD")
            try:
                with urllib.request.urlopen(req, timeout=timeout) as resp:
                    if resp.status >= 400:
                        raise urllib.error.HTTPError(url, resp.status, "", {}, None)
            except urllib.error.HTTPError as exc:
                # 403 is usually bot-blocking, not death. Report it as such.
                kind = "org-url-blocked" if exc.code in (401, 403, 429) else "org-url-dead"
                out.append(
                    Finding("advisory", kind, f"{url} -> HTTP {exc.code}",
                            str(path.relative_to(REPO_ROOT)), line)
                )
            except Exception as exc:  # noqa: BLE001 - network is varied and noisy
                out.append(
                    Finding("advisory", "org-url-unreachable", f"{url} -> {type(exc).__name__}",
                            str(path.relative_to(REPO_ROOT)), line)
                )
    return out


def score(led: Ledger, blocking: int, advisory: int) -> int:
    """Coverage score, borrowed from the Langworthywatch credibility score.

    Measures how well-tended the ledger is, not whether the wiki is true.
    """
    s = 100
    s -= blocking * 20
    s -= min(advisory, 20) * 1
    if led.total_rows and led.archived == 0:
        s -= 10  # sources recorded, none archived
    return max(0, s)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--strict", action="store_true",
                    help="treat advisory findings as blocking too")
    ap.add_argument("--check-urls", action="store_true",
                    help="check external org URLs resolve (needs network, slow)")
    ap.add_argument("--timeout", type=int, default=12)
    ap.add_argument("--only", nargs="*", help="limit to these content dirs")
    ap.add_argument("--max-figures", type=int, default=40,
                    help="cap unledgered-figure findings (0 disables the check)")
    ap.add_argument("--json", dest="json_out", help="write a JSON report here")
    args = ap.parse_args()

    led = parse_ledger(LEDGER)
    files = list(iter_content(REPO_ROOT, args.only))

    findings: list[Finding] = []
    findings += check_regressions(files, led)
    findings += check_staleness(led, dt.date.today())
    if args.max_figures:
        findings += check_unledgered_figures(files, led, args.max_figures)
    if args.check_urls:
        findings += check_org_urls(files, args.timeout)

    blocking = [f for f in findings if f.severity == "blocking"]
    advisory = [f for f in findings if f.severity == "advisory"]

    print("=" * 72)
    print("CLAIM INTEGRITY CHECK")
    print("=" * 72)
    print(f"Content files scanned : {len(files)}")
    print(f"Ledger rows           : {led.total_rows}")
    print(f"Rejected-claim rules  : {len(led.rejected)}")
    print(f"Archive backups       : {led.archived}")
    print(f"Coverage score        : {score(led, len(blocking), len(advisory))}/100")
    print()

    if blocking:
        print(f"BLOCKING ({len(blocking)}) — a previously rejected claim is back:")
        for f in blocking:
            print(f.render())
        print()

    if advisory:
        by_kind: dict[str, list[Finding]] = {}
        for f in advisory:
            by_kind.setdefault(f.kind, []).append(f)
        print(f"ADVISORY ({len(advisory)}):")
        for kind, group in sorted(by_kind.items()):
            print(f"  {kind}: {len(group)}")
            for f in group[:5]:
                print(f.render())
            if len(group) > 5:
                print(f"         ... and {len(group) - 5} more")
        print()

    if not findings:
        print("No findings.\n")

    if args.json_out:
        Path(args.json_out).write_text(
            json.dumps(
                {
                    "scanned": len(files),
                    "ledger_rows": led.total_rows,
                    "score": score(led, len(blocking), len(advisory)),
                    "findings": [asdict(f) for f in findings],
                },
                indent=2,
            ),
            encoding="utf-8",
        )

    if blocking:
        return 1
    if args.strict and advisory:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
