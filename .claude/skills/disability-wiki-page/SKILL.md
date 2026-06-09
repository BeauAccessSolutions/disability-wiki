---
name: disability-wiki-page
description: >-
  Write or substantially rewrite a content page for the disability-wiki
  (disabilitywiki.org) in the project's house voice and structure. Use whenever
  the user wants to create a new page, fill a stub, or rewrite a page's body —
  e.g. "write a page on autistic burnout", "fill the pacing/PEM stub", "draft a
  page about X for the wiki". Covers the voice ("lead with agency, harm as
  context"), structure, frontmatter, sourcing/hedging rules, vetted-orgs, the
  Contribute footer, and pre-publish link verification. Pair with
  disability-wiki-edit to publish.
---

# Disability-Wiki Page Authoring (House Style)

How to write a page that fits disabilitywiki.org. The wiki is disability-justice
centered, plain-language, and lived-experience-respecting.

## The core voice rule: people, not just harm

**Lead with agency, culture, leadership, and joy. Treat structural harm as honest
*context*, not identity.** The throughline is: *people are more than what is done
to them.* This came directly from the maintainer's feedback and is non-negotiable.

- Open a page with what people at this intersection/condition *build, lead, and
  experience as full humans* — then give the hard realities honestly, bounded.
- Don't write a catalog of oppression. Don't do pity or "inspiration" framing.
- End on strength/agency, not on "the system traps you."
- "Most-impacted lead": center the voices of the people the page is about; invite
  them to correct it.

## Structure (typical page)

1. `# Title` + a short, validating intro (1–3 sentences). For heavy topics, a brief
   "if this is hard, skip to X / you're allowed to rest" note.
2. A short **bolded summary / "the short version"** blockquote when useful.
3. Lead section: leadership / culture / agency.
4. Honest-context section(s): the structural realities, hedged and sourced.
5. Practical/recovery/how-to where relevant.
6. **Organizations & resources** — vetted, *live* orgs (see sourcing rules).
7. **Related Pages** — internal links (verify they resolve).
8. **Contribute to This Page** footer (see below).

**No emoji as information.** The project moved off emoji labels (📘/🌍/✦) to
plain-text ones (`*Own voices*` / `*Global South*` / `*Essential*`) — emoji read
poorly on screen readers and need a legend. Use short italic text labels instead;
links are markdown `[text](/path)`, never `[[wikilinks]]` (unsupported — render as
literal text). Headings: English pages use Title Case; only `es/` uses sentence case.

## Frontmatter
```yaml
---
title: Human Title
description: One-sentence meta description (write a real one; don't leave the
  generic "Have lived experience…" placeholder).
published: true
date: 2026-06-07T00:00:00.000Z
tags:
editor: markdown
dateCreated: 2026-06-07T00:00:00.000Z
---
```
Preserve an existing stub's `dateCreated`. Identity-first language ("autistic
person", "disabled people") per community preference.

## Sourcing & accuracy rules (critical — this site gives real-world guidance)

- **Hedge contested or emerging claims.** Mark things that aren't settled (e.g. "not
  a DSM diagnosis", "community-defined", "estimates vary"). Give stats as **sourced
  ranges**, not one cherry-picked number.
- **Date-stamp figures** (dollar amounts, legal compliance dates, shortage status)
  and point to the live official source — they go stale.
- **Attribute interpretation vs. fact.** "Designed to keep people poor" → "can keep
  / is structured to" unless explicitly attributed as advocacy analysis. Legal
  *interpretations* (e.g. calling something a CRPD-article violation) get attributed.
- **No medical/legal/dosing advice.** Name a medication only as "ask your prescriber".
- **Vetted orgs only:** every listed org must be a real, currently-live site —
  verify the URL resolves (200 in a browser; some bot-block, so confirm). Prefer
  org-led / most-impacted-led groups.
- **Life-safety content (crisis numbers, etc.):** verify against the official source
  and never trust a single AI — use the **disability-wiki-accuracy** skill.

## Contribute footer (use the canonical form)
```markdown
## Contribute to This Page

[Topic-specific invitation — especially welcome the most-impacted voices.] See
[How to Contribute](/start/contribute).
```
Link to `/start/contribute` (the canonical community contribute page — leads with
the email contact). The `/glossary/how-to-contribute` page is the separate technical/
Git contribution guide; don't use it as the general "How to Contribute" link, and avoid
`forms.gle` placeholders.

## Before publishing
- **Verify every internal link** resolves to a real page (check the `.md` exists at
  that path, accounting for nested paths like `/benefits/us/ssi` not `/benefits/us-ssi`).
- Keep a reviewer's eye for: stale figures, unsourced stats, blanket claims, broken
  org URLs, accidental medical/legal advice.
- New content that's sensitive (identity, legal, medical) should go via a **branch +
  PR for human review** before merge, not straight to `main`.
- Publish with the **disability-wiki-edit** skill (commit → force-sync).

## Things that already exist (don't recreate)
The wiki has ~285 pages across foundations, conditions, benefits, rights, housing,
employment, education, healthcare, crisis, daily-living, relationships, tech,
transport, sports, media, community, intersectionality, research, professionals,
glossary, get-involved. Check `CONTENT_GAPS_*.md` for the prioritized gap list and
what's already covered before proposing a "new" page.
