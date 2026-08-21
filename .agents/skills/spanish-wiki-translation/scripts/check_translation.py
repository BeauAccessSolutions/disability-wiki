#!/usr/bin/env python3
"""
check_translation.py — lint a translated Spanish wiki page.

Catches the mechanical failure modes and known bad-term regressions that a
native-speaker review of the pilot surfaced. It does NOT judge translation
quality (a human/fluent reviewer does that) — it verifies the things a script
can verify reliably and cheaply.

Usage:
    python check_translation.py es/path/to/page.md [es/another.md ...]
    python check_translation.py --all          # check every file under es/

Exit code 0 = clean, 1 = warnings found. Run it from the repo root.
"""
import argparse
import re
import sys
from pathlib import Path

ASSET_EXT = (".png", ".svg", ".jpg", ".jpeg", ".gif", ".pdf", ".webp", ".ico")

# Markdown links: capture the URL/target inside ](...)
LINK_RE = re.compile(r"\]\(([^)]+)\)")

# Substrings that indicate an un-applied glossary rule (regressions from review).
BAD_TERMS = {
    "carga excesiva": 'use "dificultad excesiva" (undue hardship) or "carga onerosa" (undue burden)',
    "justicia para la discapacidad": 'use "justicia para las personas con discapacidad"',
    "centra la experiencia": 'use "pone en el centro los conocimientos" (expertise, not experience)',
    "divulgación de la discapacidad": 'use "comunicación/revelación de la discapacidad" (disclosure, not publicity)',
    "los discapacitados": 'use person-first "las personas con discapacidad"',
    "minusválid": 'offensive — use "personas con discapacidad"',
}


def check_file(path: Path) -> list[str]:
    warnings: list[str] = []
    if "es/" not in str(path).replace("\\", "/") and not str(path).startswith("es"):
        warnings.append(f"path is not under es/ — Spanish pages must live at es/<same path> ({path})")

    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()

    # --- Frontmatter: title + description present and not obviously English-untouched
    if not text.startswith("---"):
        warnings.append("missing YAML frontmatter")
    else:
        fm = text.split("---", 2)[1] if text.count("---") >= 2 else ""
        for key in ("title:", "description:"):
            if key not in fm:
                warnings.append(f"frontmatter missing {key}")

    # --- Internal links must be /es/-prefixed (skip external, anchors, assets)
    for i, line in enumerate(lines, 1):
        for target in LINK_RE.findall(line):
            t = target.strip()
            if not t.startswith("/"):
                continue  # external (http), anchor (#), mailto, relative — leave alone
            low = t.lower()
            if low.endswith(ASSET_EXT):
                continue  # shared asset, stays at root
            if not t.startswith("/es/"):
                warnings.append(f"line {i}: internal link not /es/-prefixed: {t}")

    # --- Known bad terms (glossary regressions)
    low_text = text.lower()
    for term, advice in BAD_TERMS.items():
        if term in low_text:
            # report each line for actionability
            for i, line in enumerate(lines, 1):
                if term in line.lower():
                    warnings.append(f"line {i}: bad term '{term}' — {advice}")

    return warnings


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="*", help="es/ markdown files to check")
    ap.add_argument("--all", action="store_true", help="check every file under es/")
    args = ap.parse_args()

    paths: list[Path] = []
    if args.all:
        paths = sorted(Path("es").rglob("*.md"))
    else:
        paths = [Path(f) for f in args.files]
    if not paths:
        print("no files to check (pass paths or --all)")
        return 1

    total = 0
    for p in paths:
        if not p.exists():
            print(f"✗ {p}: file not found")
            total += 1
            continue
        warns = check_file(p)
        if warns:
            total += len(warns)
            print(f"✗ {p}")
            for w in warns:
                print(f"    - {w}")
        else:
            print(f"✓ {p}")

    print()
    if total:
        print(f"{total} warning(s) found.")
        return 1
    print("All checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
