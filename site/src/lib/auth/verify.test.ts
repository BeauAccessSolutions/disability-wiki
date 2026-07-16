// The security boundary — RS256 verification with negative cases.
// Run: node --test src/lib/auth/verify.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPair, SignJWT, exportJWK, createLocalJWKSet } from 'jose';
import { verifyIdToken } from './verify.ts';

const ISSUER = 'https://id.example/realms/bas';
const AUDIENCE = 'disability-wiki';
const NONCE = 'nonce-xyz';

// A local key set standing in for Keycloak's JWKS, plus a signer.
async function setup() {
  const { publicKey, privateKey } = await generateKeyPair('RS256');
  const jwk = await exportJWK(publicKey);
  jwk.kid = 'test-key';
  jwk.alg = 'RS256';
  const getKey = createLocalJWKSet({ keys: [jwk] });
  const sign = (claims: Record<string, unknown>, opts: { exp?: string; aud?: string; iss?: string } = {}) =>
    new SignJWT({ nonce: NONCE, ...claims })
      .setProtectedHeader({ alg: 'RS256', kid: 'test-key' })
      .setIssuer(opts.iss ?? ISSUER)
      .setAudience(opts.aud ?? AUDIENCE)
      .setSubject((claims.sub as string) ?? 'kc-pairwise-sub-1')
      .setIssuedAt()
      .setExpirationTime(opts.exp ?? '5m')
      .sign(privateKey);
  return { getKey, sign, privateKey };
}

test('accepts a valid id_token and returns the pairwise sub', async () => {
  const { getKey, sign } = await setup();
  const token = await sign({ sub: 'kc-pairwise-9' });
  const id = await verifyIdToken({ idToken: token, getKey, issuer: ISSUER, audience: AUDIENCE, nonce: NONCE });
  assert.equal(id.sub, 'kc-pairwise-9');
});

test('rejects a wrong audience', async () => {
  const { getKey, sign } = await setup();
  const token = await sign({}, { aud: 'some-other-app' });
  await assert.rejects(() => verifyIdToken({ idToken: token, getKey, issuer: ISSUER, audience: AUDIENCE, nonce: NONCE }));
});

test('rejects a wrong issuer', async () => {
  const { getKey, sign } = await setup();
  const token = await sign({}, { iss: 'https://evil.example/realms/bas' });
  await assert.rejects(() => verifyIdToken({ idToken: token, getKey, issuer: ISSUER, audience: AUDIENCE, nonce: NONCE }));
});

test('rejects an expired token', async () => {
  const { getKey, sign } = await setup();
  const token = await sign({}, { exp: '-1m' }); // already expired
  await assert.rejects(() => verifyIdToken({ idToken: token, getKey, issuer: ISSUER, audience: AUDIENCE, nonce: NONCE }));
});

test('rejects a nonce mismatch (replay of another login)', async () => {
  const { getKey, sign } = await setup();
  const token = await sign({});
  await assert.rejects(
    () => verifyIdToken({ idToken: token, getKey, issuer: ISSUER, audience: AUDIENCE, nonce: 'a-different-nonce' }),
    /nonce/
  );
});

test('rejects a token signed by a different (attacker) key', async () => {
  const { getKey } = await setup();
  const attacker = await generateKeyPair('RS256');
  const forged = await new SignJWT({ nonce: NONCE })
    .setProtectedHeader({ alg: 'RS256', kid: 'test-key' }) // claims our kid, wrong key
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setSubject('attacker')
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(attacker.privateKey);
  await assert.rejects(() => verifyIdToken({ idToken: forged, getKey, issuer: ISSUER, audience: AUDIENCE, nonce: NONCE }));
});
