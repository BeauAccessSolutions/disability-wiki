---
title: Broken Internal Links — Triage Backlog
description: Remaining broken internal links after the 2026-06-07 mechanical cleanup. For a future session.
published: false
tags:
editor: markdown
---

# Broken Internal Links — Triage (as of 2026-06-07)

> **✅ RESOLVED 2026-06-07.** All 76 are cleared — repo is at **0 broken internal
> links** (`scripts/validate_wiki_links.py`, 2,335 links). Done via commits
> `203d0cf` (7 repoints + 4 section indexes), `d5772e6` (2 repoints + 4 new
> content pages). es/ kept in parity (`0e00106`, `ba37a08`). The triage below is
> retained as a record of what was done.

Generated from `scripts/validate_wiki_links.py` (now fixed) after this session's
mechanical link cleanup brought the total **179 → 76**. Everything below is a
**genuinely missing page** — the link target does not exist anywhere in the repo.

Re-run anytime: `python3 scripts/validate_wiki_links.py` → writes
`link_validation_report.txt` (gitignored). Only **published: true** English pages
are scanned. `es/` is excluded (it has its own sync workflow).

Each row: **target** · ref-count · **recommended action** · where the links live.

---

## ① Section index pages — RECOMMEND: create a small `index.md`

Every other section has an `index.md` landing page (benefits, crisis, community,
foundations, conditions…). These three don't, so their section links 404.

| Target | Refs | Source files |
|---|---|---|
| `/daily-living/index` (+ `/daily-living`) | 6 | home.md, conditions/{physical-disabilities,index,sensory-disabilities}.md, start/how-to-use.md, sports/adaptive-fitness.md |
| `/education` (+ `/education/index`) | 5 | start/how-to-use.md (2), professionals/educators.md, home.md, conditions/neurodivergence.md |
| `/relationships` (+ `/relationships/index`) | 3 | start/how-to-use.md, history/deaf-history-culture.md, home.md |

> `relationships/` already has 9 content pages (dating-and-relationships,
> boundaries-disclosure, caregiving, …); `education/` has 6; `daily-living/` has
> several. An index that links them is the natural fix.

## ② High-traffic missing pages — RECOMMEND: create (high payoff)

| Target | Refs | Note |
|---|---|---|
| `/community/online-communities` | 16 | The **directory exists** (`discord.md`, `facebook.md`, `reddit.md`) but has no `index.md`. Create a landing page listing the three. Linked from community/index.md (3) + many condition/foundation pages. |
| `/community/disability-specific-peer-groups` | 15 | No file anywhere. Real topic; create, **or** repoint the 9 refs in community/index.md to `/community/index`. |
| `/foundations/language-terminology-identity` | 12 | No file. Near-neighbor `foundations/disability-identity.md` exists — either **create** the page or **repoint** to disability-identity. Linked from home.md + foundations/* + media pages. Use the `disability-wiki-page` skill (house voice + sourcing). |

## ③ Individual missing pages — create OR repoint (low ref-count)

| Target | Refs | Suggested action | Source files |
|---|---|---|---|
| `/healthcare/understanding-medical-bias` | 3 | create, or repoint → `/healthcare/medical-gaslighting` (the linking page itself) / `/healthcare/weight-bias` | healthcare/medical-gaslighting.md (3) |
| `/relationships/dating-disclosure` | 3 | **repoint** → `/relationships/dating-and-relationships` or `/relationships/boundaries-disclosure` (both exist) | relationships/boundaries-disclosure.md (2), foundations/handling-intrusive-questions.md |
| `/foundations/epistemic-injustice` | 2 | create (substantive topic) | healthcare/systemic-trauma.md, healthcare/weight-bias.md |
| `/foundations/welcome` | 2 | **repoint** → `/foundations/how-to-use-this-wiki` or `/home` | start/how-to-use.md, foundations/index.md |
| `/history/accommodations-history` | 2 | **repoint** → `/history/accommodations` (exists) | history/pre-industrial.md (2) |
| `/tech/real-world-accessibility` | 2 | create, or repoint to a tech/ page | tech/screen-reader-comparison.md, tech/browsers-assistive-tech.md |
| `/history/pre-industrial-disability` | 1 | **repoint** → `/history/pre-industrial` (exists) | history/accommodations.md |
| `/daily-living/mobility-aid-stigma` | 1 | create or remove | foundations/handling-intrusive-questions.md |
| `/rights/understanding-your-rights` | 1 | **repoint** → `/rights/index` | benefits/proving-disability.md |
| `/about/accessibility` | 1 | **repoint** → `/accessibility-statement` (exists at root) | start/how-to-use.md |
| `/about` | 1 | **repoint** → `/home` or `/start` | start/how-to-use.md |

---

## Suggested order for the next session

1. **Repoints first** (zero new content, ~10 links): `history/accommodations-history`→`accommodations`, `history/pre-industrial-disability`→`pre-industrial`, `about/accessibility`→`accessibility-statement`, `rights/understanding-your-rights`→`rights/index`, `relationships/dating-disclosure`→`dating-and-relationships`, `foundations/welcome`→`how-to-use-this-wiki`, `about`→`home`.
2. **Create section indexes** (3 small pages): education, daily-living, relationships.
3. **Create `community/online-communities/index.md`** (lists the 3 existing sub-pages).
4. **Decide create-vs-repoint** for the two big topic pages (`disability-specific-peer-groups`, `language-terminology-identity`) and the remaining ③ items — these need the `disability-wiki-page` skill.

After each batch, re-run the validator to confirm the count drops.
