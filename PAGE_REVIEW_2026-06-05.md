# Page Review — disabilitywiki.org (2026-06-05)

Full-site structural/placeholder/duplicate scan (285 pages) + content-accuracy fact-check of high-stakes pages (benefits figures, legal rights, crisis hotlines). Items marked ✅ DONE were applied 2026-06-05; backups in `backups/pagereview-2026-06-05/`.

---

## 🚑 LIFE-SAFETY — ✅ FIXED
- **crisis/crisis-hotlines/north-america/canada** listed **Wellness Together Canada (1-866-585-0445)** twice — discontinued April 3, 2024. ✅ Replaced with **988** (call/text).

## ✅ DONE 2026-06-05 — verified data corrections (30 edits / 8 pages)
- Canada crisis: dead Wellness Together → 988.
- UK crisis: Switchboard → 0800 0119 100; Papyrus → HOPELINE247 / text 88247; SHOUT 85258 promoted to a primary listing.
- SSI: FBR → $994, SGA → $1,690, Student EIE → $2,410/$9,730, break-even → ~$2,073, resource-limit caveat added.
- Medicare: 2026 Part A/B/D figures; donut-hole rewritten to the $2,100 out-of-pocket cap.
- Veterans: 2026 COLA comp rates, pension net-worth $163,699, SAH $126,526, TRA $50,961, clothing $1,053.19; PACT Act placeholder replaced with the real 2022 burn-pit/toxic-exposure content.
- Legal: §503 threshold $10k→$20k (OFCCP note); DFEH→CRD; NY all-employers (1+); ACAA 45-day/6-month deadlines + no-private-right-of-action note.
- Backups: `backups/pagereview-2026-06-05/CORR_*.json`.

## ⏳ DRAFTED — missing legal sections (awaiting review, NOT published)
See `page-review-2026-06-05/DRAFT_legal_sections.md` — proposed sections for the **2024 DOJ ADA Title II web rule** (→ rights/us/ada) and the **2024 HHS Section 504 final rule** (→ rights/us/section-504).

## 🔴 High — security/structure (✅ DONE)
- ✅ Unpublished accidentally-public internal pages: `/claude`, `/README`, `/SECURITY`, `/SETUP`, `/PROJECT_STATUS`, `/archetypes/default`, `/archetypes/fact-checks`, `/robots` (now 403). `/SECURITY` had exposed hardening notes.
- ✅ Closed unclosed ```md code fences on `benefits/other-countries-benefits` and `benefits/us/state-benefits`.

## 🔴 High — outdated crisis contacts (UK)
- **crisis/crisis-hotlines/europe/united-kingdom**:
  - Papyrus **HOPELINEUK → HOPELINE247** (now 24/7); text number **07860 039967 → 88247**. Phone 0800 068 4141 still correct.
  - Switchboard **0300 330 0630 → 0800 0119 100** (changed March 2023).
  - SHOUT (text SHOUT to 85258) should be a *primary* listing, not buried in the Deaf/HoH section.

## 🟠 Medium — stale benefit figures (hardcoded 2024 numbers)
**benefits/us/ssi:** FBR $943 → **$994/mo** (2026; couple $1,491); SGA $1,550 → **$1,690**; Student EIE $2,050/$8,200 → **$2,410/mo / $9,730/yr**; break-even "~$1,200" → **~$2,073**. The $2,000/$3,000 resource limit is *still in force* but should carry an "outdated/under reform" caveat (SSI Savings Penalty Elimination Act, H.R.2540/S.1234).

**benefits/us/medicare:** Part A deductible $1,660 → **$1,736**; Part B premium base → **$202.90**; Part B deductible $240 → **$283**; Part D deductible $505 → **$615**. **STRUCTURAL ERROR:** the "donut hole" $4,150/$7,050 description is obsolete — Part D now has a hard **$2,100 (2026) out-of-pocket cap**, then plan pays 100%.

**benefits/us/veterans-benefits:** 2024 comp rates → 2026 (2.8% COLA): 10% $173.36 → **$180.42**, 100%-single → **$3,938.58** (page's $4,323.12 was wrong even for 2024); Pension net-worth limit $130,773 → **$163,699**; SAH grant $98,295 → **$126,526**; TRA grant $32,775 → **$50,961**; clothing allowance $1,017 → **$1,053.19**. Also: unfinished "PACT Act (Please clarify)" placeholder confuses it with the tobacco PACT Act — the 2022 burn-pit PACT Act content is missing.

*(SSDI, Medicaid, SNAP, TANF, ABLE pages deliberately quote no figures — OK as-is. For reference: 2026 ABLE contribution limit is $20,000; age-of-onset rises to 46 on Jan 1, 2026.)*

## 🟠 Medium — legal accuracy gaps
- **rights/us/section-504 & rights/us/federal-rights** omit the entire **2024 HHS Section 504 final rule** (medical-treatment nondiscrimination, value-assessment ban, WCAG 2.1 AA web compliance May 11 2026 / May 10 2027, accessible medical equipment by July 8 2026).
- **rights/us/ada** omits the **2024 DOJ Title II web-accessibility rule** (WCAG 2.1 AA; compliance April 24 2026 / April 26 2027).
- **rights/us/section-504** conflates Section 503 contractor coverage and uses outdated **"$10,000"** threshold (now **$20,000**, Oct 2025, OFCCP-enforced); should also qualify "compensatory damages" post-*Cummings v. Premier Rehab* (no emotional-distress damages).
- **rights/us/air-carrier-access-act** says "no specific deadline" — wrong: **45 days to airline / ~6 months to DOT**; and ACAA has **no private right of action** (enforcement via DOT).
- **DFEH** is stale on `rights/us/ada` & `state-disability-rights-laws` — California's agency is the **Civil Rights Department (CRD)** since July 1, 2022.
- **state-disability-rights-laws:** NY State Human Rights Law now covers **all employers (1+)**, not "4+."

*(IDEA and Fair Housing Act pages checked out legally accurate.)*

## 🟠 Medium — duplicate / inconsistent pages (need a canonical decision)
Parallel `/start/*` and `/foundations/*` sets (nav uses `/foundations`):
| Topic | foundations/ | start/ |
|---|---|---|
| disability-models | 17.5k (newer) | 13k |
| for-allies | 14.7k (newer) | 9.3k |
| what-is-disability | 9.3k | 13.2k |
| how-to-use | 3.2k | 16k |
| accessibility-statement | (root) 8k | 12k |

Plus case-variant duplicates: `/Rights/North-America/US/Fair-Housing` vs `/rights/us/fair-housing-act`; `/Rights/*` vs `/rights/*`; `/Healthcare` vs `/healthcare/index`. (Wiki.js paths are case-sensitive, so these are genuinely separate pages.)

## 🟡 Low — stubs & placeholders
- `/intersectionality/*` is ~10 published-but-empty stub pages ("_Stub page. Content coming soon._"): race, gender, immigration, incarceration, indigenous, lgbtq, poverty-and-class, religion, rural, disability-and-homelessness. *(Still open — content to be written.)*
- ✅ `[Date]` leftovers fixed on `community/index`, `crisis/index`, `education/adult-and-continuing-education` (→ "June 2026").
- The `TBD` (Special Olympics 2027 venue) and "placeholder" mentions (state-benefits intro, editorial-guidelines glossary entry) are **legitimate**, not errors — left as-is.
- **260 published pages have no meta description** — drafted proposals in `page-review-2026-06-05/META_DESCRIPTIONS_PROPOSED.md` (review, then apply).

## 🟠 Medium — raw frontmatter leaking into page body (data bug)
7 pages render their YAML frontmatter (`title:/published:/tags:`) as visible text at the top: `archetypes/fact-checks`, `benefits/poverty-and-benefits-trap`, `benefits/proving-disability`, `crisis/abuse/recognizing-violence`, `crisis/abuse/what-is-it`, `Healthcare`, `healthcare/medical-dismissal`. Fix = strip the leading frontmatter lines (mechanical; not yet applied).

## Consolidation plan
Duplicate `/start/*` vs `/foundations/*` and capital `/Rights/*` / `/Healthcare` pages: see `page-review-2026-06-05/DUPLICATE_PAGE_PLAN.md` for per-page canonical + redirect/rename recommendations (needs approval).
