---
title: Crisis page link triage
description: Internal — wikilink-to-markdown conversion follow-ups. Not for publication.
published: false
date: 2026-06-08T20:19:33.935Z
tags: 
editor: markdown
dateCreated: 2026-06-08T20:06:31.520Z
---

# Crisis page link triage (2026-06-08)

The crisis pages used unsupported `[[Title|label]]` wikilink syntax (Wiki.js renders
it as literal text — not links). All 34 crisis pages (17 EN + 17 es) were converted to
standard markdown `[label](/path)` links, es→`/es/` targets. See commit for the batch.

Most targets resolved to existing pages. The targets below had **no existing page**, so
the link was **stripped to plain label text** (no broken `[[...]]` shown to readers) and
parked here for a create/repoint/remove decision.

## Genuinely missing — need a content decision

| Target (EN / es) | Refs | Appears on | Recommendation |
|---|---|---|---|
| **Community Accountability** / Rendición de cuentas comunitaria | 4 EN + 4 es | `crisis/abuse/what-is-it`, `crisis/abuse/abuse-resources` (and es) | Likely a real intended page (transformative-justice / community-accountability response to abuse). **Create** via `disability-wiki-page`, or repoint to `/crisis/abuse-neglect-exploitation` if not writing it. |
| **Disability Rights: South Africa** / …: Sudáfrica | 1 + 1 | `crisis/crisis-hotlines/africa/south-africa` (+ es) | No country rights page exists. **Repoint** to `/rights/international-rights`, or create country rights pages. |
| **Disability Rights: Kenya** / …: Kenia | 1 + 1 | `crisis/crisis-hotlines/africa/kenya` (+ es) | Same as above. |
| **Disability Rights: Australia** / …: Australia | 1 + 1 | `crisis/crisis-hotlines/asian-pacific/australia` (+ es) | Same as above. |
| **Restraining Orders & Protection** / Órdenes de restricción y protección | 1 + 1 | `crisis/abuse/what-is-it` (+ es) | No page. **Repoint** to `/rights/filing-a-disability-complaint` or a legal-protections page, or create. (EN source also had a malformed unclosed `[[` here — fixed in the same commit.) |

## Reasonable repoints already applied (not missing, but worth a sanity check)

These were converted to a best-fit existing page; confirm the intent matches:
- **Disability Justice & Disability Culture** / Justicia… → `/foundations/disability-culture`
- **Specific Disabilities** / Discapacidades específicas → `/community/disability-specific-peer-groups`
- **Peer Support Communities** / Comunidades de apoyo entre pares → `/community`
- **Your Rights & Laws** / Tus derechos y las leyes → `/rights`
- **RAINN** → external `https://www.rainn.org`

## Note for future pages
Never use `[[...]]` on this wiki — it's not supported (not in GFM; open/unrejected Wiki.js
feature request). Use `[label](/path)` with the locale prefix for es (`/es/...`).
See memory `wikijs-ops-gotchas` and the `wiki-link-hygiene` skill.
