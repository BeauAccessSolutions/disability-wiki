# Source-Accuracy Flags from Spanish Translation

These are potential **factual/legal errors or inconsistencies in the ENGLISH source**,
surfaced while translating pages to Spanish. Per the translation policy, the Spanish
was translated faithfully (carrying these over verbatim) and **no English file was
edited** — this list is for the maintainer's separate English-source review.

When you fix an item in English, also update the matching `es/` page so the two
languages stay in sync.

Status legend: ⬜ open · ✅ fixed in EN (⚠️ ES still needs sync) · ✅✅ fixed EN+ES · ⏭️ won't fix / not an issue

---

## ⚠️ ES SYNC REQUIRED (added 2026-06-07)

The Codex audit remediation (see `AUDIT_REMEDIATION_STATUS.md`) edited many **English** pages
this session. The corresponding **`es/` Spanish pages were NOT updated** and now carry the old,
incorrect content. Re-translate/sync these `es/` pages to match current English before relying
on them:

- ⬜ `es/benefits/us/ssi.md`, `es/benefits/us/medicare.md`, `es/benefits/us/veterans-benefits.md`
- ⬜ `es/rights/us/ada.md`, `es/rights/us/section-504.md`, `es/rights/us/state-disability-rights-laws.md`, `es/rights/us/air-carrier-access-act.md`
- ✅✅ **All edited crisis pages — SYNCED 2026-06-07.** `es/crisis/crisis-hotlines/{north-america/mexico,north-america/united-states,north-america/canada,asian-pacific/india,asian-pacific/indonesia,asian-pacific/philippines,asian-pacific/thailand,asian-pacific/australia,europe/united-kingdom}.md` and `es/crisis/abuse/abuse-resources.md` now match the Tier A English corrections (`d1f90c7`). All 9 leaf pages validate clean via `check_translation.py`.

**Life-safety priority — DONE.** The crisis-page `es/` versions previously showed wrong/obsolete numbers; all are now corrected: Mexico → Línea de la Vida 800-911-2000; Thailand 1300 → DMH 1323; India → adds Tele-MANAS 14416; Indonesia → Healing119 / 119 ext 8; Philippines → NCMH 1553; Australia → Lifeline "gratuito"; UK + abuse-resources → Rape & Sexual Abuse Support Line 0808 500 2222; US/Canada → 988 emergency-policy wording. Blanket "all free/confidential/24-7" footers and false "verified" lines softened to match EN.

> Note: the aggregator index `es/crisis/crisis-hotlines/asian-pacific.md` was checked — its Thailand "1300" is the **Baan Kredtrakarn child-abuse line** (a distinct, valid service), not the obsolete Samaritans number, so it correctly mirrors EN and needs no change.

**Remaining ES sync (next session):** the benefits/ and rights/ pages listed above (⬜) are NOT yet synced to their Tier B/C English corrections.

### ⚠️ ES SYNC — employment/ + education/ (added 2026-06-07, from cold slop-sweep fixes)
These English pages were corrected this session (commits `8fa5f04`, `1f98057`) and their `es/` counterparts are now stale:
- ⬜ `es/employment/workplace-accommodations.md` — §503/§504 split (federal contractors = 503); JAN cost figures + source; ESA case-by-case
- ⬜ `es/employment/employment-rights-by-country.md` — Spain LISMI → Royal Legislative Decree 1/2013; CRPD "standard ≠ enforceable remedy" caveat at lead
- ⬜ `es/employment/job-searching-with-a-disability.md` — "studies show … fewer callbacks" → Ameri et al. 2018 (~26%) + link
- ⬜ `es/education/higher-education.md` — CRPD "signed" → "ratified" + US-signed-not-ratified caveat
- ⬜ `es/education/k12-education.md` — same CRPD signing≠ratifying caveat
- ⬜ `es/benefits/index.md` — 2026 figures ($994/$1,690); one-vehicle exclusion; DAC age-22 clarification
- ⬜ `es/benefits/poverty-and-benefits-trap.md` — 2026 SSI base; 1972/1989 reconciliation; inflation/proposed-limit correction
- ⬜ `es/rights/filing-a-disability-complaint.md` — IDEA deadlines (state 1yr / due process 2yr) + OCR=§504/Title-II not IDEA; SoL table
- ⬜ `es/rights/international-rights.md` — CRPD ">190 ratified/acceded" count fix

---

## benefits/ (category complete — 20 pages, June 2026)

### Dollar amounts / figures to verify against official 2026 sources
- ✅ `benefits/us/medicare.md` — Part B premium **$202.90**, Part D cap **$2,100**, Part A deductible **$1,736**, Part D deductible **$615**. Verified correct vs CMS 2026 (Codex audit). *(EN good; ES needs sync.)*
- ✅ `benefits/us/ssi.md` — SGA **$1,690/mo** and FBR **$994/mo** verified vs SSA (Codex audit). *(EN good; ES needs sync.)*
- ⬜ `benefits/us/veterans-benefits.md` — VA Pension income range "**~$17,400–$22,800**" may conflate **base** MAPR with **Aid & Attendance** MAPR (A&A is higher, ~$28k–$33k). Still open — check VA MAPR tables and clarify base vs A&A.
- ✅ `benefits/index.md` & `benefits/poverty-and-benefits-trap.md` — refreshed to 2026 (SSI base **$994**, SGA **$1,690**), verified vs SSA 2.8% COLA. Also fixed `index.md` "car up to certain value" → one vehicle (any value) and the DAC "before age 22" conflation. *(EN fixed 2026-06-07; ES needs sync.)*

### Internal inconsistencies (same page contradicts itself)
- ✅ `benefits/us/ssi.md` — the stale **~$1,200** break-even in "Common SSI Myths" was corrected this session (now ~$2,000, consistent with the income-exclusion math). *(EN fixed; ES needs sync.)*
- ✅ `benefits/poverty-and-benefits-trap.md` — reconciled the 1989-vs-1972 contradiction (limit dates to SSI's 1972 creation; current $2,000/$3,000 levels set 1989). Also corrected the inflation claim: "~$10,000" was the *proposed* SSI Savings Penalty Elimination Act figure, not inflation-adjusted (>$5,000). *(EN fixed 2026-06-07; ES needs sync.)*

### Naming / outdated references
- ✅ `benefits/us/veterans-benefits.md` — TDRP wording corrected to **Temporary Disability Retired List (TDRL)** framing this session. *(EN fixed; ES needs sync.)*
- ✅ `benefits/us/veterans-benefits.md` — Veterans Crisis Line updated to **dial 988 then press 1** (old 1-800-273-8255 noted as still routing). *(EN fixed this session; ES needs sync.)*
- ⬜ `benefits/us/veterans-benefits.md` — "available for life / continues as long as service-connected" slightly overstates; ratings can be reduced on re-exam unless protected. **Open.**
- ✅ `benefits/us/ssi.md` — "taxed as federal income assistance" → corrected to "SSI is **not** taxable income" this session. *(EN fixed; ES needs sync.)*

### Cosmetic link-text/href mismatches (href is correct; only displayed text is wrong)
- ⬜ `benefits/us/family-caregiver-pay.md` — link text shows `/benefits/us-benefits-overview`
  (hyphenated, not a real path); href is correct.
- ⬜ `benefits/us/medicaid.md` — link text shows `/benefits/us-ssi` and
  `/benefits/us-medicare` (hyphenated); hrefs are correct.
- ⬜ `benefits/index.md` & `benefits/poverty-and-benefits-trap.md` — mixed
  "Contribute" targets: some `/start/contribute`, some `/glossary/how-to-contribute`.
  Inconsistent but not broken.

### Checked — not an issue
- ⏭️ `benefits/international/benefits-overview.md` links to
  `/benefits/other-countries-benefits` — a translating agent suspected this was a dead
  link, but the source page **does exist** (`benefits/other-countries-benefits.md`).
  No action needed.
- ⏭️ `benefits/european-union/benefits.md` references `/benefits/eu/germany` etc. —
  these are inside code spans as aspirational placeholders, not live links.

---

## Anchor TOCs — Spanish jump-links (added 2026-06-07)

In-page "jump to section" TOCs were made to work in Spanish via explicit heading
IDs (`## Heading {#id}`, markdown-it-attrs) pinned to match the existing anchor
targets — accent-independent by construction. Done across all 51 non-crisis es/
pages that have TOCs. The 10 crisis-hotline index pages are pending (blocked by
the Norton write quarantine; finish with `pin_anchors.py` after the exclusion).

### ⬜ Dangling anchors — broken in the ENGLISH source too (TOC link points to an id no heading produces)
These were already dead links on the live English site; flag for an EN fix
(correct the anchor or the heading), then the es/ pinning will pick them up:
- `housing/*` (housing-rights, home-modifications, group-homes-and-institutions, homelessness-and-disability, independent-living-philosophy-and-centers, tenants-rights-with-disabilities, accessible-housing-search-guide): TOC link `#european-union` but heading is `## European Union & Member States` (real slug `european-union--member-states`); accessible-housing-search-guide also `#other-countries` vs `## Other Countries`.
- `sports/paralympic-movement`: TOC `#sports` — no heading slugs to "sports" (headings are "Summer/Winter Paralympic Sports").
- `rights/international-rights`: TOC `#united-nations-framework` — no matching heading slug.
- `history/pre-industrial`: TOC `#ejemplos-históricos-detallados` — no matching ES heading (section retitled in translation).

---

## Link-repoint sync + new section indexes (synced 2026-06-07, English commit `203d0cf`)

English commit `203d0cf` repointed 7 stale internal links and added 4 section
index pages. Propagated to `es/`:

### ✅ Repoints applied to es/ (same targets, `/es/` form)
- `es/history/pre-industrial.md`, `es/history/accommodations.md` — accommodations/pre-industrial cross-links
- `es/start/how-to-use.md`, `es/start/faq.md` — `/about/accessibility`→`/accessibility-statement`, `/about`→`/home`, `/foundations/welcome`→`/foundations/how-to-use-this-wiki`
- `es/benefits/proving-disability.md` — `/rights/understanding-your-rights`→`/rights/index`
- `es/relationships/boundaries-disclosure.md`, `es/foundations/handling-intrusive-questions.md` — `/relationships/dating-disclosure`→`/relationships/dating-and-relationships`
- `es/foundations/index.md` — `/foundations/welcome`→`/foundations/how-to-use-this-wiki`

### ✅ New Spanish section indexes (translated fresh from the English originals)
- `es/education/index.md`, `es/daily-living/index.md`, `es/relationships/index.md`, `es/community/online-communities/index.md`

All 12 files pass `check_translation.py`.
