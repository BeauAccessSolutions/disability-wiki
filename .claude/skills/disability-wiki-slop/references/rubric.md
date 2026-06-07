# Slop Rubric — full lists

Detailed tables for the stylistic tier. The factual tier lives in SKILL.md (it's
judgment, not a word list). Severity: **High** = strong AI signal; **Medium** =
common AI but has legit uses; **Low** = overused, often fine. Flag High + Medium
individually; batch Low as a count.

> **The word lists below are a fading signal.** AI-authorship classifiers
> (Pangram, GPTZero, etc.) don't match words at all — they learn a statistical
> fingerprint — precisely because newer models stopped emitting "delve"/"tapestry".
> So treat the marker tables as *presence-only* evidence: a hit is mild
> corroboration, but a clean scan proves nothing. The **Structures** section is
> the more durable stylistic tell; weight it above the word tables. And none of
> Tier 2 outranks the Tier-1 fabrication check in SKILL.md.

## Marker words

| Word | Severity | Note |
|------|----------|------|
| delve | High | "examine", "look at" |
| realm | High | "area", "world" |
| tapestry | High | almost always slop |
| synergy | High | drop |
| leverage (as **verb**) | Medium | "use". The **noun** (financial leverage) is fine |
| utilize | Medium | "use" |
| seamless / seamlessly | Medium | rarely true; drop |
| robust | Medium | fine in stats ("robust to…"); flag rhetorical use |
| paradigm | Medium | "model", "approach" |
| landscape (**metaphorical**) | Medium | "the benefits landscape" → "the benefits system". Literal landscape is fine |
| comprehensive | Low | often legit on a resource hub — judge |
| cutting-edge | Low | |
| holistic | Low | legit in care contexts ("holistic care") |
| navigate (**metaphorical filler**) | Low | "navigating the system" is legit domain usage — do NOT flag |

## Phrases

**Throat-clearing (delete):**
- "It's important to note that…" / "It's worth noting…"
- "In today's [X] landscape / world…"
- "Let's dive/delve into…"
- "Without further ado…"

**Empty hedges (cut or make concrete):**
- "At the end of the day…"
- "When it comes to…"
- "In terms of…"

**AI enthusiasm (kill — clashes with the wiki's plain, trustworthy register):**
- "This is a game-changer"
- "…and that's a good thing!"
- "Here's the thing:"

## Structures — the durable tell (weight above the word tables)

These outlast vocabulary scrubbing, so they're where newer slop actually shows:

- **"Not just X — it's Y"** construction.
- **Rule-of-three synonym stacks:** "comprehensive, robust, and holistic".
- **Symmetric over-hedging:** "on one hand… on the other…", every claim balanced
  into non-commitment. Reads thorough; says nothing.
- **Uniform cadence:** every paragraph the same length, every section the same
  shape (intro sentence → bulleted trio → wrap-up). Human writing varies.
- **Generically comprehensive filler:** a tidy passage that names categories but
  carries no specific, sourced, or locally-true detail. On this wiki that often
  overlaps Tier 1 (unsourced specifics) — route the factual part accordingly.
- **Em-dash overuse** as a rhythm crutch (several per paragraph).
- **Sentence-starter filler:** "So,", "Now,", "Basically,", "Essentially,"
  (when not literally about sequence/time).
- **Heading case — note the locale split.** The **English** pages use **Title
  Case** headings as house style (`## Mental Health Crisis`) — do **NOT** flag
  these. The **Spanish** (`es/`) pages use **sentence case**; a Title Case heading
  in an `es/` page IS a defect, but that's the `spanish-wiki-translation` skill's
  job, not this one. Net: this skill does not flag heading case on English pages.

## Disability-domain false positives — do NOT flag

This is a disability-rights / benefits / accessibility wiki. These are correct,
load-bearing vocabulary, not slop:

- **accessibility, accessible, access** — core domain term.
- **comprehensive** when describing genuine resource coverage ("a comprehensive
  list of state agencies").
- **navigate / navigating** the system, benefits, bureaucracy — established
  disability-community framing for dealing with complex systems.
- **accommodation, reasonable accommodation, undue hardship/burden, readily
  achievable** — legal terms of art; never "simplify" them away.
- **person-first / identity-first** language, **self-advocacy, lived experience,
  mutual aid, disability justice, neurodivergence** — house vocabulary.
- **holistic** in a care/support sense.

## Notes carried from the public-ledger ai-slop-detector

The sibling tool in `public-ledger/.claude/commands/ai-slop-detector.md` is the
origin of the stylistic list. Differences here:
- This wiki adds a **factual tier** (the priority) and a **voice tier** — the
  public-ledger version is stylistic only.
- Domain false-positives differ (theirs suppresses financial terms like
  "leverage as noun", "robust standard errors"; ours suppresses accessibility/
  benefits vocabulary).
- Same non-blocking philosophy: **warn, don't auto-rewrite.** The human (or a
  routed skill) decides.
