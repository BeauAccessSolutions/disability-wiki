// Run: node --test src/lib/auth/session.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashToken, parseCookies, serializeCookie, clearCookie, SESSION_COOKIE } from './session.ts';

test('hashToken is deterministic sha256 hex (64 chars), and differs per input', async () => {
  const a = await hashToken('token-abc');
  const b = await hashToken('token-abc');
  const c = await hashToken('token-xyz');
  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.match(a, /^[0-9a-f]{64}$/);
});

test('parseCookies handles multiple cookies and decoding', () => {
  const c = parseCookies(`${SESSION_COOKIE}=ab%20c; other=1`);
  assert.equal(c[SESSION_COOKIE], 'ab c');
  assert.equal(c.other, '1');
  assert.deepEqual(parseCookies(null), {});
});

test('serializeCookie defaults to httpOnly + Secure + Lax', () => {
  const v = serializeCookie(SESSION_COOKIE, 'tok', { maxAgeSec: 60 });
  assert.match(v, /HttpOnly/);
  assert.match(v, /Secure/);
  assert.match(v, /SameSite=Lax/);
  assert.match(v, /Max-Age=60/);
  assert.match(v, /Path=\//);
});

test('clearCookie expires immediately', () => {
  assert.match(clearCookie(SESSION_COOKIE), /Max-Age=0/);
});
