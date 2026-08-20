---
name: spanish-wiki-translation
description: >-
  Translate disability-wiki English markdown pages into Spanish for the Wiki.js
  multilingual site (disabilitywiki.org). Use this whenever the user wants to
  translate, localize, or create a Spanish version of any wiki page or section —
  e.g. "translate the housing pages to Spanish", "add an es version of
  benefits/us/ssi", "localize the crisis section", or "make a Spanish page for
  X". ALSO covers SYNCING an existing es/ page after its English source changed —
  e.g. "sync the Spanish pages to the audit fixes", "the es/ crisis pages are
  stale", "propagate the English corrections to es/". Handles the es/ file layout,
  /es/ link rewriting, frontmatter, the project's Spanish glossary and style
  rules, the canonical boilerplate blocks, and flags source-accuracy issues.
  Trigger even if the user doesn't say "Wiki.js" or name this skill, as long as
  they're translating or syncing this repo's content to Spanish.
---

# Spanish Wiki Translation

Translate English markdown pages in this repo into Spanish that a Spanish-speaking
person could **safely act on** — this is disability benefits, legal-rights, and
crisis content, so accuracy matters as much as fluency. The site runs Wiki.js in
multilingual mode; Spanish lives as a separate locale alongside English.

## Before you start

Read both reference files — they carry the hard-won rules, and skipping them is
how the same mistakes get repeated across hundreds of pages:

- `references/conventions.md` — file paths, link rewriting, frontmatter, Wiki.js
  locale mechanics, and the accuracy-vs-translation split. **Read this first.**
- `references/glossary.md` — required term translations and Spanish style rules
  drawn from a native-speaker review. **Apply every rule here.**
- `references/canonical-blocks.md` — paste-verbatim Spanish boilerplate (crisis
  "Información importante" + footer blocks). Read before any **sync** task.

## Workflow for one page

1. **Read the English source** at its repo-root path (e.g. `benefits/us/ssi.md`).
2. **Translate** the body into neutral Latin-American Spanish, person-first
   ("personas con discapacidad"), applying `references/glossary.md` throughout.
3. **Translate the frontmatter** `title` and `description` only. Leave `date`,
   `dateCreated`, `editor`, `published`, and `tags` exactly as they are.
4. **Rewrite internal links** `/foo/bar` → `/es/foo/bar`. Do NOT prefix external
   URLs, anchors (`#...`), or shared assets (anything ending `.png/.svg/.jpg/
   .jpeg/.gif/.pdf`). See `references/conventions.md` for the full rule.
5. **Use Spanish sentence case for headings** (capitalize first word + proper
   nouns only), not English title case.
6. **Write the result** to `es/<same relative path>.md` — same path, `es/`
   prefix. English stays at the repo root as the default locale; only Spanish is
   prefixed.
7. **Validate**: run `python3 .Codex/skills/spanish-wiki-translation/scripts/check_translation.py es/<path>.md` (path is relative to the repo root) and resolve any
   warnings.

## Workflow for syncing an already-translated page

When the English source changed *after* the `es/` page was translated (an audit, a
correction, a content edit), do NOT re-translate from scratch — **surgically apply
the same changes** to the existing Spanish page so unrelated prose stays stable.

1. **Get the diff — it is the spec.** The English change is usually a git commit:
   `git show <sha> -- <path>` (or `git log -p -- <path>`). Read exactly what lines
   changed; that delta, translated, is your entire edit set. Don't reprocess
   untouched sections. (`es/` **is** tracked in git, so you can `git log -p` the
   Spanish too — but the English commit is still your spec for *what changed*.)
2. **Map each English hunk to the Spanish page** and Edit it in place — numbers,
   org names, hours, hedged wording. Keep acronyms/org names/phone numbers exactly
   as English (per `glossary.md`).
3. **Use the canonical blocks.** Standardized footers and the crisis
   "Información importante" block have fixed Spanish forms — paste them from
   `references/canonical-blocks.md` rather than re-improvising. This is where the
   old blanket "todos los servicios son gratuitos/confidenciales/24-7" and false
   "verificados a través de fuentes oficiales" lines get replaced.
4. **Check leaf vs. index.** A corrected number on a country/leaf page may also
   appear on an aggregator index page (e.g. `crisis/crisis-hotlines/asian-pacific.md`).
   Before "fixing" an index number, confirm it's actually the same service —
   a similar-looking number can be a *different, valid* line (the Thailand "1300"
   on the index is the Baan Kredtrakarn child-abuse line, not the obsolete
   Samaritans number). Sync the index only where it genuinely mirrors the leaf.
5. **Stay faithful — still flag, never edit English.** If the English diff itself
   looks wrong, apply it faithfully to Spanish and flag the English (see below).
   Don't let a sync become a place where the two locales silently diverge.
6. **Validate** every touched file: `python3 .Codex/skills/spanish-wiki-translation/scripts/check_translation.py es/<path>.md` (path is relative to the repo root).
7. **Record the sync** in `docs/translation-source-accuracy-flags.md` (mark the
   page synced + note the English commit) so the parity state stays auditable.

## Accuracy is a separate pass — flag, never edit English

Translate the Spanish **faithfully to the English source**, even if a claim looks
wrong. Source-accuracy is a separate workstream the maintainer runs on their own;
this skill must **never edit English source files**.

But translation faithfully carries English errors into Spanish, so you're often
the first to notice them. When you spot a likely factual or legal error
(especially on benefits, rights, crisis, or healthcare pages), **flag it to the
user** in your summary — don't silently "correct" it in Spanish either, because
that desyncs the two languages. Translate what the English says; report what you
suspect. The user decides whether and how to fix the English.

(Example caught during the pilot: the ADA page claims punitive damages are
available against government entities under Title II — they are not, and it's
wrong in English too. The right move is to note it, not to quietly diverge.)

## Translating in bulk

For many pages, process them as an independent pipeline rather than one giant
batch — each page is self-contained. If subagents/Workflow are available, fan out
with one agent per page (or per small group), each following this same workflow,
then run the validator across all produced `es/` files at the end. Keep the
glossary and conventions in every agent's instructions so output stays
consistent. Log any pages skipped or where source-accuracy was flagged rather
than silently dropping them.

## What good output looks like

- Reads as if written in Spanish, not translated from English.
- Every internal link points into `/es/...`; no dead cross-locale links.
- Acronyms preserved (ADA, SSDI, SSI, EEOC); org proper names kept in English so
  readers can search/contact them; official law names glossed on first use.
- Headings in sentence case; frontmatter title/description translated.
- **No emoji.** The project dropped emoji labels for plain-text ones; mirror the
  English convention — e.g. own-voices/Global-South markers render as
  `*Voz propia*` / `*Sur Global*` / `*Esencial*`, not 📘/🌍/✦.
- The validator passes clean.

> **Publishing the Spanish:** the same import quirk applies (see
> **disability-wiki-edit**) — after a merge/sync, force-sync often does NOT import
> new or modified `es/` files into the DB. Verify via the API; if the DB is stale,
> push the content in with `pages.create` (new, `locale:"es"`) or `pages.update`
> (modified). Don't use `importAll`.
