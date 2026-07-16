# Contribution model — Disability Wiki

**Decision (2026-07-14):** community contribution is **suggest-an-edit / propose-a-page
→ moderation queue → promotion into the markdown source.** The published site stays
100% static; the datastore is a *staging* surface, never a live-read dependency.

This is the Access-Atlas-shaped model (account-free browsing; pseudonymous, identity-
gated contribution) applied to a prose wiki instead of a structured directory.

## Why this shape

The project deliberately migrated Wiki.js → static Astro Starlight to shed a DB-backed,
directly-editable wiki and its ops burden. A live dynamic wiki would undo that. Instead:

- **Reading** keeps the current guarantee — pre-built HTML, fast, offline-capable, no
  backend, no JS-gated content, life-safety pages always available.
- **Contributing** gets a narrow authenticated seam: a submission lands in a moderation
  queue, a maintainer reviews it, and on approval it is **promoted into the markdown**
  and ships through the normal merge-to-main → Cloudflare Pages build.

The live site never depends on the contribution database being up. If the contribution
service is down, browsing is unaffected — only *new submissions* pause.

## Flow

```
 contributor (pseudonymous, Keycloak sub)
      │  suggest edit / propose page   (zero-JS semantic form)
      ▼
 write endpoint  ──►  moderation queue (Supabase or equiv.)
   · server-side validation                    │
   · write hard-gate (refuses unless auth'd)   │  maintainer review
   · rate-limited                              ▼
                                        approve → promote to markdown
                                                  · open a PR against content
                                                  · CI (build + link + a11y) runs
                                                  · merge → live in one build cycle
                                          reject → logged, contributor notified
```

## What each contribution is

- **Suggest an edit** — against an existing page: a proposed diff or a plain-language
  "this is wrong / add this" note tied to `page + section`.
- **Propose a page** — a new page draft (title + body + category) for a gap.

Both are *proposals*, not live edits. Promotion is a maintainer action that turns an
approved proposal into a content PR (the existing `disability-wiki-edit` workflow).

## Invariant hooks (built as seams in Phase 1/2, wired in Phase 3)

- **Identity (inv. 1):** the write endpoint requires a validated Keycloak session,
  exchanged for a local short-lived session — never the raw OIDC token as a credential.
  A **provisional pseudonymous id** stands in until the Keycloak wiring lands (the IdP
  itself is already live), behind a hard-gate (`ALLOW_PROVISIONAL_CONTRIBUTIONS=true`,
  local/preview only) so an unauthenticated write path can never ship.
- **Contribution boundary (inv. 4):** the write endpoint, moderation store, and any
  service-role credentials sit behind CODEOWNERS + required review + branch protection.
- **Delete / export (inv. 3):** submissions are keyed by the contributor's **pairwise
  `sub`**, so a contributor's data is independently deletable/exportable and not
  correlatable across BAS apps.
- **Accuracy (project non-negotiable):** promotion runs the same CI gate as any content
  PR (strict link validation, a11y check) **plus** the accuracy discipline — a
  moderator must not promote an unverified crisis number / benefits figure / legal claim
  (see `docs/CLAIMS.md` and the `disability-wiki-accuracy` skill). Moderation is where
  AI-slop and fabrication get caught before publication.

## Open decisions before Phase 2 build

1. **Hosting — decided.** Endpoint = Cloudflare Pages Function; store = **Supabase**
   (matches Access Atlas). Remaining: a real Supabase project + service-role secret, and
   the data-controller/legal sign-off for community submissions.
2. **SSR surface** — the static site has no backend today. The write endpoint needs
   either Cloudflare Pages Functions (stays on Cloudflare) or a small separate service
   (mirrors Access Atlas's Supabase + SSR). Prefer Pages Functions to keep one host.
3. **Moderator UI** — start with the maintainer reviewing the queue directly (even a
   simple admin view) before building anything richer.
