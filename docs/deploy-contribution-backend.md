# Deploy the contribution backend (Keycloak + Supabase)

How to turn the **code-complete, currently-inert** community-contribution flow into a
live, gated feature. Everything is fail-closed until every value below is set, so you
can do these steps in any order — nothing activates partway.

Design context: [`platform-membership.md`](platform-membership.md),
[`contribution-model.md`](contribution-model.md). The flow mirrors Access Atlas's
server-side BFF (browsing stays account-free; identity gates *contribution* only).

> **Secrets never go in git or in chat.** The service-role key and the Keycloak
> client (if confidential) are high-privilege secrets — put them straight into the
> Cloudflare Pages **encrypted** environment variables. The site build only reads
> them at runtime via `env`.

---

## 1. Supabase project + schema

1. Create (or pick) a Supabase project. Note its **Project URL** — `https://<ref>.supabase.co`.
2. Apply the two migrations (they create the moderation queue + identity tables with
   RLS on, public roles revoked, and explicit `service_role` grants):
   - `site/supabase/migrations/0001_wiki_contributions.sql`
   - `site/supabase/migrations/0002_contributor_identity.sql`

   Either paste them into the Supabase **SQL editor** in order, or:
   ```bash
   # from a machine linked to the project
   supabase link --project-ref <ref>
   supabase db push        # applies site/supabase/migrations in order
   ```
3. Get the **service-role secret** key: Supabase dashboard → Project Settings → API →
   **`service_role`** (new-style `sb_secret_…`, or the legacy `service_role` JWT).
   This is the only key this app uses server-side.

> The **publishable / anon** key (`sb_publishable_…`) is **not** used — the queue and
> session tables revoke all access from `anon`/`authenticated`, so a publishable key
> would get `permission denied`. Server writes go through the Pages Function with the
> service-role key (the function is the trust boundary — the key never reaches a browser).

---

## 2. Register the Keycloak client (on the `bas` realm)

In the platform Keycloak admin (`id.kindredaccess.org` / the `bas` realm):

- **Client ID:** `disability-wiki` (must match `KEYCLOAK_CLIENT_ID` below).
- **Client type:** public, standard flow (Authorization Code) — PKCE `S256`. (BFF; no
  client secret needed. If you make it confidential, this app would need a secret env
  var too — not currently wired.)
- **Valid redirect URI:** `https://disabilitywiki.org/api/auth/callback`
  (and, for a preview deploy, the matching `*.pages.dev/api/auth/callback`).
- **Subject type: pairwise** — so the `sub` is per-app and not correlatable across BAS
  apps (invariant #3), which is what the schema keys contributors on.
- **Web origins:** `https://disabilitywiki.org`.

---

## 3. Cloudflare Pages environment variables

> **Gotcha (this bit us):** because the Pages project has a `wrangler` config file
> (`site/wrangler.jsonc`), Cloudflare **ignores dashboard-set plaintext variables** —
> only encrypted **Secrets** still apply from the dashboard. So the non-secret vars must
> live in `wrangler.jsonc`, *not* the dashboard. (Symptom if you get this wrong:
> `/api/auth/*` 404s after every redeploy because `keycloakConfigured()` never sees the
> vars.)

**Non-secret vars → `site/wrangler.jsonc`** under `"vars"` (this is the source of truth):

```jsonc
"vars": {
  "KEYCLOAK_ISSUER": "https://id.beauaccesssolutions.com/realms/bas",
  "KEYCLOAK_CLIENT_ID": "disability-wiki-web",
  "KEYCLOAK_REDIRECT_URI": "https://disabilitywiki.org/api/auth/callback",
  "SUPABASE_URL": "https://<ref>.supabase.co"
}
```

**The one secret → dashboard Secret** (Cloudflare → Pages → **`disability-wiki`** →
Settings → Variables and secrets → add as an **encrypted Secret**, Production):

| Variable | Value | Where |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | the `service_role` secret (`sb_secret_…`) from step 1 | **dashboard Secret (encrypted)** |

> The issuer is the neutral BAS IdP (`id.beauaccesssolutions.com`); the client is
> registered as `disability-wiki-web`. Switching issuers is safe for contributor
> identity — the pairwise `sub` keys off the redirect host (`disabilitywiki.org`),
> not the issuer.

Do **not** set `ALLOW_PROVISIONAL_CONTRIBUTIONS` in production — that flag is local/preview
only; its absence is what keeps prod fail-closed until real auth is in place.

Redeploy (any push to `main`, or "Retry deployment") so the new config is picked up —
`wrangler.jsonc` vars bind at **build time**, so a fresh deploy is required after editing.

---

## 4. Go-live verification (the live negative-test)

Once all of the above is set, this is the check that couldn't be run without the real
realm — **do it before trusting the flow**:

1. Visit `https://disabilitywiki.org/api/auth/login` → should redirect to the Keycloak
   login, then back to `/contribute/` with a session.
2. Submit the contribution form → should land on `/contribute/thanks/`, and the row
   should appear in Supabase `wiki_contributions` (status `queued`).
3. **Negative test:** with no/forged/expired session cookie, a submit must land on
   `/contribute/sign-in-required/` and write **nothing**. (The unit tests already cover
   forged/expired/nonce-replay/CSRF; this confirms it end-to-end on the real IdP.)
4. `POST /api/auth/logout` → session revoked (`revoked_at` set), cookie cleared.

---

## 5. Last wiring step (code — mine)

After go-live verification passes, link the feature in:

- Add a **"Sign in"** link → `/api/auth/login` and a **sign-out** form POST →
  `/api/auth/logout` on the contribute page.
- Link `/contribute` from the site nav / a footer CTA (it's intentionally unlinked
  until auth works, so no one hits a dead end).
- Then it's a live, gated, community-contributed wiki.

---

## What's where (for reference)

- Endpoint: `site/functions/api/contributions.ts` (write) — fail-closed gate.
- Auth routes: `site/functions/api/auth/{login,callback,logout}.ts`.
- Auth core: `site/src/lib/auth/*` (config, oidc, verify [jose], session, resolve, login-flow).
- Stores: `site/src/lib/contribution-store.ts`, `site/src/lib/auth/session-store.ts`.
- Schema: `site/supabase/migrations/000{1,2}_*.sql`.
- UI: `site/src/pages/contribute.astro` + `contribute/{thanks,sign-in-required,error}.astro`.
