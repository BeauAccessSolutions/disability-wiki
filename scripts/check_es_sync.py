#!/usr/bin/env python3
"""Flag English pages edited after their Spanish counterpart was last touched.

The wiki keeps a full es/ mirror (273 of 275 pages), but nothing noticed when
an English page changed and its Spanish twin did not. On 2026-08-21 eight
pairs had drifted — four of them crisis pages, where a stale Spanish hotline
list is exactly the failure the offline precache exists to prevent.

Method: compare the last git commit touching <path>.md with the last commit
touching es/<path>.md. EN newer than ES => flagged. Pages with no counterpart
are reported separately (that is a translation gap, not a sync gap).

Exit codes: 0 by default (advisory). --strict exits 1 on ANY drift.
--strict-prefix PREFIX (repeatable) exits 1 only for drift under those
directories, e.g. --strict-prefix crisis — blocking where stale content is
life-safety, advisory elsewhere. Run from the repo root.
"""

import argparse
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NON_CONTENT = {
    "site", "scripts", "docs", "backups", "app", "node_modules", "es",
    ".git", ".github", ".claude", ".agents", ".codex",
    "page-review-2026-06-05", "_desktop_inbox",
}


def last_commit(path):
    """ISO date of the last commit touching path, or '' if untracked."""
    r = subprocess.run(
        ["git", "log", "-1", "--format=%cs", "--", str(path)],
        cwd=ROOT, capture_output=True, text=True,
    )
    return r.stdout.strip()


def content_pages():
    for p in sorted(ROOT.rglob("*.md")):
        rel = p.relative_to(ROOT)
        if rel.parts[0] in NON_CONTENT or len(rel.parts) == 1:
            continue  # skip non-content trees and root-level docs
        yield rel


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--strict", action="store_true", help="exit 1 on any drift")
    ap.add_argument("--strict-prefix", action="append", default=[],
                    metavar="DIR", help="exit 1 only for drift under DIR (repeatable)")
    args = ap.parse_args()

    drifted, missing = [], []
    for rel in content_pages():
        es = ROOT / "es" / rel
        if not es.exists():
            missing.append(rel)
            continue
        en_d, es_d = last_commit(rel), last_commit(Path("es") / rel)
        if en_d and es_d and en_d > es_d:
            drifted.append((rel, en_d, es_d))

    if drifted:
        print(f"ES sync: {len(drifted)} English page(s) edited after their Spanish counterpart\n")
        for rel, en_d, es_d in drifted:
            print(f"  {rel}   EN {en_d} > ES {es_d}")
        print("\nSync each es/ page to the English change (spanish-wiki-translation skill,"
              "\n'syncing' workflow: the English git diff is the spec).")
    else:
        print("ES sync: every Spanish counterpart is at least as recent as its English page.")
    if missing:
        print(f"\n{len(missing)} English page(s) have no es/ counterpart (translation gap, not drift):")
        for rel in missing:
            print(f"  {rel}")

    blocking = [d for d in drifted
                if args.strict or any(str(d[0]).startswith(pfx.rstrip('/') + '/')
                                      for pfx in args.strict_prefix)]
    if blocking:
        print(f"\n✗ {len(blocking)} drift(s) in blocking scope — failing.")
        sys.exit(1)


if __name__ == "__main__":
    main()
