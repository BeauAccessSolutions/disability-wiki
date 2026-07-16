// Run: node --test src/lib/auth/oidc.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pkceChallenge, randomToken, base64url, buildAuthorizationUrl } from './oidc.ts';

test('pkceChallenge matches the RFC 7636 Appendix B vector', async () => {
  const verifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';
  assert.equal(await pkceChallenge(verifier), 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM');
});

test('base64url has no padding or url-unsafe chars', () => {
  const s = base64url(new Uint8Array([251, 255, 191, 0, 1, 2]));
  assert.ok(!/[+/=]/.test(s), `unexpected chars in ${s}`);
});

test('randomToken is high-entropy and unique', () => {
  const a = randomToken();
  const b = randomToken();
  assert.notEqual(a, b);
  assert.ok(a.length >= 43); // 32 bytes base64url
});

test('buildAuthorizationUrl carries PKCE + openid params', () => {
  const url = new URL(
    buildAuthorizationUrl(
      { issuer: 'https://id.example/realms/bas', clientId: 'disability-wiki', redirectUri: 'https://disabilitywiki.org/auth/callback' },
      { state: 'st', nonce: 'no', codeChallenge: 'cc' }
    )
  );
  assert.equal(url.pathname, '/realms/bas/protocol/openid-connect/auth');
  assert.equal(url.searchParams.get('response_type'), 'code');
  assert.equal(url.searchParams.get('client_id'), 'disability-wiki');
  assert.equal(url.searchParams.get('code_challenge_method'), 'S256');
  assert.equal(url.searchParams.get('code_challenge'), 'cc');
  assert.equal(url.searchParams.get('scope'), 'openid');
});
