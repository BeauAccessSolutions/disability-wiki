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

---

## benefits/ (category complete — 20 pages, June 2026)

### Dollar amounts / figures to verify against official 2026 sources
- ✅ `benefits/us/medicare.md` — Part B premium **$202.90**, Part D cap **$2,100**, Part A deductible **$1,736**, Part D deductible **$615**. Verified correct vs CMS 2026 (Codex audit). *(EN good; ES needs sync.)*
- ✅ `benefits/us/ssi.md` — SGA **$1,690/mo** and FBR **$994/mo** verified vs SSA (Codex audit). *(EN good; ES needs sync.)*
- ⬜ `benefits/us/veterans-benefits.md` — VA Pension income range "**~$17,400–$22,800**" may conflate **base** MAPR with **Aid & Attendance** MAPR (A&A is higher, ~$28k–$33k). Still open — check VA MAPR tables and clarify base vs A&A.
- ⬜ `benefits/index.md` & `benefits/poverty-and-benefits-trap.md` — still show **2024** values (SSI base **$943**, SGA **~$1,550**). **Open** — refresh to 2026 ($994 / $1,690). *(Not edited this session.)*

### Internal inconsistencies (same page contradicts itself)
- ✅ `benefits/us/ssi.md` — the stale **~$1,200** break-even in "Common SSI Myths" was corrected this session (now ~$2,000, consistent with the income-exclusion math). *(EN fixed; ES needs sync.)*
- ⬜ `benefits/poverty-and-benefits-trap.md` — SSI $2,000 asset limit "set in **1989**" vs "set in **1972**, raised once (1989)" contradiction. **Open** — reconcile (the $2,000 individual limit took effect 1989; SSI began 1972). *(Not edited this session.)*

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
