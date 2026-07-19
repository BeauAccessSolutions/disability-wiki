---
title: Canonical Claims Ledger
description: Internal — single registry of load-bearing facts (crisis numbers, benefits figures, legal rules) with their primary source and verification status. Not for publication.
published: false
tags:
editor: markdown
---

# Canonical Claims Ledger

**Purpose.** One registry for the wiki's **load-bearing facts** — the numbers,
deadlines, and rules a reader would *act on*, where being wrong causes real harm.
Each row pins a claim to a **primary source** and a **verification date**. When the
accuracy or slop skills correct something, record it here so the same figure isn't
re-litigated from scratch next sweep.

Adapted from the `public-ledger` `CLAIMS.md` discipline. It is the content analog
of that project's "single source of truth for headline numbers."

**Why it exists.** The fact-check error heatmap (project memory) shows the wiki's
errors cluster in exactly the claim types below: **crisis hotline numbers**
(fabricated "Lifeline {Country}" orgs), **cross-jurisdiction legal detail**, and
**procedural deadlines**, plus **unsourced load-bearing statistics**. Those last
ones usually have a *real* source (Ruderman 2016, LeDeR, etc.) that got mangled or
dropped — the fix is attribution, not deletion. This ledger is where attribution
lives.

## How to use it

- **Cite from here.** Audit docs, the accuracy skill, and translations should
  treat a ✅ row as settled and pull the source from this table.
- **One claim per row.** Keep the metric exact and the source a *primary* one (the
  operating org, the statute, the agency rule), not a secondary explainer.
- **Fix EN and `es/` together.** A corrected number lives in two files; note both.
- **Grep before closing.** Load-bearing numbers propagate across overview/country
  pages and footers — confirm sitewide (`grep -rn "<value>" . --include=*.md`).
- **Archive, don't delete.** If a claim is corrected, move the old value to
  *Corrected / archived* with the reason — never silently overwrite history.

**Status legend:** ✅ verified against primary source · ⬜ to-verify · ⚠️ disputed /
needs re-check · 🗄️ archived (superseded).

---

## Crisis & hotline numbers (SEV1 — life-safety)

Highest-stakes rows. A wrong number here is a [SEV1 incident](INCIDENT_RESPONSE.md).
Numbers below were corrected in the 2026-06 crisis audits (commits `78b2ed3`,
`7328e33`; tracked in `translation-source-accuracy-flags.md`) and synced to `es/`.
**Re-verify against the operating org annually** — hotlines change numbers/hours.

| Page(s) | Claim | Value | Primary source | Verified | Status |
|---|---|---|---|---|---|
| crisis/.../us | US suicide & crisis lifeline | **988** | 988lifeline.org / SAMHSA | 2026-06 | ✅ |
| crisis/.../mexico | Mexico lead crisis line | **800-911-2000** | replaced a fabricated US number | 2026-06 | ✅ |
| crisis/.../africa, .../nigeria | Nigeria suicide line (SURPIN) | **0800 078 7746** | replaced fabricated "Lifeline Nigeria +234-809-063-0000" | 2026-06 | ✅ |
| crisis/.../africa, .../kenya | Kenya crisis line | **1199** | replaced untraceable Red Cross 0800 721 100 | 2026-06 | ✅ |
| crisis/.../africa | Egypt MoH mental health | **16328** | replaced "no functioning hotline" | 2026-06 | ✅ |
| crisis/.../africa | Ghana Mental Health Authority | **0800-678-678** | replaced fabricated "Lifeline Ghana" | 2026-06 | ✅ |
| crisis/.../asian-pacific | Vietnam (Ngày Mai) | **096 306 1414** | replaced a *bank* customer line 1800-599-999 | 2026-06 | ✅ |
| crisis/.../asian-pacific | Thailand Samaritans | **02-113-6789** (12:00–22:00) | Samaritans Thailand | 2026-06 | ✅ |
| crisis/.../india | India Tele-MANAS | **14416** | Govt of India / MoHFW | 2026-06 | ✅ |
| crisis/.../europe | Hungary lifeline | **116-123** (LESZ, 24/7) | corrected mislabel as Kék Vonal | 2026-06 | ✅ |
| crisis/.../africa | Nigeria "She Writes Woman" line | 0800-800-2000 | flagged in AUDIT_RESULTS_2026-06-10 P0 (only on overview, absent from country page — suspected fabrication) | — | ⚠️ |

> **Open:** complete the AUDIT_RESULTS_2026-06-10 Priority-0 crisis-number
> re-verification for never-audited regions, then promote rows here.

## Benefits figures (US)

| Page | Claim | Value | Primary source | Verified | Status |
|---|---|---|---|---|---|
| benefits/us/ssi | SSI is **not** taxable income | not taxable | SSA | 2026-06 | ✅ (was wrongly "taxed as federal income assistance") |
| benefits/us/ssi | In-kind **food** no longer counts as ISM | effective **2024-09-30** | SSA final rule | 2026-06 | ✅ (page had been outdated) |
| benefits/us/ssi | General income exclusion | first **$20/month** of most income | SSA | 2026-06 | ✅ (corrected the "gifts" myth) |
| benefits/us/ssi | Vehicle exclusion | one vehicle excluded regardless of value | SSA | 2026-06 | ✅ (corrected "car up to a certain value"; had propagated to benefits/index) |

## Legal rules & deadlines (cross-jurisdiction — heatmap hot zone)

| Page | Claim | Value | Primary source | Verified | Status |
|---|---|---|---|---|---|
| rights/us/ada | ADA Title II — **no punitive damages** vs government | unavailable | *Barnes v. Gorman* (2002) | 2026-06 | ✅ (fixed in es/; EN reconciliation pending per translation memo) |
| rights/.../idea | IDEA complaint deadlines | **1 yr** state complaint / **2 yr** due process | IDEA / 34 CFR | 2026-06 | ✅ (a page had wrongly used 180 days and routed IDEA to OCR) |
| rights/.../section-504 | OCR (§504 / Title II) complaint deadline | **180 days** | US ED OCR | 2026-06 | ✅ (distinct from IDEA above — do not conflate) |
| rights/us/ada | §503 vs §504 | distinct authorities | distinguish OFCCP §503 from §504 | — | ⬜ (known conflation hot spot — spot-check) |

## History & political economy (verified 2026-07-18)

Load-bearing figures from two external research briefs, verified before drafting.
Five parallel verification passes; **nothing was wholesale fabricated, but 5 claims
had no locatable source, 4 were materially outdated, and 1 was inverted.** The briefs'
own confidence labels understated the problem in several places.

### Verified — safe to cite

| Claim | Value | Primary source | Verified | Status |
|---|---|---|---|---|
| Sweden eugenic sterilization total | **~63,000**, mostly women, laws to **1976** | Swedish govt commission; CoE Parl. Assembly 2011 | 2026-07 | ✅ |
| Sweden — coercion breakdown | **~21,000 forced / ~6,000 coerced "voluntary" / ~4,000 indeterminate** | 2000 Swedish govt report | 2026-07 | ✅ (use instead of "half forced", which flattens the distinction) |
| Aktion T4 — official gassing phase | **70,273** (Jan 1940–Aug 1941) | T4's own "Hartheim Statistics", recovered 1945 | 2026-07 | ✅ |
| Aktion T4 — total | **at least 250,000; commonly 275,000–300,000** | USHMM (250,000); German Federal Archives | 2026-07 | ✅ |
| Nazi sterilization total | **~400,000** | USHMM | 2026-07 | ✅ |
| US national sterilization total | **>60,000** (an undercount) | Lombardo, *Three Generations, No Imbeciles* | 2026-07 | ✅ |
| Virginia sterilizations | **7,300–8,300** (8,300 most-cited) | Encyclopedia Virginia | 2026-07 | ✅ (brief's 1927–1979 range is 1927–1972 in source) |
| Tuskegee polio center — NFIP grant | **$161,350**, announced May 1939, opened Jan 1941 | Rogers, *AJPH* 97(5) 2007, 784–795 | 2026-07 | ✅ |
| Warm Springs whites-only quote | "We cannot take colored people for this reason" — **Chief Surgeon Charles Irwin** | Rogers, *AJPH* 2007 | 2026-07 | ✅ (attribute to Irwin, not "a foundation statement") |
| Martha Lillard | b. 1948-06-08, d. **2026-06-26**, Shawnee OK | AP; STAT; KGOU/KOSU | 2026-07 | ✅ ("last *known*" US user — sister's attribution, not a registry) |
| Paul Alexander | d. **2024-03-11**; Guinness record **71 years** | Guinness; NPR | 2026-07 | ✅ (not 72; COVID *not* established as cause of death) |
| OCR personal-ventilator protection | Hospitals "should not re-allocate personal ventilators brought by a patient" | HHS OCR resolutions — TN 2020-06-26, UT 2020-08-20 | 2026-07 | ✅ **Scope: negotiated state resolution language, NOT a nationwide rule** |
| WPV1 endemic countries | **Afghanistan and Pakistan** only | GPEI, as of 2026-07-15 | 2026-07 | ✅ |

### Machine-readable rejected claims

`scripts/check_claims.py` reads the block below and **fails CI** if a `blocking`
pattern reappears in published content. This is the regression guard: a verification
pass that rejects a claim produces knowledge that otherwise dies with the session,
and the same bad figure ships again next time the source is re-imported.

Format is `tier :: regex :: why`. The delimiter is `::`, not `|`, because the
patterns use `|` for regex alternation. Use `blocking` for claims that are wrong
or unsourceable, `advisory` for ones needing attribution rather than removal.
Keep patterns tight enough not to match legitimate prose.

<!-- REJECTED-CLAIMS:START -->
```
blocking :: \$3\.40\s*(?:/|per\s*)?h(?:ou)?r :: invented figure; GAO says most under $3.50, USCCR average $3.34
blocking :: 447[,.]?600 :: untraceable Cuban disability population; sourced figure is 366,864
blocking :: 306,000\s+(?:people\s+)?receiv :: unverifiable 1776 English poor-relief count
blocking :: last iron lung user.{0,40}(?:UK|United Kingdom|Britain) :: no locatable source; likely conflated with the 2017 US count or the UK's 1984 last polio case
blocking :: (?:86|64)\s*%.{0,40}(?:denial|non-invasive vent) :: AAHomecare trade intake, no denominator or named plan; not an OIG figure
blocking :: integrated employment.{0,60}forbidden.{0,20}1968 :: over-generalization; Phillips's own source covers only internat residents
blocking :: 400,000\s*(?:to|–|-)\s*600,000\s+(?:disabled\s+)?children :: counts all children without parental care, not disabled children; off by ~20x
blocking :: Sweden sterili[sz]ed thousands :: understates by an order of magnitude; verified total ~63,000
advisory :: 350,000.{0,40}(?:T4|euthanasia) :: top of a 200k-350k spread, not consensus; USHMM says 250,000
advisory :: there are no invalids in the USSR :: single 1986 émigré memoir, no named official; attribute to Fefelov, never assert
advisory :: 14\(c\).{0,80}(?:phase[- ]out|proposed rule).{0,40}pending :: rule WITHDRAWN 2025-07-07; check current status before publishing
blocking :: Suecia esteriliz[óo] a miles :: ES twin of the Sweden understatement; verified total ~63,000
advisory :: no hay inv[áa]lidos en la URSS :: ES twin; single 1986 émigré memoir, attribute to Fefelov, never assert
```
<!-- REJECTED-CLAIMS:END -->

### ⚠️ Do not publish — no locatable source

| Claim (as asserted in brief) | Finding |
|---|---|
| UK's last iron lung user died 2017 (Guardian) | No source found in four search formulations. Likely conflation with the 2017 US count of three, or the UK's last polio paralysis case (1984). |
| Cuba — 447,600 disabled people | Untraceable. Sourced figure is **366,864** (*Por la Vida*, 2003). |
| England — 306,000 receiving relief in 1776 | Unverifiable. (The ~90,000 workhouse places figure *is* sound.) |
| 14(c) workers earning under **$3.40/hr** | Not a real figure. GAO: most under **$3.50**; USCCR cited **$3.34** average. |
| Medicare Advantage NIV denial rates "86% and 64%" | No locatable primary source. Traces to AAHomecare trade-association intake via HME News; plans unnamed, no denominator. Other MA plans reported in the low teens. |

### 🗄️ Outdated — brief is stale, do not repeat

| Claim (as asserted) | Current reality | Source |
|---|---|---|
| DOL 14(c) phase-out rulemaking pending | **WITHDRAWN 2025-07-07.** DOL concluded it lacks statutory authority (§14(c) says the Secretary "shall" issue certificates). No federal rulemaking pending; certificates still issued. | 90 FR doc. 2025-12534 |
| 14(c) worker count ~67,000 (2022) | **~40,000** (Nov 2024) | GAO |
| WHO targets: WPV1 certification 2027, cVDPV2 2029 | **44th Emergency Committee (2026-03-04)** re-set to interrupt WPV1 in **2026**, stop cVDPV2 by **2028**; certification now **undated** | WHO EC 44 |
| ~13 WPV1 cases mid-2025 | **2025 final: 52** (Afg 21 / Pak 31). **2026 YTD: 14** (Afg 11 / Pak 3) — burden has inverted, Afghanistan now leads | GPEI Polio This Week, 2026-07-15 |
| DMEPOS competitive bidding in indefinite gap | Gap real, but **Round 2028 announced** in the CY2026 final rule — bidding late 2026, program start **2028-01-01** | CMS CY2026 final rule |
| 75/25 blended rate fight ongoing (H.R. 5555 / S. 1294) | **Rate EXPIRED**, reverted 2024-01-01, not reinstated | CMS |

### ⚠️ Single-source — attribute in text, never assert

| Claim | Why |
|---|---|
| "There are no invalids in the USSR!" | Every chain ends at Fefelov's 1986 émigré memoir. **No named official, no contemporaneous record.** Retellings disagree on whether the official was asked about hosting or attending. Correct dating is **1980**. Cite Fefelov as disabled-authored origin, Phillips (2009) as scholarly vector. |
| ~~Soviet 1968 ban on integrated employment~~ | **CONTRADICTED as generally stated — do not publish.** See the dedicated row below. |
| Degener "human catastrophe" / Langvad "most challenging exercise" | Both from the **Aug 2017** Geneva examination, not the 2016 publication. Langvad's line traces to a single advocacy press release. |
| South Africa 6-vs-12-month grant differential | One working paper citing one 1992 clinical article. Operative law was **Disability Grants Act 27 of 1968**, so citing Act 36 of 1946 is anachronistic. |

### 🗄️ Resolved: there was no 1968 Soviet ban on integrated employment

Traced to source via a Wayback capture of Phillips (2009). **The claim is an
over-generalization Phillips makes of her own narrower, sourced statement**, and it
should not appear on the wiki in the broad form.

- Phillips's supporting passage is about **residents of *internaty*** (residential
  institutions) losing the right to work outside the institution in 1968, citing
  Anne White (1999:37) — whose evidence is residents' **correspondence**, not a decree.
- She **contradicts the broad reading two sentences later**: by 1988 ~30% of disabled
  people were employed, mostly "group III invalids" in ordinary jobs.
- **No independent corroboration exists.** No Soviet legal instrument, no Russian-language
  legal database, no disability-history scholarship, and no activist history asserts it.
  Claire Shaw's *Deaf in the USSR* (the deepest archival work on Soviet disabled
  employment) has 11 hits on "1968", none about an employment prohibition, and documents
  the opposite trajectory: movement *away from* segregated artels *toward* state industry.
  Rasell/Iarskaia-Smirnova describe employer **hiring quotas**, which a ban would preclude.

**Second pass (full text of Phillips recovered via reader proxy) refines this — separate the two claims:**

- **Narrow claim: SUPPORTED.** White 1999 p. 37 does state internat residents held the
  right to outside work "until 1968" and lost it. White's rationale is *not* Phillips's
  "administrative convenience" gloss but that "social security agencies seemingly found
  it difficult to reconcile the facts that disabled people both worked and received state
  support." **Cite White's mechanism, not Phillips's gloss.** A corresponding legal artifact
  exists: RSFSR Ministry of Social Security Order **N 179 of 31 December 1968** on
  internaty (confirmed via its 1978 successor, Prikaz N 145); the 1978 text provides only
  for work *inside* the institution. The 1968 text itself is not online.
- **Broad claim ("integrated employment was even forbidden"): NOT SUPPORTED.** Phillips's
  own supporting passage covers only internat residents, and she records ~30% of disabled
  people employed by 1988 in the same paragraph. Do not propagate.

Scale figures from Phillips, worth citing: **~220,000 people in over 4,000 artels** by the
late 1950s; VIKO appropriated by industrial ministries **1956–1960** and liquidated; a
statutory **2% employment quota that was not enforced**.

⚠️ **Hallucination caught during this pass.** An intermediate fetch produced a bibliography
entry reading "White, Anne (1999). *The Russian Devolution: An Amnesty Report on Disability...*
London: Amnesty International Publications." **No such title exists.** The real source is
Anne White, *Democratization in Russia under Gorbachev, 1985–91: The Birth of a Voluntary
Sector* (Macmillan/Springer), confirmed by three matching page-level snippets (pp. 35, 37, 45).
A plausible-looking fake citation appeared mid-verification — treat auto-generated
bibliography entries as unverified until the page is fetched.

### Corrections to the briefs' own framing

- **Tuskegee polio center vs. syphilis study** — the brief says "distinct from, but same campus." The syphilis study ran through the **same hospital** (John A. Andrew Memorial). "Same campus" reads as coincidence; it wasn't.
- **US→Nazi influence** — the textual model for the 1933 law was **Harry Laughlin's Model Eugenical Sterilization Law**, which Virginia's 1924 act also copied. Virginia was a sibling, not the parent.
- **T4 "halted 1941"** — children's euthanasia **never stopped**. Say so explicitly.
- **Peru** — 272,028 is the **Health Ministry's** figure for 1996–2001, not LUM's. "Over 7,000" is a **registry count**, not a victim total (Tamayo: only ~10% of 314,967 gave informed consent). **Newer than the brief:** the Inter-American Court ruled against Peru in *Celia Ramos v. Peru*, **March 2026**.
- **Russian institutionalized children** — brief's 400,000–600,000 is **all** children without parental care (611,034, 1997), not disabled children (~30,000, HRW 1998). Off by ~20×.
- **75/25 rural relationship is inverted** in the brief — 75/25 applied to **non-rural** areas; rural areas get a permanent 50/50 blend.
- **Willowbrook** — cite *NYSARC v. Carey*, 393 F. Supp. 715, not *Rockefeller*. Design capacity **~3,000**, not 4,000.
- **US polio survivor counts** — the "1 million / 433,000 NCHS" figure is **not** in the cited article and rests on 1980s–90s surveys. Mortality-adjusted, it overstates the living population by ~2–4×. Use the 1994–95 NHIS with its year plus a present-day range.

> **Standing gotcha:** take polio case counts from **GPEI Polio This Week**, not
> Emergency Committee statements — EC statements freeze counts at meeting date and
> materially undercount Afghanistan (44th EC reported 40 WPV1 for 2025 vs. a final 52).

> **Method warning from this pass:** on the South African claim, web searches
> returned confident confirmations phrased in near-verbatim query language, but
> fetching the cited pages showed the claim wasn't there — the search layer echoed
> the query back. Willowbrook's capacity figure and the Russian institutionalization
> number both appear to have propagated out of Wikipedia into apparent consensus.
> **Fetch the page; don't trust the snippet.**

## Statistics needing attribution (heatmap class #4)

These exist on the wiki and are **load-bearing** but were flagged as unsourced or
mangled. A *real* source likely exists — the fix is **attribute + caveat**, not
delete. Confirm the exact figure against the source before treating as ✅.

| Page area | Claim (as asserted) | Candidate primary source | Status |
|---|---|---|---|
| professionals/ | share of people killed by police who are disabled | Ruderman Family Foundation (2016) | ⬜ verify figure + attribute |
| healthcare/, professionals/ | disability mortality / life-expectancy gap | LeDeR (UK) and/or US equivalents | ⬜ verify figure + attribute |
| housing/ | Housing First outcome statistics | McCauley 2017 / peer-reviewed HF literature | ⬜ verify figure + attribute |

---

## Maintenance

- This ledger is **not published** (`published: false`) and is excluded from the
  link validator and the live build.
- When closing an AUDIT_RESULTS_* item that concerns a load-bearing fact, **add or
  update the row here** rather than leaving the fact only in the dated audit log.
- Pair with: [INCIDENT_RESPONSE.md](INCIDENT_RESPONSE.md) (a wrong row here is a
  SEV1), `translation-source-accuracy-flags.md` (EN↔es sync), and the
  `disability-wiki-accuracy` skill (the verification discipline that fills it).
