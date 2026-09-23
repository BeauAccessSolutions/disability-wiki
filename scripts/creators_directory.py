#!/usr/bin/env python3
"""Generate the Disabled Creators Directory tables from data/creators.yaml.

The directory lists named, living people alongside their disabilities, and it
had drifted: the same creator appeared in several tables with different labels,
and every row existed twice (EN + es) by hand. Now each creator is ONE entry in
data/creators.yaml, and this script writes the tables into both pages between
marker comments:

    <!-- creators:nonfiction -->
    ...generated table...
    <!-- /creators:nonfiction -->

Everything outside the markers (intro, headings, "Suggest a creator", support
tips) stays hand-written. Rows are sorted by name.

Validation (both modes):
  - every entry has a name, a disability (en + es), and at least one listing
  - listings name a known section and fill exactly that section's fields
  - no duplicate names, no '|' or newlines in cells
  - an entry must have a public `disclosure_source` URL unless it is marked
    `legacy: true` (listed before the 2026-09-23 sourcing rule; see the
    "Suggest a creator" section of the page). New entries cannot be legacy.

Usage (repo root):
  python3 scripts/creators_directory.py           # rewrite the tables
  python3 scripts/creators_directory.py --check   # CI: exit 1 on invalid data
                                                  # or tables out of date
Requires PyYAML.
"""

import argparse
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "creators.yaml"
PAGES = {
    "en": ROOT / "media" / "disabled-creators-directory.md",
    "es": ROOT / "es" / "media" / "disabled-creators-directory.md",
}
NON_US = {"en": "*(non-US)*", "es": "*(fuera de EE. UU.)*"}
LANGS = ("en", "es")
ENTRY_KEYS = {"name", "years", "disability", "non_us", "disclosure_source",
              "website", "verified", "legacy", "listings"}
LEGACY_LIMIT = 111  # legacy entries at migration (2026-09-23); may only go down


def text(value, lang):
    """A cell value is a plain string (same in both languages) or {en, es}."""
    if isinstance(value, dict):
        return value[lang]
    return str(value)


def validate(data):
    errors = []
    sections = {s["key"]: s for s in data["sections"]}
    for s in data["sections"]:
        for lang in LANGS:
            if len(s["columns"][lang]) != len(s["fields"]):
                errors.append(f"section {s['key']}: {lang} columns don't match fields")

    def check_value(where, value):
        if isinstance(value, dict):
            if set(value) != set(LANGS):
                errors.append(f"{where}: needs exactly 'en' and 'es'")
                return
            vals = value.values()
        elif isinstance(value, str) and value.strip():
            vals = [value]
        else:
            errors.append(f"{where}: missing or empty")
            return
        for v in vals:
            if not isinstance(v, str) or not v.strip():
                errors.append(f"{where}: empty translation")
            elif "|" in v or "\n" in v:
                errors.append(f"{where}: contains '|' or a newline")

    seen = set()
    legacy = 0
    for i, c in enumerate(data["creators"]):
        label = text(c.get("name", f"entry #{i + 1}"), "en")
        where = f"creator '{label}'"
        extra = set(c) - ENTRY_KEYS
        if extra:
            errors.append(f"{where}: unknown keys {sorted(extra)}")
        check_value(f"{where} name", c.get("name"))
        check_value(f"{where} disability", c.get("disability"))
        if label in seen:
            errors.append(f"{where}: duplicate entry")
        seen.add(label)

        src = c.get("disclosure_source")
        if c.get("legacy"):
            legacy += 1
        elif not (isinstance(src, str) and re.match(r"https?://", src)):
            errors.append(f"{where}: needs a disclosure_source URL (where the "
                          "creator discloses their disability publicly)")

        listings = c.get("listings") or []
        if not listings:
            errors.append(f"{where}: no listings")
        for li in listings:
            sec = sections.get(li.get("section"))
            if not sec:
                errors.append(f"{where}: unknown section {li.get('section')!r}")
                continue
            given = set(li) - {"section"}
            if given != set(sec["fields"]):
                errors.append(f"{where} in {sec['key']}: expected fields "
                              f"{sec['fields']}, got {sorted(given)}")
                continue
            for f in sec["fields"]:
                check_value(f"{where} {sec['key']}.{f}", li[f])

    if legacy > LEGACY_LIMIT:
        errors.append(f"{legacy} legacy entries (limit {LEGACY_LIMIT}): new "
                      "creators need a disclosure_source, not legacy: true")
    return errors, legacy


def render_table(section, rows, lang):
    cols = ["Name" if lang == "en" else "Nombre",
            "Disability" if lang == "en" else "Discapacidad"] + section["columns"][lang]
    widths = [4, 10] + [max(5, len(c)) for c in section["columns"][lang]]
    out = ["| " + " | ".join(cols) + " |",
           "|" + "|".join("-" * (w + 2) for w in widths) + "|"]
    for creator, listing in rows:
        name = text(creator["name"], lang)
        if creator.get("years"):
            name += f" ({creator['years']})"
        cells = [name, text(creator["disability"], lang)]
        cells += [text(listing[f], lang) for f in section["fields"]]
        if creator.get("non_us"):
            cells[-1] += " " + NON_US[lang]
        out.append("| " + " | ".join(cells) + " |")
    return "\n".join(out)


def build_page(page_text, data, lang):
    by_section = {s["key"]: [] for s in data["sections"]}
    for c in data["creators"]:
        for li in c["listings"]:
            by_section[li["section"]].append((c, li))
    for key, rows in by_section.items():
        rows.sort(key=lambda r: text(r[0]["name"], "en").casefold())

    missing = []
    for s in data["sections"]:
        pattern = re.compile(
            rf"(<!-- creators:{re.escape(s['key'])} -->\n).*?(\n<!-- /creators:{re.escape(s['key'])} -->)",
            re.S)
        if not pattern.search(page_text):
            missing.append(s["key"])
            continue
        table = render_table(s, by_section[s["key"]], lang)
        page_text = pattern.sub(lambda m: m.group(1) + table + m.group(2), page_text)
    return page_text, missing


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--check", action="store_true",
                    help="don't write; exit 1 if data is invalid or tables are stale")
    args = ap.parse_args()

    data = yaml.safe_load(DATA.read_text(encoding="utf-8"))
    errors, legacy = validate(data)
    if errors:
        print(f"{DATA.relative_to(ROOT)}: {len(errors)} problem(s)")
        for e in errors:
            print(f"  - {e}")
        return 1

    stale = []
    for lang, path in PAGES.items():
        current = path.read_text(encoding="utf-8")
        new, missing = build_page(current, data, lang)
        if missing:
            print(f"{path.relative_to(ROOT)}: no markers for sections {missing}")
            return 1
        if new != current:
            stale.append(path.relative_to(ROOT))
            if not args.check:
                path.write_text(new, encoding="utf-8")

    n = len(data["creators"])
    print(f"{n} creators, {legacy} legacy entries still need a disclosure_source")
    if stale and args.check:
        print("Tables are out of date with data/creators.yaml. Run:")
        print("  python3 scripts/creators_directory.py")
        for p in stale:
            print(f"  - {p}")
        return 1
    for p in stale:
        print(f"updated {p}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
