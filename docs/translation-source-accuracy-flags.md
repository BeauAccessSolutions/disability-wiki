# Source-Accuracy Flags from Spanish Translation

These are potential **factual/legal errors or inconsistencies in the ENGLISH source**,
surfaced while translating pages to Spanish. Per the translation policy, the Spanish
was translated faithfully (carrying these over verbatim) and **no English file was
edited** — this list is for the maintainer's separate English-source review.

When you fix an item in English, also update the matching `es/` page so the two
languages stay in sync.

Status legend: ⬜ open · ✅ fixed in EN (⚠️ ES still needs sync) · ✅✅ fixed EN+ES · ⏭️ won't fix / not an issue

---

## ✅✅ 2026-06-10 audit fixes synced to es/ (2026-06-10, branch `fix/audit-2026-06-10-accuracy`)

All 18 `es/` counterparts of the English files corrected in commits `78b2ed3` (crisis
hotlines) and `7328e33` (content facts) are synced; every file passes `check_translation.py`.

**Life-safety (crisis) — fabricated/wrong numbers replaced, mirroring EN:**
- `es/crisis/crisis-hotlines/africa/nigeria.md` — fabricated "Lifeline Nigeria" +234-809-063-0000 removed sitewide → **SURPIN 0800 078 7746** lead (incl. footer CTA); also repaired the broken frontmatter `description` (it carried the canonical Costo sentence instead of a real description — now mirrors the new EN description).
- `es/crisis/crisis-hotlines/africa/kenya.md` — untraceable Red Cross 0800 721 100 → **1199** (9 occurrences incl. footer CTA); Befrienders Kenya 24/7 → 9 a.m.–5 p.m.
- `es/crisis/crisis-hotlines/africa.md` — Egypt MoH 16328 (replaces "no functioning hotline"); Ghana MHA 0800-678-678 (Lifeline Ghana + wrong MHA number removed); Nigeria quick numbers → SURPIN, She Writes Woman 2024→2020; Befrienders Kenya hours; Zimbabwe → Samaritans Bulawayo +263 9 65000 / Friendship Bench 0808 4116 / Childline 116.
- `es/crisis/crisis-hotlines/asian-pacific.md` — Vietnam bank line 1800-599-999 → Ngày Mai 096 306 1414 + "no national 24/7 line" note + child line 111; Indonesia → Healing119 (119 ext 8) lead; Thailand Samaritans → 02-113-6789 (12 p.m.–10 p.m.); Pakistan Umang hedged.
- `es/crisis/crisis-hotlines/europe.md` — Hungary: 116-123 = LESZ 24/7 (was mislabeled Kék Vonal 18:00–06:00); Kék Vonal 116-111 = youth ≤24, 24/7.
- `es/crisis/crisis-hotlines/north-america.md`, `es/crisis/index.md`, `es/healthcare/mental-health.md` — retired Talk Suicide Canada 1-833-456-4566 → 988; Trans Lifeline hours (M–F 10–6 PT, not 24/7); Trevor 24/7.
- `es/crisis/global-crisis-hotlines.md` — "más de 60" → "62 correcciones".

**Content facts:** `es/foundations/disability-culture.md` + `es/history/eugenics.md` (T4: ~70,000/70 273 in the 1940–41 centralized phase, ~250,000 total to 1945, USHMM link); `es/history/global-timelines.md` + `es/housing/housing-rights.md` (CRPD 193 parties/164 signatories June 2026 + enforceability hedge); `es/housing/home-modifications.md` (SAH $126,526 FY2026); `es/professionals/healthcare-providers.md` (LeDeR mortality gap); `es/professionals/public-safety-officers.md` (Ruderman 2016 + McCauley AJPH 2017 attribution); `es/tech/screen-reader-comparison.md` (JAWS ~$105/yr, ~$1,570 perpetual, June 2026).

### ✅✅ New EN-source flags surfaced during this sync (RESOLVED 2026-06-10, EN + es)
- ✅✅ `crisis/crisis-hotlines/africa/nigeria.md:123` (EN) — leftover "**Lifeline works nationwide**" under "Other states" (referred to the removed fabricated Lifeline Nigeria) → now "**SURPIN (0800 078 7746) works nationwide**". es mirrored ("SURPIN (0800 078 7746) funciona en todo el país"). Repo-wide grep: remaining "LifeLine" hits are the legitimate LifeLine International membership notes + Lifeline South Africa.
- ✅✅ `crisis/crisis-hotlines/asian-pacific/thailand.md` (EN leaf) — all 8 obsolete **Samaritans 02-713-6791** occurrences (+ the 02-713-6793 Thai line and the 24/7 claims) replaced with **02-113-6789 (12 p.m.–10 p.m. daily; press 1 Thai, 2 English callback)**, with a "number changed December 2021" note; website fixed `samaritansthailand.org` → **samaritansthai.com**; footer crisis CTA now leads with the confirmed 24/7 line **1323 (Department of Mental Health)**, Samaritans as the English fallback with hours. Re-verified 2026-06-10 against two independent primary sources: samaritansthai.com (incl. its own number-change announcement page) and Befrienders Worldwide (befrienders.org Bangkok Centre listing) — both confirm 02-113-6789, 12:00–22:00 daily, press 1/2. es leaf mirrored throughout; both es files pass `check_translation.py`.

---

## ⚠️ ES SYNC REQUIRED (added 2026-06-07)

The Codex audit remediation (see `AUDIT_REMEDIATION_STATUS.md`) edited many **English** pages
this session. The corresponding **`es/` Spanish pages were NOT updated** and now carry the old,
incorrect content. Re-translate/sync these `es/` pages to match current English before relying
on them:

- ✅ `es/benefits/us/ssi.md` — **SYNCED 2026-06-07** to Tier B English corrections (commit `71c8172`): SSI not taxable; cash gifts DO count as unearned income + $20 general income exclusion; in-kind food no longer counts (Sept 2024), shelter still can; resource exclusions = one vehicle (any value) + household goods, countable list fixed; SGA framed as application-stage test (not ongoing limit); noncitizen rules tightened; break-even ~$2,000 (was ~$1,200). On review the `es/` page already carried all corrections (translated in place earlier); re-verified line-by-line against current English and validated clean via `check_translation.py`.
- ✅ `es/benefits/us/medicare.md` — **VERIFIED SYNCED 2026-06-07**: 2026 figures ($202.90 Part B premium, $2,100 Part D cap, $1,736/$615 deductibles), donut-hole→cap, MA copay/referral, no unsourced Medigap ranges, bathroom equipment not covered — all already present and matching current EN; validated clean. *(Open EN flag to spot-check: Part B annual deductible $283.)*
- ✅ `es/benefits/us/veterans-benefits.md` — **SYNCED 2026-06-07** to Tier C English corrections (commit `d4d8937`): caregiver stipend "varies (GS-4 locality/level)", clothing allowance "not automatic / VA Form 10-8678", TDRP "List-based, not a fixed term", Crisis Line "988 then press 1". On review the `es/` page already carried all four corrections (translated in place earlier); re-verified line-by-line against current English and validated clean via `check_translation.py`.
- ✅ `es/rights/us/ada.md`, `es/rights/us/section-504.md`, `es/rights/us/state-disability-rights-laws.md` — **VERIFIED SYNCED 2026-06-07**: ada (punitive damages NOT vs govt/Barnes v. Gorman, LGBTQ+ nuance/Williams v. Kincaid, 2024 DOJ Title II web rule Apr 2026/2027), section-504 (May 2026/2027 + July 2026 = one accessible unit per type, QALY ban, Cummings, §503 $20k), state-rights (CA DFEH→CRD all 3 spots; NY 1+ employees; Pennsylvania correctly 4+) — all already present/correct vs current EN; validated clean.
- ✅ `es/rights/us/air-carrier-access-act.md` — **SYNCED 2026-06-07** to Tier C English correction (commit `d4d8937`): "Plazos" block now tracks DOT's actual wording — airline "not required to address a written complaint received more than 45 days after the incident (unless DOT refers it)"; "DOT refers the disability-related complaints it receives and reviews them; you can also complain directly to DOT (generally within 6 months)"; deleted the old "DOT investigates / airlines must respond to DOT inquiries" bullets; ACAA "no private right of action" retained. On review the `es/` page already carried the full correction (translated in place earlier); re-verified line-by-line against current English (no OLD-wording remnants) and validated clean via `check_translation.py`.
- ✅✅ **All edited crisis pages — SYNCED 2026-06-07.** `es/crisis/crisis-hotlines/{north-america/mexico,north-america/united-states,north-america/canada,asian-pacific/india,asian-pacific/indonesia,asian-pacific/philippines,asian-pacific/thailand,asian-pacific/australia,europe/united-kingdom}.md` and `es/crisis/abuse/abuse-resources.md` now match the Tier A English corrections (`d1f90c7`). All 9 leaf pages validate clean via `check_translation.py`.

**Life-safety priority — DONE.** The crisis-page `es/` versions previously showed wrong/obsolete numbers; all are now corrected: Mexico → Línea de la Vida 800-911-2000; Thailand 1300 → DMH 1323; India → adds Tele-MANAS 14416; Indonesia → Healing119 / 119 ext 8; Philippines → NCMH 1553; Australia → Lifeline "gratuito"; UK + abuse-resources → Rape & Sexual Abuse Support Line 0808 500 2222; US/Canada → 988 emergency-policy wording. Blanket "all free/confidential/24-7" footers and false "verified" lines softened to match EN.

### 🚑 Tier A GAP — blanket claims the original audit MISSED (fixed 2026-06-07)
Surfaced while regenerating es/ meta descriptions: the Tier A crisis audit covered the main country pages but **missed 5 sub-pages**, which still carried the dangerous blanket forms ("all services free/confidential/24-7", "police only if immediate danger", false "all numbers verified through official sources"). Now hedged to the canonical Cost/Confidentiality/Hours block + "confirm each number" footer, **EN + ES**:
- `crisis/crisis-hotlines/africa/{kenya,nigeria,south-africa}` (+ es/) — full blanket block replaced; frontmatter descriptions rewritten (they carried "Police only involved if immediate danger").
- `crisis/crisis-hotlines/south-america/argentina` (+ es/) — blanket block hedged.
- `crisis/crisis-hotlines/north-america/united-states` (+ es/) — leftover false "verified through official sources" footer fixed.
- ⬜ **Separate content bug (flag, not yet fully fixed):** the **English** `argentina` and `mexico` pages contain Spanish-language sections (e.g. argentina's "Información Importante" block — now converted to EN; mexico lines ~209/217 still Spanish though correctly hedged). The EN crisis pages should be swept for untranslated Spanish content.

> Note: the aggregator index `es/crisis/crisis-hotlines/asian-pacific.md` was checked — its Thailand "1300" is the **Baan Kredtrakarn child-abuse line** (a distinct, valid service), not the obsolete Samaritans number, so it correctly mirrors EN and needs no change.

**Remaining ES sync (next session):** the benefits/ and rights/ pages listed above (⬜) are NOT yet synced to their Tier B/C English corrections.

### ⚠️ ES SYNC — employment/ + education/ (added 2026-06-07, from cold slop-sweep fixes)
These English pages were corrected this session (commits `8fa5f04`, `1f98057`) and their `es/` counterparts are now stale:
- ✅ `es/employment/workplace-accommodations.md` — **SYNCED 2026-06-07** (edited): §503 (federal contractors, $10k+) vs §504 (federal-fund recipients) de-conflated; JAN cost figures (~61% no-cost / ~$300 median); ESA case-by-case; legal-right hedge; frontmatter description. Validated clean. *(Open EN flag: confirm JAN 61%/$300 vs askjan.org.)*
- ✅ `es/employment/employment-rights-by-country.md` — **SYNCED 2026-06-07** (edited): Spain LISMI → Real Decreto Legislativo 1/2013 (2% reservation, 50+ employees); CDPD "standard ≠ enforceable individual remedy" lead caveat; fixed CDPD gloss (dropped English convention name per glossary). Validated clean.
- ✅ `es/employment/job-searching-with-a-disability.md` — **SYNCED 2026-06-07** (edited): vague "fewer callbacks" → Ameri et al. 2018 (*ILR Review*), ~26% fewer expressions of employer interest, with link. Validated clean.
- ✅ `es/education/higher-education.md` — **SYNCED 2026-06-07** (edited): CDPD signing≠ratifying caveat (US signed 2009, never ratified; US rights from ADA/§504); frontmatter description. Validated clean.
- ✅ `es/education/k12-education.md` — **SYNCED 2026-06-07** (edited): same CDPD signing≠ratifying caveat (US signed 2009; US rights from IDEA/§504). Validated clean.
- ✅ `es/benefits/index.md` — 2026 figures ($994/$1,690); one-vehicle exclusion; DAC age-22 clarification *(synced 2026-06-07, commit `7739db4`)*
- ✅ `es/benefits/poverty-and-benefits-trap.md` — 2026 SSI base; 1972/1989 reconciliation; inflation/proposed-limit correction *(synced 2026-06-07, commit `7739db4`)*
- ✅ `es/rights/filing-a-disability-complaint.md` — **SYNCED 2026-06-07** (edited): OCR section was misrouting IDEA → now OCR = §504/Title II only with an explicit note it does NOT handle IDEA/IEP; added an IDEA complaint section (state complaint 1yr / due-process hearing 2yr, 34 CFR 300.153/300.507); fixed the SoL table; also repaired broken frontmatter description. Validated clean.
- ✅ `es/rights/international-rights.md` — **SYNCED 2026-06-07** (edited): CRPD count "191 firmaron / 190 ratificaron" → "más de 190 países han ratificado la CDPD o se han adherido a ella"; restored US "firmó en 2009"; CDPD acronym used. Validated clean. *(Open EN flag: Optional Protocol "107 ratified" may be stale + undated.)*

---

## benefits/ (category complete — 20 pages, June 2026)

### Dollar amounts / figures to verify against official 2026 sources
- ✅ `benefits/us/medicare.md` — Part B premium **$202.90**, Part D cap **$2,100**, Part A deductible **$1,736**, Part D deductible **$615**. Verified correct vs CMS 2026 (Codex audit). *(EN good; ES needs sync.)*
- ✅ `benefits/us/ssi.md` — SGA **$1,690/mo** and FBR **$994/mo** verified vs SSA (Codex audit). *(EN good; ES needs sync.)*
- ✅ `benefits/us/veterans-benefits.md` — **FIXED EN 2026-06-07.** Verified vs va.gov (rates eff. Dec 1 2025, 2.8% COLA): base MAPR $17,441 (no deps) / $22,839 (1 dep); now also lists **Housebound** ($21,313/$26,710) and **Aid & Attendance** ($29,093/$34,488) MAPRs so the base figure isn't mistaken for the only threshold. Net-worth limit $163,699 confirmed correct. *(ES synced 2026-06-07.)*
- ✅ `benefits/index.md` & `benefits/poverty-and-benefits-trap.md` — refreshed to 2026 (SSI base **$994**, SGA **$1,690**), verified vs SSA 2.8% COLA. Also fixed `index.md` "car up to certain value" → one vehicle (any value) and the DAC "before age 22" conflation. *(EN fixed 2026-06-07; ES needs sync.)*

### Internal inconsistencies (same page contradicts itself)
- ✅ `benefits/us/ssi.md` — the stale **~$1,200** break-even in "Common SSI Myths" was corrected this session (now ~$2,000, consistent with the income-exclusion math). *(EN fixed; ES needs sync.)*
- ✅ `benefits/poverty-and-benefits-trap.md` — reconciled the 1989-vs-1972 contradiction (limit dates to SSI's 1972 creation; current $2,000/$3,000 levels set 1989). Also corrected the inflation claim: "~$10,000" was the *proposed* SSI Savings Penalty Elimination Act figure, not inflation-adjusted (>$5,000). *(EN fixed 2026-06-07; ES needs sync.)*

### Naming / outdated references
- ✅ `benefits/us/veterans-benefits.md` — TDRP wording corrected to **Temporary Disability Retired List (TDRL)** framing this session. *(EN fixed; ES needs sync.)*
- ✅ `benefits/us/veterans-benefits.md` — Veterans Crisis Line updated to **dial 988 then press 1** (old 1-800-273-8255 noted as still routing). *(EN fixed this session; ES needs sync.)*
- ✅ `benefits/us/veterans-benefits.md` — **FIXED EN 2026-06-07.** "Available for life" → "often long-term, but not guaranteed": ratings can be reduced/ended on re-exam if the condition improves, with protections (20-yr continuous, 100% static, age-based no-re-exam). Pension "Continues for life" → "continues as long as income/net-worth limits are met". *(ES synced 2026-06-07.)*
- ✅ `benefits/us/ssi.md` — "taxed as federal income assistance" → corrected to "SSI is **not** taxable income" this session. *(EN fixed; ES needs sync.)*

### Cosmetic link-text/href mismatches (href is correct; only displayed text is wrong)
- ✅✅ **RESOLVED 2026-06-09 (PR #14, EN + es in DB).** All 32 bare-path link-text
  occurrences across `benefits/` + `tech/` (e.g. `[/benefits/us-ssi](/benefits/us/ssi)`)
  relabeled with readable names (SSI, Medicare, …). Was a repo-wide pattern, not just
  the two files first flagged — fixed every copy. 64 links (32 EN + 32 es). Hrefs unchanged.
- ✅ **DECISION MADE 2026-06-09: `/start/contribute` is canonical** (the community page).
  Done: site nav "How to Contribute" repointed `/en/glossary/how-to-contribute` →
  `/en/start/contribute` (via `navigation.updateTree`; 182 items intact); the dead
  Google Form (`forms.gle/…`, returned an error shell) dropped in favor of the email
  CTA `contribute2disabilitywiki@gmail.com` (PR #17, EN + es); title typo + placeholder
  + circular footer fixed earlier (PR #15); the email was also added to
  `/glossary/how-to-contribute` (PR #16).
  - ✅ **Follow-through COMPLETE 2026-06-09 (PR #18, verified in DB):** `disability-wiki-page`
    SKILL updated to link `/start/contribute` as canonical; all inbound links repointed
    `/glossary/how-to-contribute` → `/start/contribute` (244 links / 218 files, EN + es;
    0 broken links after); `/glossary/how-to-contribute` retitled **"Technical Contribution
    Guide"** / **"Guía de contribución técnica"** and reframed as the Git/PR workflow;
    reciprocal pointer added from `/start/contribute` → the Technical Contribution Guide.
    Force-sync didn't import the modified pages (the known quirk) — pushed all 222 via
    `publish_page.py` and verified each in the DB. The two pages no longer share a title.

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

### ✅ Dangling anchors — FIXED 2026-06-07 (EN+ES, commit `d987d5e`)
These were dead in-page TOC links on the live English site (and mirrored into es/);
all now resolve by pinning the target heading's expected id or relinking:
- `#european-union` (7 housing pages) → pinned `{#european-union}`; `#other-countries` (accessible-housing-search-guide) → pinned; `sports/paralympic-movement` → relinked `#sports`→`#summer-paralympic-sports`; `rights/international-rights` → pinned `{#united-nations-framework}`; `history/pre-industrial` → pinned the examples heading; `es/media/books` duplicate-heading `-1` dedup fixed. (`&`-in-heading anchors like `#alpine--nordic-skiing` resolve natively in Wiki.js — left as-is.)

(historical, for reference — all resolved above:)
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

---

## Final broken-link clearance + 4 new pages (synced 2026-06-07, English commit `d5772e6`)

English commit `d5772e6` cleared the last 35 broken links (2 repoints + 4 new
pages, bringing the repo to 0 broken). Propagated to `es/`:

### ✅ Repoints applied to es/
- `es/tech/screen-reader-comparison.md`, `es/tech/browsers-assistive-tech.md` — `/tech/real-world-accessibility`→`/tech/digital-disability-justice`
- `es/healthcare/medical-gaslighting.md` — `/healthcare/understanding-medical-bias`→`/healthcare/medical-bias` (3 refs)

### ✅ New Spanish pages (translated from the English originals)
- `es/community/disability-specific-peer-groups.md` (org names/acronyms kept in English: ASAN, NAD, AADB, NFB, SABE, DBSA, NAMI, CommunicationFIRST, The Arc, Helen Keller National Center, Hearing Voices Network USA)
- `es/foundations/language-terminology-identity.md`
- `es/foundations/epistemic-injustice.md`
- `es/daily-living/mobility-aid-stigma.md`

All 7 files pass `check_translation.py`; all `/es/` cross-links resolve.

---

## ✅✅ employment/employment-rights-by-country.md synced (2026-06-07)

Synced `es/employment/employment-rights-by-country.md` to the audit-corrected English source. Two corrections applied:

1. **Lead caveat (CRPD/CDPD enforceability)** — added the sentence noting the CDPD sets an international standard whose individual enforceability depends on each country's national implementation. Also fixed the first-use CDPD gloss to the official Spanish name ("Convención sobre los Derechos de las Personas con Discapacidad (CDPD)") rather than carrying the English convention name.
2. **Spain LISMI → RDL 1/2013** — replaced "La LISMI" with "La Ley General de derechos de las personas con discapacidad (Real Decreto Legislativo 1/2013, que consolidó la antigua LISMI)" per current English.

Passes `check_translation.py`.

---

## ✅✅ Four EN-source flags resolved (2026-06-08)

Verified each against the primary source, fixed English, confirmed `es/` parity.

1. **Medicare Part B annual deductible $283** (`benefits/us/medicare.md`) — ✅ **confirmed correct**, no change. [CMS 2026 fact sheet](https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles): $283 (up from $257 in 2025).
2. **JAN 61% no-cost / $300 median** (`employment/workplace-accommodations.md`) — ✅ **confirmed correct** vs [askjan.org/topics/costs.cfm](https://askjan.org/topics/costs.cfm) (report updated 2025-09-17; 5,406 employers, data 2019–2024). Added "in its 2025 cost survey" date stamp. ES already in sync.
3. **CRPD Optional Protocol "107"** (`rights/international-rights.md`) — ❌ **stale → fixed**. Updated to "As of June 2026, 109 countries are parties to the Optional Protocol" with [UN Treaty Collection](https://treaties.un.org/Pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-15-a&chapter=4) link (95 signatories / 109 parties as of 2026-06-08); also re-dated the ">190 CRPD parties" line from "As of 2024" to "As of June 2026". **ES synced** — `es/rights/international-rights.md` updated to "109 países son partes" + UN link; passes `check_translation.py`.
4. **EN Mexico + Argentina crisis pages were almost entirely in Spanish** — ❌ **fixed**. The flag understated the scope (not just Mexico lines 209/217): both `crisis/crisis-hotlines/north-america/mexico.md` and `crisis/crisis-hotlines/south-america/argentina.md` had Spanish-language bodies on the **English** locale. Translated both bodies to English, preserving every phone number and org proper name (Línea de la Vida, Teléfono de la Esperanza, CONASAMA, SEDRONAR, etc.) and the frontmatter `date`/`dateCreated`. Translated the frontmatter `description` to English. No facts changed, so the Spanish `es/` versions stay in sync. Swept all other EN crisis pages — the `south-america.md`/`north-america.md` index pages are already English (residual hits are org proper names + search-string examples).

### New EN-source flags surfaced while translating Mexico/Argentina (✅✅ RESOLVED 2026-06-09, PR #11 — verified vs primary sources, EN + es in DB)
- ✅✅ `crisis/.../mexico` — **CONADIS/CNDH 01-800-526-2345 deleted** (number unverifiable against any official source; conflated two orgs). Split into verified entries: **CNDH 800-715-2000**, **CONAPRED 800-543-0033** (discrimination complaints), **CONADIS** (conadis.gob.mx + email; phone not published unverified).
- ✅✅ `crisis/.../mexico` — **CONADIC 01-800-911-2000** was the same number as Línea de la Vida with an outdated operator → relabeled **Línea de la Vida (CONASAMA)**, noting it's the same national line.
- ✅✅ `crisis/.../argentina` — **ANDIS** name fixed to **Agencia Nacional de Discapacidad (now Secretaría Nacional de Discapacidad)**; unverifiable **4303-9088 → official 0800-555-3472** (+ Deaf/HoH video-call line). es had the wrong "Asociación Nacional de Discapacitados".
- ✅✅ `crisis/.../argentina` — emergency block corrected: **100 = Bomberos (firefighters)**, with 911 (integrated) and 107 (SAME medical). The es page literally said "Llama al 100 para la policía" — fixed.

---

## ✅✅ discord.md Spanish rewrite + online-communities index sync (2026-06-10, English commit `8a83d6e`)

The 2026-06-10 audit flagged that `community/online-communities/discord.md` was 480 lines of duplicated reddit.md content under a Discord title; the English was rewritten as a genuine Discord page in `8a83d6e`. `es/community/online-communities/discord.md` had the same defect (Spanish Reddit content under a Discord title).

- **`es/community/online-communities/discord.md`** — replaced wholesale with a fresh translation of the rewritten English page (accessibility features per discord.com/accessibility + support docs + AFB AccessWorld review; directory-based server discovery via Disboard/Discord Me/top.gg instead of named servers; evaluation guidance; DM/scam safety). Frontmatter `dateCreated` preserved; `date` set to match the English (2026-06-10). All internal links `/es/`-prefixed; external directory/support URLs untouched.
- **`es/community/online-communities/index.md`** — synced the two `8a83d6e` index hunks: the new **"Actividad"** bullet (check recent activity before investing in a group/server) and the **"Una nota sobre estafas y depredación"** blockquote (scam/predation + cold-DM warning).

Both pass `check_translation.py`. No EN-source accuracy issues spotted during translation.
