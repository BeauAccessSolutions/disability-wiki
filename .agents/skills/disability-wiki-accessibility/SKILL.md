---
name: disability-wiki-accessibility
description: >-
  Audit disability-wiki markdown CONTENT for accessibility defects — image alt
  text, heading hierarchy, descriptive link text, table headers, and
  emoji-as-information. Use when the user wants to "run an accessibility audit /
  a11y check / accessibility sweep", check whether content is screen-reader
  friendly, or review new/edited pages for accessibility before publishing. This
  is a content/markdown-source audit (it's an accessibility wiki — its own pages
  should model access); it is NOT the rendered-site WCAG audit (contrast/ARIA/
  focus order), which needs browser tooling and is mostly the Wiki.js theme.
  Distinct from disability-wiki-slop (fabrication/voice) and wiki-link-hygiene
  (dead links). Trigger on "accessibility audit", "a11y", "alt text", "is this
  screen-reader friendly", "accessible markup" for this repo's content.
---

# Disability-Wiki Accessibility Audit (content level)

This is an accessibility wiki, so its own pages should model access. This skill
checks the **markdown source** for the defects that live in content — the ones a
screen-reader user actually hits. It does **not** check the rendered site
(contrast, ARIA, focus order); that's a separate WCAG audit needing browser
tooling (axe-core/Playwright) and is mostly the Wiki.js theme, not your content.

## How to run

```
python3 scripts/check_accessibility.py                 # all tracked content .md
python3 scripts/check_accessibility.py media/books.md  # specific files/dirs
python3 scripts/check_accessibility.py --summary        # counts only
```

It scans English + `es/` content, skips frontmatter/fenced code/non-content trees,
and prints `file:line — [category] issue → fix`. It **detects and routes** — it
does not auto-fix, because most fixes need content judgement.

## The checks, and how to act on each

- **`image` — alt text.** Empty alt (`![](…)`) or unhelpful alt ("image", "logo",
  the filename). *Fix:* write alt describing what the image *conveys* in context;
  if truly decorative, confirm empty alt is intentional and note it. Needs judgement
  → don't bulk-fix.
- **`heading` — skipped levels.** A jump like `##` → `####`. *Fix:* demote/renumber
  so levels don't skip. (The house convention is body opens with `# Title` then
  `##` sections — a leading H1 is expected and is **not** flagged.)
- **`link-text` — non-descriptive links.** "click here", "here", "read more", or a
  bare URL as the visible text. *Fix:* rewrite so the link text names its
  destination ("see [How to Contribute]"). Mechanical-ish but read context.
- **`table` — missing header row.** A `|`-row table with no `|---|` separator.
  *Fix:* add a header row + separator so cells get column headers.
- **`emoji` — emoji as information.** The project moved off emoji to plain-text
  labels (the books.md/bibliography 📘🌍✦ → `*Own voices*`/etc. conversion).
  **Severity by use:**
  - *Fix (high):* emoji as the **sole** carrier of meaning — a legend key, a
    status marker, a label with no text equivalent. Replace with a text label.
  - *Low / judgement:* an emoji **paired with a bold text label** (`⚠️ **Important
    content:**`, `🚨 **RIGHT NOW:**` on crisis pages). The text already carries the
    meaning; the emoji is emphasis. Leave unless doing a focused de-emoji pass.
  The repo currently has a lot of these (≈1,500 across crisis/section pages) — that
  volume is decorative-paired, so prioritize the sole-signal cases, and don't
  mass-strip ⚠️/🚨 from life-safety pages without the maintainer's say.

## Workflow

1. **Scope** — a page, a section, or a diff (new/edited pages before publish).
   For a diff, run the checker on the changed files.
2. **Triage by category** (above). Separate *mechanical* fixes (heading skips,
   table headers, obvious link text) from *judgement* fixes (alt text, which emoji
   to keep).
3. **Fix in the markdown**, preserving frontmatter and the house voice (see
   **disability-wiki-page**). Don't change facts or links' targets here.
4. **Re-run the checker** to confirm the count dropped.
5. **Publish** with **disability-wiki-edit** (commit → sync → verify via API; the
   sync-import quirk applies, so use `scripts/publish_page.py` if the DB is stale).
6. If you changed an English page, flag/queue its `es/` counterpart
   (**spanish-wiki-translation**).

## False-positive guard
- Typographic arrows (→ ←) are **not** flagged — they're fine.
- The leading `# Title` H1 is the house convention — **not** flagged.
- Don't flag emoji inside fenced code or quoted source text (the checker already
  skips code fences and frontmatter).
- Decorative images legitimately have empty alt — confirm intent rather than
  inventing alt text for a divider.

## Out of scope (future, needs browser tooling)
Rendered-site WCAG: color contrast, ARIA roles, focus order, keyboard nav, the
theme's landmarks. That requires axe-core/Playwright against disabilitywiki.org and
is largely the Wiki.js theme — track separately if the maintainer wants it.
