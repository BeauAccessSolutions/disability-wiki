---
name: wiki-link-hygiene
description: >-
  Find and fix broken internal links on the disability-wiki. Use when the user
  wants to "fix broken links", "run the link validator", "clean up dead links",
  "check internal links", or act on the broken-link triage backlog. Covers the
  validator, the mechanical/case/missing triage, the Wiki.js case-sensitive-slug
  and .md-in-path gotchas, safe batch-fixing across English content, and producing
  a create-vs-repoint-vs-remove list for genuinely missing pages.
---

# Wiki Link Hygiene

Internal links break constantly on this wiki (renamed pages, hyphenated-vs-slash
paths, missing landing pages). Most "broken links" are **wrong paths to pages that
exist** — fixable mechanically and safely. A minority are **genuinely missing
pages**, which need a content decision. This skill separates the two and clears the
first cheaply.

## Step 1 — Run the validator

```
python3 scripts/validate_wiki_links.py        # writes link_validation_report.txt (gitignored)
```

It scans **only `published: true` English pages** (skips `es/`, docs, backups,
drafts, and root meta-docs like README/AUDIT_*). The report lists each broken link
with its source file. Tally the most-referenced missing targets:

```
grep "URL:" link_validation_report.txt | sed 's/.*URL: //;s/#.*//;s/\.md$//' | sort | uniq -c | sort -rn
```

## Step 2 — Triage each broken target into three buckets

For every distinct broken target, check whether the page exists under a corrected path:

- **(a) Mechanical** — target exists at a different path. The big recurring families:
  - `.md` suffix in a public path → drop it (`/benefits/us-ssi.md` is wrong twice over).
  - **Hyphenated vs slash**: `/benefits/us-ssi` → `/benefits/us/ssi`; `/benefits/uk-benefits`
    → `/benefits/united-kingdom/benefits`; `/crisis/brazil` →
    `/crisis/crisis-hotlines/south-america/brazil`.
  - **Long-name vs slug**: `/conditions/mast-cell-activation-syndrome` → `/conditions/MCAS`.
  - **Section landing**: `/community/discord-communities` → `/community/online-communities/discord`.
- **(b) Case** — target exists but the slug case is wrong. **See the Wiki.js gotcha below.**
- **(c) Missing** — no page exists anywhere. Goes to the triage doc (Step 4).

Confirm a target exists before rewriting: `ls path.md` or `ls path/index.md`.

## The Wiki.js case gotcha (do not skip)

Wiki.js Git storage serves a page at its **exact file-basename path**, and live URLs
are **case-sensitive** on the Linux server. The files are e.g. `conditions/POTS.md`,
so the live page is `/conditions/POTS` — and `/conditions/pots` **404s**.

**macOS's case-insensitive filesystem hides this**: the validator (and `ls`) will say
`/conditions/pots` resolves because `pots.md` matches `POTS.md` locally. So for any
case-ambiguous fix, **verify against the live site** before committing:

```
# 200 vs 404 is the authority, not the local filesystem
WebFetch https://disabilitywiki.org/conditions/POTS   # resolves
WebFetch https://disabilitywiki.org/conditions/pots   # 404
```

Match the file-basename case exactly.

## Step 3 — Batch-fix the mechanical/case buckets

Build a verified `{wrong: right}` map, then string-replace across **English content
only**. Skip `es/` (separate locale + sync workflow), `docs/`, `backups/`,
`archetypes/`, `page-review-*/`, `scripts/`, `content/`, and **root meta-docs**
(AUDIT_*, README — they *describe* broken links; rewriting them corrupts the record).

```python
import subprocess, pathlib
REPL = { "/benefits/us-ssi.md": "/benefits/us/ssi", ... }   # only verified-existing targets
skip = ("es/","docs/","backups/","archetypes/","page-review-2026-06-05/","scripts/","content/")
for f in subprocess.check_output("git ls-files '*.md'", shell=True, text=True).split():
    if f.startswith(skip) or "/" not in f:   # "/" not in f skips root meta-docs
        continue
    p = pathlib.Path(f); t = p.read_text("utf-8"); orig = t
    for a, b in REPL.items(): t = t.replace(a, b)
    if t != orig: p.write_text(t, "utf-8")
```

String-replacing the path also fixes any `#anchor` suffix for free. Watch for
substring collisions (`us-ssi.md` vs `us-ssdi.md` — distinct; fine). **Re-run the
validator** to confirm the count dropped and the targets are gone. Commit per
bucket with a clear message; flag any touched page's `es/` counterpart as out of sync.

## Step 4 — Triage the genuinely-missing pages (don't auto-create)

These need a human content call. Write a dated triage doc under `docs/` with, per
target: ref-count, recommended action, and the source files. Actions:

- **Repoint** when intent is obvious and a near-neighbor exists (`/about/accessibility`
  → `/accessibility-statement`; `/history/accommodations-history` → `/history/accommodations`).
- **Create an `index.md`** for sections that have content pages but no landing
  (most sections *do* have one — match the convention).
- **Create the page** (real topic, high inbound) — use the `disability-wiki-page`
  skill for house voice + sourcing.
- **Remove** the link only as a last resort.

Surface the create-vs-repoint-vs-remove choices to the user; don't invent pages silently.

## Keep the validator honest

If the validator ever reports an implausible total (e.g. the old base-dir bug that
scanned 0 files, or a flood of false positives), fix the validator first — its
totals gate the whole cleanup. It must: point `BASE_DIR` at the repo root, exclude
non-content trees, scan only published pages, and normalize `#anchors`/`.md`/trailing
slashes before resolving (`path.md` **or** `path/index.md`).
