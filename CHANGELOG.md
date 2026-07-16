# Changelog

All notable changes to the Disability Wiki project are documented in this file.

---

## [Unreleased]

### Added
- **Zero-JS contribution UI** (2026-07-14, Phase 2/3): `src/pages/contribute.astro`
  (+ `contribute/{thanks,sign-in-required,error}`) — a suggest-edit / propose-page
  form rendered via `StarlightPage` (full site chrome, theme, a11y). No script:
  native HTML validation (`required`/`minlength`/`maxlength`) runs client-side, and
  the endpoint now accepts native `application/x-www-form-urlencoded` posts and
  answers browsers with a **303** to a static outcome page (JSON clients still get
  JSON). Category options are single-sourced from the validator's `CONTENT_CATEGORIES`.
  Verified end-to-end in a browser: fill + submit → Thank-you page; and fail-closed
  (no auth) → sign-in-required (no data stored). Not linked in nav yet — direct
  visitors hit a graceful sign-in-required until auth is live.
- **Keycloak auth core (BFF)** (2026-07-14, Phase 3): the server-side identity
  layer for gated contribution, mirroring Access Atlas's BFF (browser only ever
  holds an httpOnly session cookie — keeps contribute pages zero-JS, keeps the OIDC
  token server-side, BAS invariant #1). `site/src/lib/auth/`: OIDC Auth-Code+PKCE
  (`oidc.ts`, WebCrypto), id_token verification via **`jose`** against Keycloak's
  JWKS (`verify.ts` — never hand-rolled), the app's own **revocable** session
  (`session.ts` — httpOnly cookie, only the SHA-256 hash stored, so a DB leak can't
  be replayed), and `resolve.ts` which turns a session cookie into a pairwise `sub`.
  The write endpoint's `resolveSub` is now wired to it — fail-closed at every step
  (not-configured / no-cookie / no-live-session → refused). Migration
  `0002_contributor_identity.sql` adds `contributors` + `contributor_sessions`
  (RLS on, service_role-only). **23 unit tests, incl. 6 negative auth cases**
  (wrong audience/issuer, expired, nonce-replay, forged-key). Enables only when
  `KEYCLOAK_*` env is set. Deferred (needs a registered Keycloak client to
  integration-test): the `/auth/login|callback|logout` HTTP routes.
- **Contribution store — Supabase** (2026-07-14, Phase 2): `SupabaseContributionStore`
  behind the existing `ContributionStore` interface — a dependency-free PostgREST insert
  (plain `fetch`, bundles cleanly in the Pages Function/workerd runtime) using the
  server-only **service-role** key. `selectStore(env)` uses it when `SUPABASE_URL` +
  `SUPABASE_SERVICE_ROLE_KEY` are set, else the no-persistence stub. Migration
  `site/supabase/migrations/0001_wiki_contributions.sql` creates the moderation-queue
  table with RLS **on**, public roles **revoked**, and explicit **service_role** grants
  (encodes the RLS≠GRANT lesson) — the queue is server-only and never publicly readable.
  Endpoint now selects the store and returns 503 on a store failure. 3 store unit tests
  (request construction, error path, selection) + endpoint e2e re-verified; a TS
  parameter-property that broke node's `--test` type-stripping was rewritten to explicit
  fields. Still inert in production until Keycloak (Phase 3) + a real Supabase project.
- **Contribution seam + write endpoint** (2026-07-14, Phase 2 foundation): the
  fail-closed core of the community-contribution flow, host defaulted to **Cloudflare
  Pages Functions** (keeps the wiki on one platform). `site/src/lib/contribution.ts` —
  pure, unit-tested validation (suggest-edit / propose-page), pairwise-`sub` identity
  derivation (never trusts client-supplied identity), and a fail-closed write gate (an
  unauthenticated write is refused unless `ALLOW_PROVISIONAL_CONTRIBUTIONS=true`, which
  is local/preview only). `site/functions/api/contributions.ts` is a thin Pages Function
  over it; `contribution-store.ts` is the datastore seam (no-persistence stub until the
  hosting/data-controller call). **Verified end-to-end** via `wrangler pages dev`: 202
  authed, **401 in prod-simulation (no flag)**, 422 validation, 405 wrong-method. No UI
  yet and the endpoint is inert in production (fail-closed), so the live site is
  unchanged. Keycloak session wiring is Phase 3 (IdP is already live).
- **Joined the Beau Access Solutions platform** (2026-07-14, Phase 1 — governance
  onboarding only): scoped like Access Atlas — public browsing stays account-free and
  100% static; identity will gate *contribution* only. Adds
  [`docs/platform-membership.md`](docs/platform-membership.md) (governance pointer +
  the five invariants as a local fallback, per BAS ADR-002 §3),
  [`docs/contribution-model.md`](docs/contribution-model.md) (the chosen community-
  contribution design: pseudonymous suggest-edit/propose-page → moderation queue →
  **promotion into markdown**, so the published site never depends on a database — this
  deliberately preserves the Wiki.js→static migration), and `.github/CODEOWNERS`
  (invariant #4 — required review on governance, life-safety `crisis/`, `CLAIMS.md`,
  security headers, and the pre-guarded Phase-2 contribution paths). i18n ownership
  (invariant #5) is already satisfied by the EN/ES + Spanish-review discipline. The
  contribution endpoint + Keycloak identity wiring are deferred (Phase 2/3). The
  platform IdP (Keycloak) is already live, so identity is buildable; the remaining call
  is hosting/data-controller for submissions (adopt Access Atlas's now-live DO App
  Platform + Supabase, or use Cloudflare Pages Functions to keep one host).
- **PWA: installable + offline crisis pages** (2026-07-14): web app manifest with
  crisis-hotline shortcuts (EN + ES), icons generated from the site logo, and a
  build-generated service worker (`site/tools/gen-sw.mjs`). All `crisis/` and
  `es/crisis/` pages (~58) plus the asset bundle are precached at install —
  discovered by walking `dist/`, never hand-listed. HTML is network-first (a stale
  crisis number is never served while online; cache is the offline fallback only);
  cache version is a hash of precached content, so a crisis-page fix re-precaches on
  the next visit. Bilingual offline fallback page (`offline.html`) deliberately
  contains **no hotline numbers** — it links to the precached pages instead, so
  life-safety facts stay single-sourced (CLAIMS discipline). `_headers` keeps
  `sw.js`/manifest out of the Cloudflare edge cache. First phase of the native-app
  (Capacitor) plan.
- **CI merge-gate** (2026-06-22, `.github/workflows/ci.yml`): the cutover made publishing = merge to main with no review gate; every PR now runs the same Astro build Cloudflare runs (blocking) + `validate_wiki_links.py --strict` (blocking; baseline 0 broken links) + `check_accessibility.py` (advisory — current findings are all the emoji-as-info house style). Adds a `--strict` exit flag to the link validator. Ported from sibling projects' CI discipline.
- **Incident-response runbook** (2026-06-22, `docs/INCIDENT_RESPONSE.md`): severity levels tuned to a life-safety static site (a wrong/dead crisis hotline number is SEV1); documents both rollback paths and that the droplet path (A records → `167.71.97.167`) expires at the 2026-07-10 decommission. Adapted from the `benefits-navigator` runbook.
- **Canonical claims ledger** (2026-06-22, `docs/CLAIMS.md`): `public-ledger`-style registry of load-bearing facts (crisis numbers, benefits figures, legal deadlines) → primary source + verify date, seeded from the 2026-06 audits and the fact-check error heatmap. Internal, not published.

### Fixed
- **SW: redirect-tainted cache entries break offline navigation in production**
  (2026-07-14, `site/tools/gen-sw.mjs`): Cloudflare Pages 308s bare-file URLs
  (`/offline.html` → `/offline`) and no-slash page URLs (`/x` → `/x/`) — behaviors
  `astro preview` doesn't reproduce, so local offline tests passed while production
  would fail: browsers reject redirected responses served to navigations. Fixes:
  offline page moved to `/offline/` (directory-style like every other URL, no
  redirect), and runtime page-caching now strips the `redirected` flag by rewrapping
  the response. Found because the first production deploy stalled and live checks
  ran against the real edge. Known residual: the zone's Browser Cache TTL (4h)
  overrides the `no-cache` `_headers` rule for `sw.js` on the custom domain —
  harmless for SW updates (browsers bypass HTTP cache for update checks), but worth
  flipping to "Respect existing headers" in the dashboard.
- **Offline-page a11y (design review)** (2026-07-14, `site/public/offline.html`):
  dark-theme "Try again" button was white-on-`#5a9be0` at 2.9:1 contrast (fails
  WCAG 1.4.3) → dark text on the light accent, 5.2:1; button hit area was 38px →
  44px (house 44/48 bar); hover affordance added to card links. Found by the
  `bas-design-review` checklist — contrast verified in both themes, targets
  measured at 375px viewport.

### Changed
- **Shared cross-project lessons wired into `claude.md`** (2026-06-22): `@import` of `~/.claude/shared/LESSONS.md`, and three transferable wiki lessons pushed back to it (Cloudflare edge-cache `?v=` doesn't bust it; auto-deploy needs a CI gate; machine translation reproduces source errors).

### Security
- **Stale `sitemap-*` DNS-only A record deleted** (2026-06-12): it pointed at the old droplet and was the last record exposing the origin IP (flagged by Cloudflare's "origin IP partially exposed" recommendation). Remaining post-cutover DNS item: DMARC record (tracked for the 2026-07-10 decommission checklist).

---

## [2026-07-10] — Droplet decommission (migration Phase 5)

Final phase of the Wiki.js → static-site migration, run via the Claude scheduled
task `droplet-decommission-day` (health-check → archive → destroy → DNS → docs).

### Removed
- **Legacy Wiki.js droplet destroyed** (DigitalOcean, `167.71.97.167`, hostname
  `Disability-Wiki`, SSH alias `cripchronicle`). It had served as the rollback
  fallback since the 2026-06-12 cutover; the ~4-week rollback window is up. No block
  volumes or manual snapshots existed; the 4 automated weekly backups can't be
  force-deleted (DigitalOcean has no delete action for them) but carry no charge once
  the Droplet is destroyed and auto-expire by ~2026-08-01. **There is no longer a
  fallback origin** — a Cloudflare Pages platform outage is now handled by dashboard
  deployment-rollback / Cloudflare support only.
- **Final droplet archive taken before destruction** → `backups/final-droplet-archive/`
  (local-only, git-ignored): fresh `pg_dump` of the Wiki.js DB (`gzip -t` verified),
  `docker-compose.yml`, and `.env` (as `wiki.env`), plus a provenance/restore README.

### Added
- **DMARC record** for `disabilitywiki.org` (was missing; Cloudflare had been
  recommending it): `TXT _dmarc = "v=DMARC1; p=quarantine; rua=mailto:zb2252@columbia.edu"`.
  Completes email auth alongside the existing SPF + DKIM on the Cloudflare Email
  Routing setup.

### Changed
- **Docs rewritten to the static-site reality**: `claude.md` (removed the legacy
  Wiki.js server/deploy/backup sections, added the Astro-Starlight-on-Pages
  description + a pointer to the final archive); the **disability-wiki-edit** skill
  (retired the GraphQL API / pull-mode sync / SSH-recovery / never-`git rm`
  machinery, replaced with the edit→PR→merge-to-main workflow — `git rm` is now the
  correct way to delete a page); `docs/INCIDENT_RESPONSE.md` (retired the droplet
  "path 2" DNS-rollback per its own post-decommission instruction). Project memory
  (`static-site-migration`, `wikijs-ops-gotchas`) marked historical.

### Security
- **Confirmed no DNS records point at the destroyed droplet.** The zone has no `A`
  records at all (apex + `www` are proxied CNAMEs to `disability-wiki.pages.dev`); the
  stale `sitemap-*` `A` record was already deleted at cutover. Origin IP no longer
  exposed anywhere in DNS.

---

## [2026-06-11 — 2026-06-12] — Static-site migration & cutover

### Changed
- **CUTOVER (2026-06-12): disabilitywiki.org now serves the Astro Starlight static site from Cloudflare Pages.** Custom domains (apex + www) attached to the `disability-wiki` Pages project; verified live: pages 200 (EN + es), `/en/*` 301s, stub/index/case redirects, 404, valid TLS. Publishing is now merge-to-main. The Wiki.js droplet remains as rollback until decommission — **scheduled for 2026-07-10** (Claude scheduled task `droplet-decommission-day`: final archived backup, droplet destroy, DNS cleanup, docs/skill rewrite); CLAUDE.md and the edit skill carry legacy banners.

### Fixed
- **Phantom git submodule entry removed** (`disability-wiki` gitlink with no `.gitmodules`): harmless locally for months, but it made Cloudflare's repo clone fail (`fatal: No url found for submodule path`), blocking the first Workers Builds deployment.
- **17 broken Spanish links fixed (live bugs)** — surfaced by the migration Phase 3 link verification (143,514 rendered hrefs checked, now 0 broken): wrong community/condition/crisis slugs across 14 es/ files, including crisis-hotline paths and one wrong-region link (Indonesia under south-america). The repo link validator misses es-slug mismatches; verification report: `docs/migration/VERIFICATION_2026-06-12.md`.
- **Wiki.js-era "This page has moved" stubs become true redirects on the static site** (8 stubs: accessibility-statement root, foundations/how-to-use-this-wiki, start/{disability-models,for-allies,what-is-disability} EN + es): marked `draft: true` so the static build excludes them from pages/sidebar and serves redirects instead; Wiki.js ignores the field, so the live stubs keep working until cutover. FAQ links repointed from stubs to the canonical foundations/ pages.
- **Residual `[[wikilink]]` syntax cleared from the four start/ pages (EN + es)**: ~50 unsupported wikilinks rendering as literal bracket text (missed by the 2026-06-08 sweep), many pointing at pages that moved (`/about/contact` → `/start/contact`, `/start/welcome` → `/foundations/welcome`, `/library` → `/media`) or were never created (`/about/privacy` etc., now unlinked plain text). Broken hand-maintained "Previous/Next page" nav lines removed.

### Changed
- **Frontmatter titles aligned to each page's written H1** (119 pages, EN + es): many frontmatter titles were slug-generated ("Tv Shows", "Tiktok Creators") while the body H1 carried the real title ("Disability on Television"); titles now match the H1. Improves Wiki.js page titles/search/SEO today and lets the new static site render a single H1. One inverse fix: the es filing-a-complaint H1 was all-caps and now uses the frontmatter title.

### Added
- **Static-site migration Phase 4 (deploy config)**: `site/wrangler.jsonc` for Cloudflare Workers static-assets hosting (assets from `dist/`, 404-page handling) — Workers Builds deploys on merge; Pages is in maintenance mode upstream, so the site targets Workers from the start.
- **Static-site migration Phase 2** (`site/`): Cloudflare `_redirects` file (`/en/*` → `/*` 301s, home aliases, stub-page targets, dropped `/regions`); custom 404 leading with crisis links (EN + es); `robots.txt` + sitemap pointer; pride-flag favicon; WCAG-AA accent palette for light/dark themes. Sweep guard (`scripts/sweep_noncontent_pages.py`) now covers the `site/` prefix — the 404 page leaked into Wiki.js as a published page and was unpublished.
- **New site nav: autogenerated sidebar** (`site/`): the hand-maintained Wiki.js nav (22 groups / 153 links, English-only labels on `/es/`) is replaced by a sidebar autogenerated from the 23 content directories — ordered start/foundations/crisis first, section labels from index-page titles with proper Spanish translations, and it can never go stale when pages are added.
- **Static-site migration Phase 1** (`site/`): Astro Starlight scaffold that builds all wiki content — 539 pages in ~13s — with existing markdown symlinked in place (no content moves), en at root + es under `/es/` (URLs unchanged), sidebar generated from the Wiki.js nav export, Pagefind search (en+es), git-derived last-updated dates, and a generated sitemap (Wiki.js served none). Not yet deployed.

### Fixed
- **48 pages had YAML-invalid frontmatter** (unquoted colons in title/description) — tolerated by Wiki.js, fatal to strict parsers; values now quoted (rendering unchanged).

### Removed
- **Legacy duplicate rights stubs deleted** (6 pages, EN + es): `Rights/Overview` and `Rights/North-America/US/{ADA,Fair-Housing}` were 25-line unpublished leftovers shadowing the real `rights/us/*` pages (flagged in the 2026-06-05 page review). DB rows deleted via API first, then repo files.

### Added
- **Static-site migration Phase 0** (`docs/migration/`): decided Wiki.js → Astro Starlight on Cloudflare Pages; exported the DB-only state (nav tree, site config, logo) and reconciled DB vs repo — two nav-linked pages that existed only in the Wiki.js DB (`foundations/welcome`, `crisis/emergency-disaster-preparedness`) exported into the repo so it is now the complete source of truth; `regions/index` (empty, unlinked) marked drop+redirect. Plan and findings in `docs/migration/MIGRATION_PLAN.md`.

### Fixed
- **Unfilled footer placeholders replaced with real `/start/contribute` links** (54 instances, 26 files): `**Share feedback:** [Feedback link]` and `[Link to contribution form]` were published as-is on 12 English pages (the eight daily-living pages, adult-and-continuing-education, in-person-community, youth-student-communities, family-control-and-gaslighting) and their 12 `es/` counterparts; the EN and es glossary indexes had three unlinked `[Link to form →]`-style placeholders each. All now point to `/start/contribute` (`/es/start/contribute` on Spanish pages) per the canonical contribute pathway.

### Changed
- **Hand-maintained "Last updated" footer lines removed from all content pages** (~510 stamps across 484 EN + es pages). Most stamps said "January 2026" or "November 2025" even on pages corrected in the June 2026 audits, understating freshness on exactly the pages (crisis hotlines) where it matters. Wiki.js's automatic updated-at timestamp is now the single source of truth for page freshness.

### Fixed
- **Spanish sync of the 2026-06-10 audit corrections** ([PR #20](https://github.com/Beaudoin0zach/disability-wiki/pull/20), pending merge): all 18 `es/` counterparts of the corrected English pages updated — fabricated/wrong crisis numbers removed from Spanish (Nigeria SURPIN, Kenya 1199, Vietnam, Venezuela, Ghana, Zimbabwe, Egypt, Hungary, Canada 988) plus Aktion T4 / CRPD / VA SAH / LeDeR / Ruderman / JAWS fact corrections. Two new English-source flags recorded in `docs/translation-source-accuracy-flags.md` (Nigeria "Lifeline works nationwide" leftover; Thailand leaf page's obsolete Samaritans number).

---

## [2026-06-10]

### Fixed
- **Accuracy audit of ~200 previously unaudited English pages** (PR #19; tracker `AUDIT_RESULTS_2026-06-10.md`):
  - Verified crisis-hotline corrections (2+ primary sources each): fabricated "Lifeline Nigeria" removed → SURPIN; Kenya Red Cross → 1199; Vietnam's listed "hotline" was a bank's customer-service line → Ngày Mai; Venezuela → FPV LAPSI; Ghana MHA; Zimbabwe → Samaritans Bulawayo; Egypt MoH 16328; Indonesia → Healing119; Thailand Samaritans number change; Hungary LESZ/Kék Vonal relabel; retired Talk Suicide Canada → 988; Trans Lifeline hours.
  - Factual corrections: Aktion T4 death-toll contradiction reconciled (USHMM); CRPD 193 parties / 164 signatories + enforceability hedge; VA SAH grant $126,526 FY2026; police-killings and arrest stats attributed (Ruderman 2016, McCauley AJPH 2017); UK learning-disability mortality gap corrected to LeDeR; JAWS pricing date-stamped.
- `community/online-communities/discord.md` rewritten as a genuine Discord page (was duplicated Reddit content); scam/safety note added to the online-communities index.

### Added
- National Domestic Violence Hotline safety box on `relationships/dating-and-relationships.md`.

---

## [2026-06-09]

### Changed
- **Contribute pathway canonicalized on `/start/contribute`** (PRs #14–#18): dead Google Form dropped in favor of the email CTA, site nav repointed, 244 inbound links repointed (EN + es), `/glossary/how-to-contribute` reframed as the Technical Contribution Guide.

### Fixed
- **Mexico/Argentina crisis-number corrections** (PR #11, life-safety): unverifiable CONADIS/CNDH and ANDIS numbers replaced with verified ones; Argentina emergency-number block corrected (100 = firefighters, not police).
- Intersectionality essays sourced/hedged per Tier D audit (PR #12); RespectAbility survey deep-linked.
- Accessibility: sole-carrier emoji replaced with plain-text labels, image alt fixed (PR #9); bare-path link text relabeled across 64 links (PR #14).

### Added
- Politics of Disability reading pathway + expanded books/bibliography, with full Spanish parity (PRs #7–#8); `professionals/accessible-course-design.md`.
- `scripts/publish_page.py` — pushes file content into the Wiki.js DB when force-sync fails to import it (the known sync quirk).

---

## [2026-06-06 — 2026-06-08]

### Fixed
- **First full content accuracy audit** (`AUDIT_RESULTS_2026-06-06.md`, employment/education/benefits/rights/crisis): Tier A crisis-hotline corrections (Mexico Línea de la Vida, Thailand DMH 1323, India Tele-MANAS, Indonesia Healing119, Philippines NCMH, UK lines); blanket "all free/confidential/24-7" and false "verified" claims replaced with hedged per-service wording; benefits figures refreshed to 2026 (SSI $994 FBR / $1,690 SGA, Medicare, veterans MAPRs); IDEA complaint deadlines + OCR misrouting fixed; §503/§504 conflation and Spain LISMI naming corrected.
- **Broken links cleared to zero repo-wide**: validator script repaired, ~110 stale links fixed, dangling in-page TOC anchors repaired (EN + es), unsupported `[[wikilinks]]` converted.

### Added
- **Full Spanish locale (`es/`, ~269 pages)** committed to the repo and synced to all audit corrections, with translation glossary/conventions, canonical crisis-page blocks, language-aware meta descriptions, and a source-accuracy flags log (`docs/translation-source-accuracy-flags.md`).
- Claude Code project skills tracked in-repo (`.claude/skills/`): Spanish translation/sync, AI-slop detection, accuracy fact-checking, wiki editing/publishing, link hygiene, content accessibility audit.

---

## [2026-06-04 — 2026-06-05]

### Fixed
- Dead-link audit + remediation (PR #2); full page review + remediation (PR #3, `PAGE_REVIEW_2026-06-05.md`).

### Added
- Intersectionality stubs pilot, 4 pages (PR #4); self-management pilot pages — Autistic Burnout, ADHD Medication Access (PR #6).

---

## [2026-01-11 — 2026-01-13]

### Security
- Removed hardcoded credentials from the repo; added `SECURITY.md` hardening guide; documented implemented security features (TLS/HSTS, security headers, rate limiting, **daily automated backups at 3 AM UTC**).

### Removed
- Unrelated langworthywatch Hugo content split out to its own project.

---

## [2.5.310] - 2026-01-06

### Updated
- **Wiki.js Version**: Upgraded from 2.5.309 to 2.5.310
  - Updated local installation (Mac)
  - Updated live production server (DigitalOcean)
- **Repository Organization**: Major cleanup and restructuring
  - Created `scripts/` directory for Python utilities
  - Created `docs/` directory for documentation
  - Created `backups/` directory for archives
  - Moved files to appropriate locations

### Added
- **Documentation**:
  - `claude.md` - Comprehensive technical documentation covering:
    - DigitalOcean server details
    - Wiki.js deployment (local and live)
    - Docker configuration
    - Update procedures
    - Maintenance tasks
    - Troubleshooting guide
  - `QUICK_REFERENCE.md` - Fast command reference guide
  - `scripts/README.md` - Utility scripts documentation
  - `docs/README.md` - Documentation directory guide
  - Updated `README.md` with new structure

- **Scripts**:
  - `scripts/generate_descriptions.py` - SEO meta description generator
    - Updated 232 of 254 files with descriptions
  - `scripts/validate_wiki_links.py` - Internal link validator
    - Validated 1,758 links across 254 files
    - Found 15 broken links

- **Infrastructure**:
  - `.gitignore` improvements (Docker volumes, Python cache, backups)
  - `backups/.gitkeep` to maintain directory structure

### Fixed
- Meta descriptions added to 232 markdown files (155-160 characters each)
- Identified 15 broken internal links for repair
- Repository structure now properly organized

---

## [2.5.309] - 2026-01-06

### Updated
- **Wiki.js Version**: Upgraded live server from 2.5.308 to 2.5.309
  - Backed up configuration: `docker-compose.yml.backup-2.5.309`
  - Successfully pulled and deployed new image
  - Verified startup and database connectivity

### Changed
- Docker Compose configuration updated on live server
- Image version pinned to `requarks/wiki:2.5.309`

---

## [2.5.308] - Initial Deployment

### Added
- Initial Wiki.js installation on DigitalOcean
- PostgreSQL 13 database setup
- Docker Compose configuration
- 254 markdown content files across categories:
  - Benefits & Programs
  - Disability Rights
  - Housing Resources
  - Employment Rights
  - Education
  - Healthcare
  - Legal Resources
  - Assistive Technology
  - Transportation

### Infrastructure
- DigitalOcean Ubuntu 22.04 LTS droplet
- Docker containerization
- Port mapping: 8080:3000
- Database volume persistence

---

## Content Statistics

### Current Content (as of 2026-06-10)
- **English Pages**: ~290 markdown content files
- **Spanish Pages**: 269 markdown files under `es/` (full locale)
- **SEO Coverage**: meta descriptions regenerated repo-wide, EN + es (June 2026)
- **Link Health**: 0 broken internal links (cleared June 2026; run `scripts/validate_wiki_links.py` to re-check)
- **Accuracy**: two full content audits completed (`AUDIT_RESULTS_2026-06-06.md`, `AUDIT_RESULTS_2026-06-10.md`)

### Categories
- Benefits (SSDI, SSI, Medicaid, Medicare, VA)
- Rights (ADA, IDEA, Section 504, Fair Housing)
- Housing (Accessible housing, modifications)
- Employment (Accommodations, workplace rights)
- Education (K-12, IEPs, 504 plans, college)
- Healthcare (Conditions, treatments, resources)
- Legal (Disability law, advocacy)
- Technology (Assistive tech, accessibility)
- Transportation (Transit, paratransit)
- Crisis (Emergency resources, hotlines)

---

## Maintenance History

### Database Backups
- Automated daily backups active since January 2026 (3 AM UTC; daily/weekly/monthly rotation — see CLAUDE.md)

### Security Updates
- Server OS: Ubuntu 22.04.5 LTS
- TLS/HSTS, security headers, and rate limiting active (January 2026 hardening)
- Wiki.js: Version 2.5.310

---

## Known Issues

Open content work is tracked in the audit files and translation flags log:
- Remaining P1 unsourced statistics and P2 safeguard additions — see `AUDIT_RESULTS_2026-06-10.md` "OPEN"
- Re-sweep of files skipped by the 2026-06-10 scan (sports/media/get-involved/relationships)
- `es/community/online-communities/discord.md` still carries the old Reddit content (English rewritten 2026-06-10)
- Two EN crisis-page flags: Nigeria "Lifeline works nationwide" leftover; Thailand leaf's obsolete Samaritans number — see `docs/translation-source-accuracy-flags.md`

### Missing Features
- [ ] Monitoring/alerting for downtime
- [ ] Email configuration for Wiki.js

---

## Planned Improvements

### Short Term
- [ ] Close remaining 2026-06-10 audit items (P1 verification rounds, P2 safeguards)
- [ ] Automated link checking (CI/CD)

### Medium Term
- [ ] Staging environment
- [ ] Search analytics

### Long Term
- [ ] Enhanced search with Elasticsearch
- [ ] Community contribution system
- [ ] Mobile app integration

### Completed (formerly planned)
- [x] Automated backup system (January 2026)
- [x] Broken-link cleanup — 0 broken repo-wide (June 2026)
- [x] Content contribution guidelines — `/start/contribute` canonical (June 2026)
- [x] Multi-language support — full Spanish locale (June 2026)

---

## Version Numbering

Infrastructure releases use Wiki.js version numbers (`[2.5.310] - YYYY-MM-DD`). Content and tooling changes are tracked by date (`[YYYY-MM-DD]`), grouped per day or per work stretch. Work merged but not yet deployed/verified live goes under `[Unreleased]`.

---

## Contributing

When making changes:
1. Update this CHANGELOG with your changes
2. Include date and version number
3. Categorize changes: Added, Changed, Deprecated, Removed, Fixed, Security
4. Link to related issues or PRs when applicable
5. Be specific and concise

---

*Changelog maintained since January 6, 2026*
