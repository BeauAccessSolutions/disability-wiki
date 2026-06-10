---
title: Audit Results 2026-06-10
description: Internal tracker — slop sweep + accuracy audit of the ~200 English pages not covered by the 2026-06-06/07 audits. Not for publication.
published: false
tags:
editor: markdown
---

# Slop Sweep + Accuracy Audit — 2026-06-10

Scope: all English sections NOT covered by the 2026-06 audits (`AUDIT_RESULTS_2026-06-06.md` covered employment/education/benefits/rights/flagged-crisis/intersectionality).
Swept this round: healthcare, conditions, housing, daily-living, crisis (full re-scan incl. unverified regions), transport, tech, professionals, research, foundations, glossary, history, start, community, relationships, sports, media, get-involved, root pages.
Method: 6 parallel scanner agents using `disability-wiki-slop` rubric (Tier 1 factual / 1c omissions / 2 style / 2b voice).

**Coverage gap:** the community/relationships/sports/media/get-involved scanner skipped some files for time — `sports/wheelchair-sports`, `sports/blind-sports`, `media/blogs-and-websites`, `media/podcasts`, `get-involved/policy-advocacy`, `get-involved/community-organizing`, `get-involved/accessible-protest-guide`, and read several relationships pages only partially. Re-sweep those before declaring the section clean.

---

## 🚑 Priority 0 — Life-safety hotline numbers (mandatory cross-verification)

Unverified crisis numbers in never-audited regions. The 2026-06 audit found the Mexico lead hotline was a fabricated US number; same fabrication pattern suspected here (unsourced "recent launch" claims, wrong-country phone formats).

| # | Page:line | Country | Number | Claimed operator | Red flag |
|---|-----------|---------|--------|------------------|----------|
| 1 | crisis/crisis-hotlines/africa.md:162 | Nigeria | 0800-800-2000 | She Writes Woman | "launched 2024, toll-free 24/7", no source; appears ONLY on Africa overview, absent from nigeria.md — top fabrication suspect |
| 2 | crisis/crisis-hotlines/asian-pacific.md:353 | Pakistan | 0311-7786264 | Umang | format doesn't match +92-3XX standard; no source |
| 3 | crisis/crisis-hotlines/kenya.md:48 (+africa.md:203) | Kenya | 0722-178-177 | Befrienders Kenya | no website/email/source |
| 4 | crisis/crisis-hotlines/asian-pacific.md:145 | Hong Kong | 18111 | Govt mental health | "launched Dec 2023, 24/7" unsourced |
| 5 | crisis/crisis-hotlines/nigeria.md:26 | Nigeria | +234-809-063-0000 | Lifeline Nigeria | "24/7, free" unsourced; generic email |
| 6 | crisis/crisis-hotlines/south-america.md:261 | Venezuela | 0800-774-2656 | 0800-PSICÓLOGO | unverified; infrastructure questionable |
| 7 | crisis/crisis-hotlines/africa.md:75 | Egypt | (claim of absence) | "Befrienders Cairo closed ~2005" | 20-yr-old unsourced claim |
| 8 | crisis/crisis-hotlines/asian-pacific.md:174 | Indonesia | (021) 9696-9293 / 0818-0140-1754 | LSM Jangan Bunuh Diri | two numbers, old format, no source |
| 9 | crisis/crisis-hotlines/asian-pacific.md:427 | Fiji | 1543 ("updated from 132-454") | Lifeline Fiji | change claim unsourced |
| 10 | crisis/crisis-hotlines/kenya.md:29 | Kenya | — | Kenya Red Cross | "24/7, 365 days" unsourced |
| 11 | crisis/crisis-hotlines/africa.md:142 | Ghana | 0244-846-701 | Lifeline Ghana | no source |
| 12 | crisis/crisis-hotlines/asian-pacific.md:265 | Vietnam | 1800-599-999 | Mental Health Hotline | no source |
| 13 | crisis/crisis-hotlines/africa.md:308 | Zimbabwe | (04) 706-055 | Lifeline Zimbabwe | no source |
| 14 | healthcare/mental-health.md:191-196 | US/Canada | 988, 1-833-456-4566, Trans Lifeline 1-877-565-8860, Trevor 1-866-488-7386 | various | re-verify current (Trans Lifeline hours were wrong elsewhere pre-audit) |
| 15 | housing/homelessness-and-disability.md:162-164 | US | SAMHSA 1-800-662-4357; Veterans 877-424-3838; 211 | SAMHSA/VA/211 | "24/7"/"free" claims unsourced |
| 16 | relationships/dating-and-relationships.md | US | (MISSING) | Nat'l DV Hotline | IPV discussed but no hotline in lead — omission |

Also: internal contradictions in crisis pages — Hungary Kék Vonal hours (europe.md:433 vs global-crisis-hotlines.md:110); global page says "60 corrections" at :440 vs "62" at :307; Thailand Samaritans hours conflict.

## 🔴 Priority 1 — High-risk factual claims (verify, then fix or source)

### Structural
- **community/online-communities/discord.md — entire file is Reddit content** (frontmatter says Discord; all 480 lines duplicate reddit.md). Replace or remove.

### Internal contradictions
- **Aktion T4 death count**: foundations/disability-culture.md:79 says "over 200,000"; history/eugenics.md:121 says "over 70,000" (the standard archival figure). Reconcile.
- **POTS↔hEDS overlap**: chronic-illness.md:156 "41–80% of hEDS have POTS" vs POTS.md "31% of POTS meet hEDS criteria" — different directions but unsourced both ways.

### Unsourced load-bearing statistics (selection — full agent output in session)
- professionals/public-safety-officers.md:19 — "30–50% of people killed by police have a disability"; "more than half of disabled African Americans arrested by age 28"
- professionals/healthcare-providers.md:19 — "UK women with learning disabilities die 20 years younger"; "mortality nearly twice as high"; :101 "settlements exceeding $70,000"; :287 obesity-attitude stats
- professionals/employers-and-hr.md:19-21 — "30% of college-educated professionals have a disability, 3.2% disclose"; "30% more engaged"
- housing/homelessness-and-disability.md:43-47, 88-91, 130-132 — "50% of homeless have disabilities / 2-3×"; Housing First "88% reduction / 73% increase 2018-2024 / $1.44 per $1"; HUD-VASH "85,000+ vouchers"; PATH "103,000+"
- housing/home-modifications.md:94 — VA grant "$121,812 (FY 2025)" unsourced; :250 — "DFG reaches ~6%, 6+ month waits"
- housing/housing-rights.md:17 — "CRPD ratified by 186 countries" (stale count, no date)
- housing/group-homes-and-institutions.md:54-56 — "2.6 million globally institutionalized"; "900,000+ in US unnecessarily"
- housing/accessible-housing-search-guide.md:73-76 — SocialServe "27+ states", phone 1-877-428-8844; "46,000+ accessible apartments" clearinghouse
- conditions/POTS.md:40 — "1–3 million Americans, doubling since COVID"
- conditions/EDS.md:19,236 — "10–15 clinicians / 10 misdiagnoses"; "1 in 500 to 1 in 5,000"
- conditions/MCAS.md:63-65 — ICD-10 Oct 2016; "up to 17%" prevalence
- healthcare/medical-dismissal.md:21,39,47-49 — ECRI 2025 #1 threat; "94% HealthCentral"; "85% Current Psychology 2024"; "72% Mira survey"
- healthcare/pain-and-fatigue.md:159-160 — "GET has been shown to harm" (needs citation, e.g. NICE 2021/Cochrane context)
- relationships/parenting-with-a-disability.md:47 — "4.1 million disabled parents in US"
- relationships/abuse-safety-and-consent.md:40 — "2–10× higher abuse rates" unlinked
- sports/paralympic-movement.md:41-42,53 — Paris 2024 figures unsourced; IPC quote unlinked
- history/accommodations.md:363 — Egyptian prosthetic "~1500 BCE"; whole page's historical anecdotes unsourced
- history/ada-history.md:206 — Bush "shameful wall of exclusion" quote (verify exact wording; it's real but check phrasing)
- history/global-timelines.md:46 — CRPD "190 signed / 180 ratified" no date
- tech/screen-reader-comparison.md:36 — JAWS "$90/year or $1,000+" no date-stamp
- daily-living/adhd-medication-access.md:21-32 — shortage/quota specifics need live-source links (page already warns it's volatile — good — but link FDA/ASHP/Federal Register)
- transport pages — FTA 1-888-446-4511 / DOT 1-800-778-4838 hotlines un-datestamped; ADA complaint deadlines absent (heatmap's known cluster)

### Unhedged / blanket claims
- crisis/global-crisis-hotlines.md + index — residual "free/confidential/24-7" blanket phrasing (some softened in prior audit; new instances at global:439-441)
- professionals/public-officials.md:3 — "15–20% of every community"
- housing/home-modifications.md — "landlords must pay" stated beyond federally-assisted context

## 🟠 Priority 2 — Missing safeguards (additive fixes)

- housing/personal-care.md — walks through hiring PCAs/intimate care with **no "if your PCA is unsafe/abusive" pathway** and no employer-obligations note (the classic 1c case)
- healthcare/medical-dismissal.md — no acute-crisis pathway
- healthcare/healthcare-rights.md:50-55 + foundations/glossary CRPD citations — no "treaty standard ≠ enforceable remedy; US signed-not-ratified" caveat (recurring sitewide)
- healthcare/pain-and-fatigue.md — no "if prescribed GET and concerned" pathway
- healthcare/systemic-trauma.md — no "surviving while still in the system" section
- housing/home-and-community-care.md — no "what if you're stuck on an HCBS waitlist now" guidance
- healthcare/hospital-preparation.md — weak "escalate during violations" guidance
- daily-living/cooking-and-nutrition.md — no "not medical advice / conditions vary" note near medication-interaction content
- community/online-communities/index.md — no scam/predation safety note + no "verify communities are still active" note
- relationships/dating-and-relationships.md — no DV hotline in lead (also P0 #16)
- research/ethical-research-with-disabled-communities.md — no participant-rights/withdrawal/IRB note up front
- transport/air-travel-rights.md — no "rights ≠ enforcement" caveat
- transport/paratransit.md — eligibility conditionality + appeal rights not stated early
- Directory pages (crisis regions, housing search, media lists) — no access-date / "verify before relying" footers

## 🟡 Priority 3 — Style/voice (minor; wiki is largely clean)

Voice is strong sitewide — agency-led, no ableist vocabulary found, inspiration-porn correctly rejected. Scattered minor items: "realm" (housing-rights), "In today's food landscape" (cooking-and-nutrition), "seamlessly" (media/books.md:122), repetitive "Help is available immediately, confidentially, and without judgment" boilerplate on every crisis regional page, asia-pacific.md:531-538 filler. Batch-fix opportunistically; no dedicated pass needed.

---

## Remediation log

### ✅ DONE 2026-06-10 (branch fix/audit-2026-06-10-accuracy)

**P0 hotlines — verified vs 2+ primary sources each, fixed:**
- Nigeria "Lifeline Nigeria" = FABRICATED (no org anywhere, email domain has no DNS) → SURPIN 0800 078 7746 (24h, surpinng.com + LifeLine Intl) sitewide; She Writes Woman confirmed (0800 800 2000, 24/7) but launch year 2024→2020
- Kenya Red Cross 0800 721 100 = CONTRADICTED (no trace; nearest match is a telecom-complaints line) → 1199 toll-free 24/7 (+254 703 037 000 backup); Befrienders Kenya 24/7→9am-5pm
- Vietnam 1800-599-999 = **a bank's customer-service line (MSB)** → Ngày Mai 096 306 1414 (limited hrs) + "no national 24/7 line" note + child line 111
- Venezuela 0800-PSICÓLOGO = untraceable → FPV LAPSI (0212) 416-31-16 / (0424) 290-73-38 Fri–Sun 8-8 + Psicólogos Sin Fronteras
- Ghana "Lifeline Ghana" + wrong MHA number → MHA 0800-678-678 (mha-ghana.com)
- Zimbabwe "Lifeline Zimbabwe (04) 706-055" (obsolete area code, no trace) → Samaritans Bulawayo +263 9 65000 (24/7), Friendship Bench 0808 4116, Childline 116
- Egypt "no functioning hotline" now FALSE → MoH 16328 (round-the-clock; verified via Egypt Independent/UNHCR), Befrienders Cairo history kept
- Indonesia overview: LSM Jangan Bunuh Diri unverifiable → Healing119 (119 ext 8) lead
- Thailand Samaritans (02) 713-6793 → 02-113-6789 (changed Dec 2021), 12pm-10pm; 1323 confirmed
- Hungary: 116-123 = LESZ 24/7 adult line (was mislabeled Kék Vonal 18:00-06:00); Kék Vonal 116-111 = youth ≤24, 24/7
- Canada: Talk Suicide 1-833-456-4566 retired → 988 (crisis/index, north-america, mental-health)
- CONFIRMED keep: Pakistan Umang (WhatsApp claim softened), HK 18111 (Dec 2023 launch correct), Fiji 1543, CVV 188, 988 US (Press 3 termination already noted), Trans Lifeline (hours added on mental-health.md), Trevor, SAMHSA, NCHV, 211
- NDVH safety box added to relationships/dating-and-relationships.md lead (verified listing)

**P1 verified fixes:** T4 contradiction (70,273 T4-phase / ~250k total, USHMM); CRPD 193 parties/164 signatories June 2026 + enforceability hedge (housing-rights, global-timelines); VA SAH $126,526 FY2026; Ruderman 2016 attribution + caveat; McCauley AJPH 2017 attribution; LeDeR mortality-gap correction; JAWS ~$105/yr ~$1,570 perpetual (June 2026).

### ⏳ OPEN
- [ ] discord.md structural fix (file is Reddit content — needs real Discord page or removal)
- [ ] Remaining P1 unsourced statistics (housing/homelessness Housing-First stats, conditions prevalence figures, medical-dismissal survey stats, employers-and-hr stats, paratransit deadlines, etc.) — need verification rounds
- [ ] P2 safeguard additions (personal-care abuse pathway, CRPD caveat sweep, GET pathway, HCBS waitlist, online-communities scam note, research IRB note, directory access-dates)
- [ ] Re-sweep skipped files: sports/wheelchair-sports, sports/blind-sports, media/blogs-and-websites, media/podcasts, get-involved/policy-advocacy, get-involved/community-organizing, get-involved/accessible-protest-guide, partial relationships pages
- [ ] **es/ sync — life-safety**: es/ crisis pages still carry the fabricated/wrong numbers fixed above (es/crisis/crisis-hotlines/africa*, africa/nigeria, africa/kenya, asian-pacific, south-america, europe, global; es/healthcare/mental-health; es/crisis/index) plus es/foundations/disability-culture (200,000 T4), es/history/eugenics & global-timelines
