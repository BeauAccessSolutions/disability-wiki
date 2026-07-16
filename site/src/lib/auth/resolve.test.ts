// resolveSub fail-closed behavior — the gate that authenticates a contribution.
// Run: node --test src/lib/auth/resolve.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveSub, type ResolveEnv } from './resolve.ts';
import { SESSION_COOKIE } from './session.ts';
import type { SessionStore } from './session-store.ts';

const CONFIGURED: ResolveEnv = {
  KEYCLOAK_ISSUER: 'https://id.example/realms/bas',
  KEYCLOAK_CLIENT_ID: 'disability-wiki',
  KEYCLOAK_REDIRECT_URI: 'https://disabilitywiki.org/auth/callback',
  SUPABASE_URL: 'https://p.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'svc',
};

function reqWithCookie(cookie?: string): Request {
  return new Request('https://disabilitywiki.org/api/contributions', {
    method: 'POST',
    headers: cookie ? { cookie } : {},
  });
}

const storeReturning = (sub: string | null): (() => SessionStore) => () => ({
  async resolveSub() {
    return sub;
  },
});

test('null when Keycloak is not configured (fail-closed default)', async () => {
  const sub = await resolveSub(reqWithCookie(`${SESSION_COOKIE}=tok`), {}, storeReturning('should-not-be-used'));
  assert.equal(sub, null);
});

test('null when configured but there is no session cookie', async () => {
  const sub = await resolveSub(reqWithCookie(), CONFIGURED, storeReturning('x'));
  assert.equal(sub, null);
});

test('null when the cookie maps to no live session', async () => {
  const sub = await resolveSub(reqWithCookie(`${SESSION_COOKIE}=tok`), CONFIGURED, storeReturning(null));
  assert.equal(sub, null);
});

test('returns the sub for a valid live session', async () => {
  const sub = await resolveSub(
    reqWithCookie(`${SESSION_COOKIE}=tok`),
    CONFIGURED,
    storeReturning('kc-sub-42'),
    () => '2026-07-14T00:00:00.000Z'
  );
  assert.equal(sub, 'kc-sub-42');
});

test('null when configured but no session store (missing Supabase creds)', async () => {
  const noSupabase: ResolveEnv = {
    KEYCLOAK_ISSUER: CONFIGURED.KEYCLOAK_ISSUER,
    KEYCLOAK_CLIENT_ID: CONFIGURED.KEYCLOAK_CLIENT_ID,
    KEYCLOAK_REDIRECT_URI: CONFIGURED.KEYCLOAK_REDIRECT_URI,
  };
  const sub = await resolveSub(reqWithCookie(`${SESSION_COOKIE}=tok`), noSupabase, () => null);
  assert.equal(sub, null);
});
