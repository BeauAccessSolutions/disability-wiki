---
title: "Internal: Phase 3 Verification Report"
published: false
---

# Phase 3 Verification — 2026-06-12

Build verified: `site/` @ main, 531 pages + 539 generated index-alias redirects.

| Check | Result |
|---|---|
| Live published URLs (537) resolve in build | **537/537** (536 built, 1 by design: `/regions` → `/` redirect) |
| Internal links in rendered HTML | **143,514 checked, 0 broken** |
| Language switcher round-trip | **100%** of content pages (only build artifacts unpaired: 404, redirect stubs) |
| axe accessibility audit (8-page sample: home, crisis index, hotline leaf, FAQ, pain page, 404, es home, es crisis) | **0 violations** on every page |

## Fixes that came out of verification
- **17 genuinely broken Spanish links fixed** (14 files) — broken on the live site today, missed by `validate_wiki_links.py` (es slug checking gap, see below): wrong community slugs (`/es/community/discord-communities` → `online-communities/discord`), long-form condition slugs (`ehlers-danlos-syndrome` → `EDS`), shorthand crisis paths (`/es/crisis/nigeria` → full region path), one wrong-region path (Indonesia filed under south-america), `/es/accessibility-statement` → `/es/start/accessibility-statement`.
- **Case redirects** for `/conditions/{EDS,MCAS,POTS}` (+ es): Wiki.js URLs are case-sensitive uppercase; Starlight slugs are lowercase.
- **`tools/gen-index-redirects.mjs`** (runs in `npm run build`): generates `/<page>/index → /<page>` 301s + meta-refresh pages for all 539 pages — every Wiki.js-era section-index URL keeps working.

## Known follow-up
- `scripts/validate_wiki_links.py` does not catch es-slug mismatches that differ from EN file layout — that's how the 17 broken links survived repeated "0 broken" runs. Worth a fix if the validator outlives the migration (post-cutover, the static build's own link check supersedes it).
