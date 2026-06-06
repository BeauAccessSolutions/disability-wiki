---
title: Audit Scope
description: Internal — scope for an external audit of AI-generated/edited content. Not for publication.
published: false
tags:
editor: markdown
---

# Audit Scope — AI-generated/edited content (sessions of 2026-06-04 → 06)

All pages below were created or edited by an AI assistant and should be independently audited. A reader already found a **High-severity factual error** (an incorrect federal Schedule II prescription-expiration rule on the ADHD page — now fixed), which is why the *whole* footprint deserves checking, especially anything with **numbers, legal rules, crisis contacts, or medical claims**. Prioritized by potential harm.

---

## 🔴 TIER 1 — Highest risk (verify every fact; harm if wrong)

### Benefits figures (verify EVERY dollar amount / threshold against current SSA/CMS/VA)
- **`benefits/us/ssi`** — 2026 FBR ($994), SGA ($1,690), Student EIE ($2,410/$9,730), break-even (~$2,073), the $2,000/$3,000 resource-limit caveat.
- **`benefits/us/medicare`** — 2026 Part A/B/D figures AND the **donut-hole → $2,100 out-of-pocket-cap rewrite** (structural claim — confirm the coverage-gap really was replaced by the cap and the number is right).
- **`benefits/us/veterans-benefits`** — 2026 COLA comp rates ($180.42–$3,938.58), pension net-worth ($163,699), SAH ($126,526), TRA ($50,961), clothing allowance ($1,053.19), and the **rewritten PACT Act (2022)** section (confirm it's the burn-pit/toxic-exposure Act, not the tobacco one).

### Legal claims (verify statutes, agencies, thresholds, deadlines, dates)
- **`rights/us/section-504`** — the **§503 contractor threshold ($20,000, OFCCP)**, the entire **2024 HHS Section 504 rule** section (compliance dates May 11 2026 / May 10 2027; accessible-equipment July 8 2026; QALY ban; *Cummings v. Premier Rehab* emotional-distress-damages caveat).
- **`rights/us/ada`** — the **2024 DOJ Title II web rule** section (WCAG 2.1 AA; compliance **April 24 2026 / April 26 2027**; population thresholds).
- **`rights/us/state-disability-rights-laws`** — DFEH→**CRD** rename; **NY now covers all employers (1+)**, not 4+.
- **`rights/us/air-carrier-access-act`** — the **45-day-to-airline / ~6-month-to-DOT** deadlines and the **"no private right of action"** claim.

### Crisis contacts (LIFE-SAFETY — dial/verify every number resolves to the right live service)
- **`crisis/crisis-hotlines/north-america/canada`** — the dead Wellness Together listing was replaced with **988**; confirm 988 is correct for Canada and nothing dead remains.
- **`crisis/crisis-hotlines/europe/united-kingdom`** — **Switchboard 0800 0119 100**, **Papyrus HOPELINE247 / text 88247**, SHOUT 85258. Verify each.

### Medical / controlled-substance / medical-advice boundary
- **`daily-living/adhd-medication-access`** — re-verify ALL DEA/FDA/Schedule-II claims (one was already wrong); confirm shortage status is current; confirm **no dosing/medical advice** crept in (every med mention should be "ask your prescriber").
- **`conditions/autistic-burnout`** — confirm the "not a DSM diagnosis" hedge, the medical rule-out callout, and the 988/emergency-services disclosure are intact and accurate; recovery claims should match the (qualitative) evidence.

---

## 🟠 TIER 2 — New essays with stats/claims (check sourcing, hedging, live org URLs)

**Live (already published):**
- `intersectionality/race-and-disability`, `intersectionality/lgbtq-and-disability`, `intersectionality/poverty-and-class`, `intersectionality/disability-and-homelessness`

**In PR #5 — NOT yet live (audit before merge):**
- `intersectionality/gender-and-disability` (verify violence stat uses the sourced ~2.3× OR, NOT the unsourced "80%")
- `intersectionality/immigration-and-refugees` (⚠️ public-charge legal facts are volatile / fast-changing — date-check)
- `intersectionality/incarceration-and-criminalization` (BJS figures vs. the hedged Ruderman estimate)
- `intersectionality/indigenous-disability-perspectives` (⚠️ ideally reviewed by an Indigenous disabled reader; prevalence figures hedged)
- `intersectionality/religion-and-disability` (`[interpretive]` tags; balanced across traditions)
- `intersectionality/rural-disability` (US-scoped hard data vs. weaker global figures)

For each: are statistics sourced and hedged where contested? Do all listed organizations exist and are URLs live? Is framing accurate and non-defamatory?

---

## 🟡 TIER 3 — Lower risk (structure/quality)

- **`foundations/what-is-disability`** — merged page; check for internal duplication and broken internal links. **`start/what-is-disability`** — now a redirect stub.
- **8 duplicate pages** redirected to canonical (stubs): `start/disability-models`, `start/for-allies`, `foundations/how-to-use-this-wiki`, `accessibility-statement`, `Rights/...ADA`, `Rights/...Fair-Housing`, `Rights/Overview`, `Healthcare`.
- **~150 internal link fixes** + **frontmatter strips (7 pages)** + **code-fence fixes (2)** + **[Date] fixes (3)** — low risk, mechanical.
- **253 auto-generated meta descriptions** — AI-derived from page intros; spot-check for accuracy/awkwardness (a few are generic, e.g. POTS). Low harm (meta only).

---

## Notes for the auditor
- The site runs **Wiki.js in pull-mode**: the markdown in this repo (`main`) is the source of truth — fixes can be made by editing the `.md` files and merging to `main` (Wiki.js pulls every 5 min).
- Backups of every API-edited page are in `backups/pagereview-2026-06-05/` and `backups/linkfix-2026-06-04/` (gitignored) for diffing against originals.
- Highest-value audit targets: **the Tier 1 numbers and legal/crisis claims.** Those are where a wrong AI fact does real harm.
