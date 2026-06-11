---
title: "Internal: Wiki.js → Astro Starlight Migration Plan"
description: Internal planning document — not wiki content.
published: false
---

# Migration Plan: Wiki.js → Astro Starlight on Cloudflare Pages

Decided 2026-06-11. Framework: **Astro Starlight**. Hosting: **Cloudflare Pages**
(DNS already on Cloudflare). Repo: **this repo**, site scaffolding under `site/`,
content stays in place.

**Why:** the workflow is already git-first (contributions arrive by email, not wiki
accounts); Wiki.js 2.x is frozen (3.0 announced 2021, still no beta in 2026); the
DB/sync layer has caused repeated operational pain (half-imports, wedged rebases,
non-content page leaks). A static build makes "merge to main" = "published" and
retires the droplet (~$150+/yr).

## Phases

- **Phase 0 — Export DB-only state** ✅ done 2026-06-11, artifacts in this folder
- **Phase 1 — Scaffold**: `site/` with Starlight; en at root, es under `/es/`
  (URLs unchanged); content collections read existing dirs in place; frontmatter
  schema tolerates Wiki.js fields; `lastUpdated` from git
- **Phase 2 — Parity**: sidebar from `nav-export.json`; Pagefind search (en+es);
  `_redirects` (orphans + trailing-slash variants); 404, robots, sitemap; light
  theme (logo: `logo.png` here; site title/description: `site-config.json`)
- **Phase 3 — Verification**: build-time broken-link failure; URL-set diff vs
  live sitemap (every URL 200/301); es↔en switcher round-trip on all page pairs;
  axe accessibility audit; visual spot-check of ~20 high-stakes pages
- **Phase 4 — Parallel run**: deploy to `*.pages.dev` preview; review; DNS
  cutover (instantly reversible); droplet kept 2–4 weeks as rollback
- **Phase 5 — Decommission**: archive final DB backup; destroy droplet; rewrite
  CLAUDE.md + `disability-wiki-edit` skill for the static workflow

## Phase 0 findings (2026-06-11)

- **Nav**: single `en` tree, 182 items / 21 section headers → `nav-export.json`
- **Site config**: no analytics configured; default theme; title/description/logo
  → `site-config.json`, `logo.png`
- **DB↔repo reconciliation** (`page-reconciliation.json`): 570 DB pages vs 546
  repo files reconcile to **3** published DB-only pages:
  - `foundations/welcome` — in nav → **exported to repo** ✅
  - `crisis/emergency-disaster-preparedness` — in nav → **exported to repo** ✅
  - `regions/index` — empty section, no inbound links/nav → **drop + redirect to `/`**
  - 13 unpublished DB leftovers (leaked internal docs, archetypes) → drop
- **Repo case-duplicate dir**: both `rights/` and `Rights/` exist in the repo
  (DB merges them case-insensitively). Must be merged into lowercase `rights/`
  during Phase 1 — Cloudflare Pages serving is case-sensitive.
- **Content is pure GFM**: zero Wiki.js-specific markdown extensions repo-wide.
- **Live sitemap**: Wiki.js serves no sitemap.xml (0 locs) — the Phase 3 URL
  inventory must come from the DB page list (`pages{list}`) instead; Starlight
  adds a real sitemap, a small SEO gain.

## Standing cautions during migration

- Until cutover, the live site still imports anything merged to `main` —
  **run `scripts/sweep_noncontent_pages.py --apply` after merging any non-content
  `.md`** (including this folder).
- `site/` build output and node_modules must be gitignored; only `.md`/`.html`
  leak into Wiki.js imports, but keep the tree clean anyway.
- Do not restructure content paths during the migration: URL preservation is the
  SEO and link-integrity guarantee.
