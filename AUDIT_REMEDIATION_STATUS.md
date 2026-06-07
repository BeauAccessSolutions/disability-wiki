---
title: Audit Remediation Status
description: Internal tracker — progress against AUDIT_RESULTS_2026-06-06.md. Not for publication.
published: false
tags:
editor: markdown
---

# Audit Remediation Status (2026-06-07)

Tracks fixes against the Codex audit (`AUDIT_RESULTS_2026-06-06.md`). Site is Wiki.js pull-mode: edit the `.md`, merge to `main`, Wiki.js pulls (force-sync via API for immediate publish).

## ✅ DONE & LIVE

### 🚑 Tier A — life-safety crisis pages (commit fix(crisis), all verified vs official sources)
- `north-america/mexico` — lead was a **US** number → **Línea de la Vida 800-911-2000** (CONASAMA)
- `north-america/united-states` — Trans Lifeline M–F (not 24/7); 988 emergency-policy wording; demoted 1-800-273-8255
- `north-america/canada` — removed nonexistent 988 chat + "100+ languages"; emergency wording
- `asian-pacific/india` — added national **Tele-MANAS 14416**; iCall M–Sat (not 24/7); dropped AASRA WhatsApp claim
- `asian-pacific/indonesia` — lead → **Healing119.id / 119 ext 8** (Kemenkes)
- `asian-pacific/philippines` — lead → **NCMH 1553**; updated old Hopeline landlines
- `asian-pacific/thailand` — **1300 → 1323** (Dept of Mental Health)
- `asian-pacific/australia` — Lifeline "free" (not "local call rate"); QLife not 24/7
- `europe/united-kingdom` + `crisis/abuse/abuse-resources` — Rape Crisis **0808 802 9999 → 0808 500 2222**
- Softened "all free/confidential/24-7" + false "verified" footers site-wide

### 🔴 Tier B — High content
- `benefits/us/ssi` — SSI not taxable; gifts DO count; in-kind food rule (Sept 2024); resource exclusions (one vehicle any value, household goods); SGA = application test; noncitizen rules
- `rights/us/ada` — punitive damages NOT vs government (Barnes v. Gorman); LGBTQ+ exclusion rewritten (LGB "not impairments"; people with a disability protected; gender dysphoria can qualify — Williams v. Kincaid)

### 🟠 Tier C — Medium content
- `rights/us/section-504` — July 2026 equipment = one accessible unit per type (not all)
- `rights/us/state-disability-rights-laws` — CA DFEH→CRD (2 leftover spots); NY 4+ → all employers (1+)
- `benefits/us/medicare` — removed donut-hole leftover; qualified MA copay/referral; removed unsourced copay/Medigap ranges; bathroom equipment not covered
- `benefits/us/veterans-benefits` — caregiver stipend varies (GS-4 locality/level); clothing allowance not automatic; TDRP not a fixed 5-year term
- `rights/us/air-carrier-access-act` — DOT's actual 45-day / 6-month wording

### 🔧 Tier E — structural blocker
- Restored missing canonical `foundations/disability-models.md` (was stubbed-to but absent from repo → broke a redirect + 17 references). Exported from the Wiki.js DB.

---

## ⏳ REMAINING (paused 2026-06-07)

### Tier D — the 10 intersectionality essays
**Live now (fix in place):**
- `race-and-disability` — attribute/soften the "quarter of Native women sterilized" estimate; date + source-link stats (CDC AI/AN 38.7%; Black maternal mortality ~3.5×; Child Trends special-ed)
- `lgbtq-and-disability` — add direct sources for prevalence/discrimination/conversion-therapy; "every major medical association" → name them; **verify/replace rad.org** (didn't resolve)
- `poverty-and-class` — "designed to keep disabled people poor" → "can keep / are structured to" (intent-as-fact); qualify Medicaid-loss/work-disincentive; source the "earn less for same work" claim
- `disability-and-homelessness` — "researchers consistently estimate ~half" is not defensible universally (sheltered data ~35%); name dataset/scope; attribute the CRPD Art. 19 "violation" as interpretation

**In PR #5 (fix before merge — not yet live):**
- `rural-disability` — **remove "friends sharing medication"** (unsafe/unlawful to normalize); drop the unsupported WHO "large majority rural" claim; split hospital "closed" vs "converted" (81/65, USDA); source travel/physician/AgrAbility/prevalence/broadband; soften CIL "statutory rural-outreach mandate"
- `indigenous-disability-perspectives` — **GAO sterilization fix** (GAO found non-compliance with IHS consent regs, NOT "court moratorium violations"; cite GAO HRD-77-3); still needs Indigenous disabled review before merge
- `immigration-and-refugees` — date the "late 2025 public-charge moves" to a specific memo/proposal; note 2022 rule remains operative; cite agency rules for the §504 claim
- `incarceration-and-criminalization` — keep BJS 32%/40% only with 2011–12 date (note 2016 = 38%); source the solitary-suicide and "hundreds of bills" claims; give the exact FCC order/date
- `gender-and-disability` — date the NWLC "31 states" figure (2025 NWLC says 30); link the 2.27× OR + the ~2× lifetime study
- `religion-and-disability` — name the 2021 Jewish faith-inclusion survey + population; fix the AAPD IDAC link (redirects to 2011) and the RespectAbility→Disability Belongs redirect

### Spanish (`es/`) translation sync — ⚠️ added 2026-06-07
All English pages fixed this session have `es/` counterparts that are **now stale** and still carry the old/incorrect content (including wrong crisis numbers). See `docs/translation-source-accuracy-flags.md` for the full list and the ES-sync priority order (crisis pages first — life-safety). That file also tracks additional English-source issues the translator flagged (some already fixed this session; `benefits/index.md` + `poverty-and-benefits-trap.md` 2024-figure refresh and the 1972/1989 asset-limit contradiction remain open).

### Tier E — structural (rest)
- **~48 unresolved internal links / 195 references** — recurring: `/community/online-communities`, `/community/disability-specific-peer-groups`, `/crisis/emergency-disaster-preparedness`, `/foundations/language-terminology-identity`; plus mechanical `/benefits/us-ssdi.md`-style stale paths on condition pages; one stray `/crisis/crisis-hotlines/south-america/indonesia`
- **253 auto-generated descriptions** — 191 end mid-sentence (ellipsis), 14 end with a colon, 34 exact duplicates (incl. 10 copied from the contribute footer), `Rights/Filing-a-Disability-Complaint` = "2. Try Internal Process First", fact-check pages show `[DATE]`/`[Archive.org link]` placeholders, condition pages (POTS/EDS/MCAS) don't name the condition. Best treated as drafts → regenerate or hand-edit.
- `scripts/validate_wiki_links.py` — base-dir bug (`Path(__file__).parent / 'disability-wiki'`) scans zero files; fix before using as a release gate.
