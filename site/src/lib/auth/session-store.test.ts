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

test('upsertContributorBySub upserts on the unique sub and returns the id', async () => {
  let captured: { url?: string; init?: RequestInit } = {};
  const fakeFetch = (async (url: string, init: RequestInit) => {
    captured = { url, init };
    return new Response(JSON.stringify([{ id: 'contrib-1' }]), { status: 201 });
  }) as unknown as typeof fetch;
  const store = new SupabaseSessionStore('https://p.supabase.co', 'svc', fakeFetch);
  const { id } = await store.upsertContributorBySub('kc-sub-9');
  assert.equal(id, 'contrib-1');
  const u = new URL(captured.url!);
  assert.equal(u.pathname, '/rest/v1/contributors');
  assert.equal(u.searchParams.get('on_conflict'), 'sub');
  const h = captured.init!.headers as Record<string, string>;
  assert.match(h.prefer, /merge-duplicates/);
  assert.equal(JSON.parse(captured.init!.body as string).sub, 'kc-sub-9');
});

test('createSession stores only the token hash + expiry', async () => {
  let body: any;
  const fakeFetch = (async (_url: string, init: RequestInit) => {
    body = JSON.parse(init.body as string);
    return new Response(null, { status: 201 });
  }) as unknown as typeof fetch;
  const store = new SupabaseSessionStore('https://p.supabase.co', 'svc', fakeFetch);
  await store.createSession('contrib-1', 'abc123hash', '2026-08-01T00:00:00.000Z');
  assert.equal(body.contributor_id, 'contrib-1');
  assert.equal(body.token_hash, 'abc123hash');
  assert.equal(body.expires_at, '2026-08-01T00:00:00.000Z');
});

test('revoke PATCHes the live session by hash', async () => {
  let captured: { url?: string; init?: RequestInit } = {};
  const fakeFetch = (async (url: string, init: RequestInit) => {
    captured = { url, init };
    return new Response(null, { status: 204 });
  }) as unknown as typeof fetch;
  const store = new SupabaseSessionStore('https://p.supabase.co', 'svc', fakeFetch);
  await store.revoke('deadbeef', '2026-07-14T00:00:00.000Z');
  assert.equal(captured.init!.method, 'PATCH');
  const u = new URL(captured.url!);
  assert.equal(u.searchParams.get('token_hash'), 'eq.deadbeef');
  assert.equal(u.searchParams.get('revoked_at'), 'is.null'); // only revoke live sessions
  assert.equal(JSON.parse(captured.init!.body as string).revoked_at, '2026-07-14T00:00:00.000Z');
});
