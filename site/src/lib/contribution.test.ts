// Unit tests for the pure contribution logic. Run: node --test src/lib/contribution.test.ts
// (Explicit .ts import extension so node's type-stripping resolver finds it —
// see the shared LESSONS.md note on Node ESM + extensionless imports.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateSubmission,
  deriveContributor,
  isWriteAllowed,
} from './contribution.ts';

test('valid suggest_edit passes and normalizes', () => {
  const r = validateSubmission({
    kind: 'suggest_edit',
    page: '/benefits/us/ssi/',
    section: '  Eligibility  ',
    body: 'The 2025 SSI federal benefit rate figure looks out of date.',
  });
  assert.equal(r.ok, true);
  assert.equal(r.value?.kind, 'suggest_edit');
  assert.equal((r.value as any).section, 'Eligibility'); // trimmed
});

test('suggest_edit rejects a non-internal or malformed page path', () => {
  for (const page of ['https://evil.test/x', '/../secret', 'benefits/ssi', '']) {
    const r = validateSubmission({ kind: 'suggest_edit', page, body: 'x'.repeat(20) });
    assert.equal(r.ok, false, `expected reject for page=${JSON.stringify(page)}`);
  }
});

test('valid propose_page passes with an allowed category', () => {
  const r = validateSubmission({
    kind: 'propose_page',
    title: 'Autistic burnout',
    category: 'Health', // case-insensitive
    body: 'A page covering recognition, pacing, and recovery for autistic burnout.',
  });
  assert.equal(r.ok, true);
  assert.equal((r.value as any).category, 'health');
});

test('propose_page rejects an unknown category', () => {
  const r = validateSubmission({
    kind: 'propose_page',
    title: 'X',
    category: 'nonsense',
    body: 'x'.repeat(20),
  });
  assert.equal(r.ok, false);
});

test('rejects an unknown kind', () => {
  assert.equal(validateSubmission({ kind: 'delete_everything', body: 'x'.repeat(20) }).ok, false);
});

test('rejects a too-short body', () => {
  const r = validateSubmission({ kind: 'suggest_edit', page: '/rights/', body: 'short' });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes('at least')));
});

test('never trusts client-supplied identity: contributor comes from sub only', () => {
  const authed = deriveContributor('kc-pairwise-sub-123');
  assert.deepEqual(authed, { contributorId: 'kc-pairwise-sub-123', provisional: false });
  const anon = deriveContributor(null);
  assert.equal(anon.provisional, true);
});

test('write gate fails closed: provisional refused unless flag is set', () => {
  const anon = deriveContributor(null);
  assert.equal(isWriteAllowed(anon, {}), false); // prod: no flag → refused
  assert.equal(isWriteAllowed(anon, { ALLOW_PROVISIONAL_CONTRIBUTIONS: 'true' }), true); // local/preview
  assert.equal(isWriteAllowed(anon, { ALLOW_PROVISIONAL_CONTRIBUTIONS: 'false' }), false);
});

test('write gate always allows an authenticated contributor', () => {
  const authed = deriveContributor('sub-abc');
  assert.equal(isWriteAllowed(authed, {}), true);
});
