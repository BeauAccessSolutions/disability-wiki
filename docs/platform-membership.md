# Platform membership — Disability Wiki in the Beau Access Solutions platform

Disability Wiki is a member app of the **Beau Access Solutions (BAS)** platform. This
file is the local pointer to platform governance and a fallback copy of the platform
invariants, per BAS ADR-002 §3 (reference governance by URL; inline the invariants as a
local fallback; no committed cross-repo symlinks).

## Governance home (canonical, by URL)

Governance repo: <https://github.com/Beaudoin0zach/Beau-Access-Solutions>

- `PLATFORM.md` — shared architecture (standalone Keycloak identity, layered sessions, shared design system).
- `INVARIANTS.md` — the five platform invariants (mirrored below as a fallback).
- `docs/adr/001` — standalone Keycloak identity decision.
- `docs/adr/002` — umbrella org, repo topology, no committed cross-repo symlinks.
- `CONTRIBUTING.md` — how an app joins the platform; the sensitive-data contribution boundary.

Never reference those docs by filesystem path or symlink — always by the URLs above.

## Disability Wiki's role

**Member app, scoped exactly like Access Atlas** — a browsing-first, account-free
public knowledge base where identity gates *contribution*, not reading. Committed
2026-07-14.

- **Browsing stays account-free and 100% static.** The public site is a pre-built Astro
  Starlight bundle on Cloudflare Pages (~540 pages). Reading requires no login, no
  JS-gated content, and no backend — a hard non-negotiable (life-safety crisis pages
  must load fast, offline, and for everyone). The platform does not override this.
- **Identity gates *contribution*, not browsing.** The community-contribution flow
  (pseudonymous suggest-an-edit / propose-a-page → moderation → promotion to markdown;
  see [`contribution-model.md`](contribution-model.md)) authenticates through the
  platform's **Keycloak** IdP rather than hand-rolled auth. Contributions today are
  GitHub PRs; the in-app flow is Phase 2 (deferred — see below).
- **The published site never depends on a database.** Approved contributions are
  *promoted into the markdown source* and ship through the existing merge-to-main →
  Cloudflare Pages build. The contribution datastore (moderation queue) is a *staging*
  surface, never a read dependency of the live site. This deliberately preserves the
  Wiki.js → static migration (the project left a DB-backed editable wiki on purpose).
- **Disability Wiki is a lower-sensitivity tenant than the PHI apps.** It stores no
  health records; the sensitive data it *would* hold is pseudonymous contributor
  identity + unmoderated submissions. It still follows the layered-session rule when
  identity lands: exchange the OIDC token for its own short-lived, revocable session;
  never treat the identity token as a data-access credential.
- **i18n is already owned (invariant #5).** EN + ES with a per-app human-review gate for
  Spanish (the `spanish-wiki-translation` discipline). The platform never injects strings.

## Current status (2026-07-14)

Phase 1 (governance onboarding) only. The platform IdP (**Keycloak**) is now live
(`id.kindredaccess.org/realms/bas`), so the identity wiring is buildable; the
contribution half awaits the hosting / data-controller decision (see below) and the
build itself.

- [x] Governance pointer + invariants fallback (this file).
- [x] Contribution model chosen + specced ([`contribution-model.md`](contribution-model.md)).
- [x] CODEOWNERS guarding future contribution/security paths (invariant #4) — `.github/CODEOWNERS`.
- [x] Contributor-identity **seam** (`site/src/lib/contribution.ts`) — pairwise-`sub` keyed, provisional fallback, fail-closed write gate. Unit-tested.
- [x] Contribution **write endpoint** (`site/functions/api/contributions.ts`, Cloudflare Pages Function) — validates + gates; verified end-to-end via `wrangler pages dev` (202 authed / 401 prod-fail-closed / 422 / 405). Store behind an interface (`contribution-store.ts`) with a no-persistence stub.
- [x] **Moderation store — Supabase** (`site/src/lib/contribution-store.ts` `SupabaseContributionStore` + `supabase/migrations/0001_wiki_contributions.sql`). Code-complete + unit-tested (PostgREST insert via the service-role key; RLS on, public roles revoked, service_role granted — the RLS≠GRANT lesson). Activates when `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set; falls back to the stub otherwise. **Still needs:** a real Supabase project + those secrets + the data-controller sign-off before it stores live data.
- [x] **Keycloak auth core** (`site/src/lib/auth/*`, Phase 3) — server-side **BFF** (mirrors Access Atlas's `auth-bff-decision.md`): OIDC Auth-Code + PKCE (`oidc.ts`), id_token verification via **`jose`** against Keycloak's JWKS (`verify.ts`), and the app's own **revocable session** — httpOnly cookie, only the SHA-256 hash persisted (`session.ts`). `resolve.ts` reads the session → pairwise `sub`, and the write endpoint now calls it (fail-closed: not-configured / no-cookie / no-live-session → refused). Migration `0002_contributor_identity.sql` adds `contributors` + `contributor_sessions` (RLS on, service_role-only). **23 unit tests inc. 6 negative auth cases** (wrong aud/iss, expired, nonce-replay, forged key). Enables when `KEYCLOAK_*` env is set.
- [x] **`/api/auth/login|callback|logout` routes** (`site/functions/api/auth/*`) — the BFF's HTTP endpoints over the tested core. Path matches the other BAS apps' `/api/auth/*` convention (redirect URI: `https://disabilitywiki.org/api/auth/callback`). Login orchestration extracted to `login-flow.ts` (CSRF state → PKCE code exchange → id_token verify → contributor upsert → mint revocable session), unit-tested with a mocked Keycloak (10 tests: happy path + CSRF / missing-code / missing-verifier / exchange-failure / nonce-mismatch). All routes gated behind `keycloakConfigured()` → 404 until `KEYCLOAK_*` is set. Verified via `wrangler pages dev`: configured `/api/auth/login` → 302 to the real Keycloak authorize URL with PKCE `S256` + httpOnly temp cookies; callback with no state cookie → 303 sign-in-required (CSRF fail-closed). **Remaining: a registered Keycloak client** for the live happy-path integration test (real code → token → JWKS → session) — the one step that needs the realm.
- [x] **Contribution UI** — zero-JS suggest-edit / propose-page form (`src/pages/contribute.astro` via `StarlightPage`, native HTML validation, single-sourced category list). Native form POST → endpoint answers with 303 to static outcome pages (`thanks` / `sign-in-required` / `error`). Verified end-to-end in a browser: submit → Thank-you; and fail-closed (no auth) → sign-in-required. Not linked in nav yet (avoids a dead-end for real users until auth is live).
- [ ] Own **CSP / security headers** (invariant #2) — Phase 2 (the static site's headers live in `site/public/_headers`).
- [ ] **Decoupled delete/export** keyed by pairwise `sub` (invariant #3) — the store is already `sub`-keyed across both tables.

## Open decisions & blockers

- **Hosting decided:** the write endpoint runs as a **Cloudflare Pages Function** (keeps
  the wiki on one host), and the moderation store is **Supabase** (matches Access Atlas,
  which runs on DO App Platform + Supabase). Remaining: a real Supabase project + the
  service-role secret, and the **data-controller/legal** sign-off for pseudonymous
  community submissions before anything stores live data.
- **Apple Developer Program** ($99/yr) + a Mac with Xcode — for the native/TestFlight
  track (the Capacitor wrapper spike on `spike/capacitor-native`). Blocks the store path.
  Platform-level mobile/TestFlight guidance now lives in the governance repo's
  `docs/mobile-and-testflight.md`.

## Mapping to the five invariants

| Invariant | Disability Wiki |
|---|---|
| **1. Layered sessions** | Deferred to Phase 3 (no auth today). Seam built so the OIDC token is exchanged for a local session, never used as a data credential. |
| **2. No platform tracking / own CSP** | Static site already telemetry-free; own CSP tightened in Phase 2. |
| **3. Decoupled deletion / export** | Contribution store keyed by pairwise `sub`; independent delete/export endpoints in Phase 3. |
| **4. Contribution boundary** | Contribution backend stays in its own trust boundary with CODEOWNERS + required review; browsing/content stays open to contributors. |
| **5. i18n ownership** | ✅ Already satisfied — per-app EN/ES catalogs + Spanish human-review gate. |
