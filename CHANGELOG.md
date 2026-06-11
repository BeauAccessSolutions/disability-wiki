# Changelog

All notable changes to the Disability Wiki project are documented in this file.

---

## [Unreleased]

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
