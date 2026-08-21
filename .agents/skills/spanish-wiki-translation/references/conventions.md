# Conventions & Mechanics

How Spanish pages are laid out and wired into Wiki.js. These are not stylistic
preferences — getting them wrong breaks the live site's navigation.

## File paths: `es/` prefix, English stays at root

Wiki.js Git storage prefixes a page file with its locale code **only for
non-default locales**. English is the default locale and lives at the repo root
with no prefix. So:

| English source | Spanish output |
|---|---|
| `home.md` | `es/home.md` |
| `benefits/us/ssi.md` | `es/benefits/us/ssi.md` |
| `rights/us/ada.md` | `es/rights/us/ada.md` |

The relative path **stays identical** — only the `es/` prefix is added. Never
create an `en/` folder; that would move English out of the default locale.

## Slugs stay in English — do NOT translate path segments

The output path is `es/benefits/us/ssi.md`, NOT `es/prestaciones/eeuu/ssi.md`.

Why: Wiki.js's built-in language switcher (the EN↔ES toggle readers use) finds
the equivalent page by keeping the path identical and swapping only the locale
prefix. If the Spanish slug differs, the switcher points at a path that doesn't
exist and the reader gets "page not found." Translating slugs also forces a
slug-map for every internal link and makes parity tracking painful. The only
upside is prettier URLs — not worth it. Readers see the translated **title** in
nav, search, and browser tabs anyway; the slug is the least-visible part.

## Link rewriting

Rewrite **internal absolute links** by inserting `/es` at the front:
`](/foo/bar)` → `](/es/foo/bar)`. This keeps Spanish readers inside the Spanish
site.

Do **not** rewrite:
- External links — anything starting `http://`, `https://`, `mailto:`.
- In-page anchors — links starting with `#`.
- Shared assets — image/file links ending in `.png`, `.svg`, `.jpg`, `.jpeg`,
  `.gif`, `.pdf`, etc. These assets live once at the repo root and are shared
  across locales (e.g. `![flag](/visually_safe_disability_pride_flag.svg.png)`
  stays exactly as-is).
- Bare-domain text that isn't a markdown link — e.g. plain `eeoc.gov` or
  `1-800-...` in running text. Leave phone numbers and URLs untouched.

After translating, the validator script checks that no internal markdown link was
left un-prefixed.

## Frontmatter

Translate only `title` and `description`. Keep everything else byte-for-byte:
`published`, `date`, `dateCreated`, `editor`, `tags`. The dates reflect the
original page history; don't invent new ones.

```
---
title: <translated>
description: <translated>
published: true
date: <unchanged>
tags: <unchanged>
editor: markdown
dateCreated: <unchanged>
---
```

The footer line `*Last updated: January 2026*` becomes
`*Última actualización: enero de 2026*` (Spanish months are lowercase).

## Accuracy vs. translation are two different jobs

- **Translation quality**: making the Spanish fluent and correct. The glossary
  handles the recurring cases.
- **Source accuracy**: whether the underlying English claim is *true*.

Translation will faithfully carry English errors into Spanish. So a content
accuracy review is its own workstream, most important on **benefits, rights,
crisis, and healthcare** pages where a wrong claim could mislead someone's real
decisions.

**Policy: flag, never edit English.** This skill translates the Spanish to match
the English source exactly, and **must not modify any English source file**. When
you spot a likely error, report it to the user in your summary so they can fix the
English through their own review process — do not "correct" it in the Spanish
either, since that would desync the two languages. Translate what's there; flag
what's wrong.
