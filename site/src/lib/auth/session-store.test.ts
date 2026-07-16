// Run: node --test src/lib/auth/session-store.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SupabaseSessionStore, selectSessionStore } from './session-store.ts';

test('resolveSub builds a live-session-only PostgREST query and returns the sub', async () => {
  let capturedUrl = '';
  const fakeFetch = (async (url: string) => {
    capturedUrl = url;
    return new Response(JSON.stringify([{ contributors: { sub: 'kc-sub-7' } }]), { status: 200 });
  }) as unknown as typeof fetch;

  const store = new SupabaseSessionStore('https://p.supabase.co/', 'svc', fakeFetch);
  const sub = await store.resolveSub('deadbeef', '2026-07-14T00:00:00.000Z');

  assert.equal(sub, 'kc-sub-7');
  const u = new URL(capturedUrl);
  assert.equal(u.pathname, '/rest/v1/contributor_sessions');
  assert.equal(u.searchParams.get('token_hash'), 'eq.deadbeef');
  assert.equal(u.searchParams.get('revoked_at'), 'is.null'); // revoked sessions excluded
  assert.equal(u.searchParams.get('expires_at'), 'gt.2026-07-14T00:00:00.000Z'); // expired excluded
  assert.equal(u.searchParams.get('select'), 'contributors(sub)');
});

test('resolveSub returns null when no live session matches', async () => {
  const fakeFetch = (async () => new Response('[]', { status: 200 })) as unknown as typeof fetch;
  const store = new SupabaseSessionStore('https://p.supabase.co', 'svc', fakeFetch);
  assert.equal(await store.resolveSub('nomatch', '2026-07-14T00:00:00.000Z'), null);
});

test('resolveSub throws on a store error (caller fails closed)', async () => {
  const fakeFetch = (async () => new Response('nope', { status: 500 })) as unknown as typeof fetch;
  const store = new SupabaseSessionStore('https://p.supabase.co', 'svc', fakeFetch);
  await assert.rejects(() => store.resolveSub('x', '2026-07-14T00:00:00.000Z'), /session lookup failed: 500/);
});

test('selectSessionStore needs both Supabase credentials', () => {
  assert.ok(selectSessionStore({ SUPABASE_URL: 'https://p.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'k' }));
  assert.equal(selectSessionStore({ SUPABASE_URL: 'https://p.supabase.co' }), null);
  assert.equal(selectSessionStore({}), null);
});
