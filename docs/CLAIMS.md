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
