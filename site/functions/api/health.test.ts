// The deep health route is the only thing proving the D1 binding resolved in a real
// deployment, so its FAILURE paths matter more than its success path — a health check that
// cannot go red is decoration. Each case below removes something specific and asserts the
// route reports it.
// Run: node --test functions/api/health.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkBindings, onRequest } from './health.ts';

const okDb = { prepare: () => ({ all: async () => ({ results: [] }) }) };
const throwingDb = {
  prepare: () => ({
    all: async () => {
      throw new Error('no such table: page_feedback');
    },
  }),
};

const get = (url: string, env: unknown) =>
  onRequest({ request: new Request(url), env: env as never });

test('binding present and queryable -> ok', async () => {
  assert.deepEqual(await checkBindings({ PAGE_FEEDBACK: okDb } as never), { PAGE_FEEDBACK: 'ok' });
});

test('binding absent -> unavailable (the config was not applied to this deployment)', async () => {
  assert.deepEqual(await checkBindings({} as never), { PAGE_FEEDBACK: 'unavailable' });
});

test('binding present but the query fails -> unreachable, NOT ok', async () => {
  // A renamed or missing table is a different fault from a missing binding, and the two
  // need different fixes — so they must not collapse to the same word.
  assert.deepEqual(await checkBindings({ PAGE_FEEDBACK: throwingDb } as never), {
    PAGE_FEEDBACK: 'unreachable',
  });
});

test('deep form returns 503 when the binding is missing', async () => {
  const res = await get('https://x/api/health?deep=1', {});
  assert.equal(res.status, 503);
  const body = await res.json();
  assert.equal(body.status, 'degraded');
  assert.equal(body.bindings.PAGE_FEEDBACK, 'unavailable');
});

test('deep form returns 200 when the binding resolves', async () => {
  const res = await get('https://x/api/health?deep=1', { PAGE_FEEDBACK: okDb });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).bindings.PAGE_FEEDBACK, 'ok');
});

test('THE POINT: the shallow form stays 200 while the binding is missing', async () => {
  // This is why both forms exist. If this ever starts failing with the binding absent,
  // the shallow check has silently become the deep one and the discriminator is gone —
  // "is the Functions layer up?" and "did its bindings resolve?" stop being separable.
  const res = await get('https://x/api/health', {});
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
  assert.equal(body.bindings, undefined, 'shallow form must not report bindings');
});

test('deep=anything-else is treated as shallow, not as deep', async () => {
  const res = await get('https://x/api/health?deep=true', {});
  assert.equal(res.status, 200);
  assert.equal((await res.json()).bindings, undefined);
});

test('non-GET is 405 with an Allow header, never a silent 404 from asset handling', async () => {
  const res = await onRequest({
    request: new Request('https://x/api/health', { method: 'POST' }),
    env: {} as never,
  });
  assert.equal(res.status, 405);
  assert.equal(res.headers.get('allow'), 'GET');
});

test('health responses are never cached', async () => {
  for (const url of ['https://x/api/health', 'https://x/api/health?deep=1']) {
    const res = await get(url, { PAGE_FEEDBACK: okDb });
    assert.equal(res.headers.get('cache-control'), 'no-store', url);
  }
});
