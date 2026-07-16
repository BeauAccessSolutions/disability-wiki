// Tests for the store layer. Run: node --test src/lib/contribution-store.test.ts
// The Supabase store is exercised with an injected fake fetch — no live DB.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  StubContributionStore,
  SupabaseContributionStore,
  selectStore,
} from './contribution-store.ts';
import type { QueuedSubmission } from './contribution-store.ts';

function sampleItem(): QueuedSubmission {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    contributorId: 'kc-pairwise-sub-9',
    provisional: false,
    submission: { kind: 'suggest_edit', page: '/benefits/us/ssi/', body: 'x'.repeat(20) },
    status: 'queued',
    createdAt: '2026-07-14T00:00:00.000Z',
  };
}

test('SupabaseContributionStore posts a correct PostgREST insert', async () => {
  let captured: { url?: string; init?: RequestInit } = {};
  const fakeFetch = (async (url: string, init: RequestInit) => {
    captured = { url, init };
    return new Response(null, { status: 201 });
  }) as unknown as typeof fetch;

  const store = new SupabaseContributionStore('https://proj.supabase.co/', 'svc-key', fakeFetch);
  const { id } = await store.enqueue(sampleItem());

  assert.equal(id, sampleItem().id);
  // Endpoint: trailing slash on base URL is normalized; hits the table.
  assert.equal(captured.url, 'https://proj.supabase.co/rest/v1/wiki_contributions');
  const h = captured.init!.headers as Record<string, string>;
  assert.equal(h.apikey, 'svc-key');
  assert.equal(h.authorization, 'Bearer svc-key');
  assert.equal(h.prefer, 'return=minimal');
  const body = JSON.parse(captured.init!.body as string);
  assert.equal(body.kind, 'suggest_edit');
  assert.equal(body.contributor_id, 'kc-pairwise-sub-9');
  assert.equal(body.provisional, false);
  assert.deepEqual(body.payload, sampleItem().submission);
});

test('SupabaseContributionStore throws on a non-ok response', async () => {
  const fakeFetch = (async () =>
    new Response('permission denied for table wiki_contributions', { status: 401 })) as unknown as typeof fetch;
  const store = new SupabaseContributionStore('https://proj.supabase.co', 'bad-key', fakeFetch);
  await assert.rejects(() => store.enqueue(sampleItem()), /supabase insert failed: 401/);
});

test('selectStore picks Supabase only when both credentials are present', () => {
  assert.ok(
    selectStore({ SUPABASE_URL: 'https://x.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'k' })
      instanceof SupabaseContributionStore
  );
  assert.ok(selectStore({ SUPABASE_URL: 'https://x.supabase.co' }) instanceof StubContributionStore);
  assert.ok(selectStore({ SUPABASE_SERVICE_ROLE_KEY: 'k' }) instanceof StubContributionStore);
  assert.ok(selectStore({}) instanceof StubContributionStore);
});
