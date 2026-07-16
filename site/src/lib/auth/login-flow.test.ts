// The BFF login orchestration, with a mocked Keycloak (fake token endpoint +
// local JWKS). Run: node --test src/lib/auth/login-flow.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPair, SignJWT, exportJWK, createLocalJWKSet } from 'jose';
import { startLogin, completeLogin } from './login-flow.ts';
import { pkceChallenge } from './oidc.ts';
import { hashToken } from './session.ts';
import type { SessionStore } from './session-store.ts';

const config = {
  issuer: 'https://id.example/realms/bas',
  clientId: 'disability-wiki',
  redirectUri: 'https://disabilitywiki.org/auth/callback',
};

async function keycloak() {
  const { publicKey, privateKey } = await generateKeyPair('RS256');
  const jwk = await exportJWK(publicKey);
  jwk.kid = 'k';
  jwk.alg = 'RS256';
  const getKey = createLocalJWKSet({ keys: [jwk] });
  const signId = (nonce: string, sub = 'kc-sub-1') =>
    new SignJWT({ nonce })
      .setProtectedHeader({ alg: 'RS256', kid: 'k' })
      .setIssuer(config.issuer)
      .setAudience(config.clientId)
      .setSubject(sub)
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(privateKey);
  return { getKey, signId };
}

function mockStore() {
  const calls = { upsert: [] as string[], create: [] as Array<{ cid: string; hash: string }> };
  const store: SessionStore & { calls: typeof calls } = {
    calls,
    async resolveSub() {
      return null;
    },
    async upsertContributorBySub(sub: string) {
      calls.upsert.push(sub);
      return { id: `contrib-${sub}` };
    },
    async createSession(cid: string, hash: string) {
      calls.create.push({ cid, hash });
    },
    async revoke() {},
  };
  return store;
}

const okExchange = (idToken: string) => async () => ({
  id_token: idToken,
  access_token: 'a',
  token_type: 'Bearer',
});

test('startLogin builds an auth URL whose challenge matches the verifier', async () => {
  const s = await startLogin(config);
  const url = new URL(s.authUrl);
  assert.equal(url.searchParams.get('state'), s.state);
  assert.equal(url.searchParams.get('nonce'), s.nonce);
  assert.equal(url.searchParams.get('code_challenge'), await pkceChallenge(s.verifier));
});

test('completeLogin (happy path) mints a session and persists its hash under the sub', async () => {
  const { getKey, signId } = await keycloak();
  const store = mockStore();
  const idToken = await signId('nonce-1', 'kc-sub-42');
  const r = await completeLogin({
    code: 'auth-code',
    stateParam: 'st',
    cookieState: 'st',
    cookieNonce: 'nonce-1',
    cookieVerifier: 'verifier',
    config,
    getKey,
    store,
    exchange: okExchange(idToken),
    nowMs: () => 0,
  });
  assert.ok(r.sessionToken.length > 20);
  assert.equal(r.sub, 'kc-sub-42');
  assert.equal(store.calls.upsert[0], 'kc-sub-42');
  // Only the HASH of the token is persisted — never the raw token.
  assert.equal(store.calls.create[0].hash, await hashToken(r.sessionToken));
  assert.notEqual(store.calls.create[0].hash, r.sessionToken);
});

test('completeLogin rejects a state mismatch (CSRF) before doing anything', async () => {
  const { getKey } = await keycloak();
  const store = mockStore();
  await assert.rejects(
    () =>
      completeLogin({
        code: 'c',
        stateParam: 'attacker',
        cookieState: 'real',
        cookieNonce: 'n',
        cookieVerifier: 'v',
        config,
        getKey,
        store,
        exchange: okExchange('unused'),
      }),
    /state mismatch/
  );
  assert.equal(store.calls.create.length, 0);
});

test('completeLogin rejects a missing authorization code', async () => {
  const { getKey } = await keycloak();
  await assert.rejects(
    () =>
      completeLogin({
        code: null,
        stateParam: 's',
        cookieState: 's',
        cookieNonce: 'n',
        cookieVerifier: 'v',
        config,
        getKey,
        store: mockStore(),
        exchange: okExchange('unused'),
      }),
    /missing authorization code/
  );
});

test('completeLogin rejects a missing PKCE verifier cookie', async () => {
  const { getKey } = await keycloak();
  await assert.rejects(
    () =>
      completeLogin({
        code: 'c',
        stateParam: 's',
        cookieState: 's',
        cookieNonce: 'n',
        cookieVerifier: undefined,
        config,
        getKey,
        store: mockStore(),
        exchange: okExchange('unused'),
      }),
    /missing PKCE verifier/
  );
});

test('completeLogin surfaces a token-exchange failure and mints nothing', async () => {
  const { getKey } = await keycloak();
  const store = mockStore();
  await assert.rejects(
    () =>
      completeLogin({
        code: 'c',
        stateParam: 's',
        cookieState: 's',
        cookieNonce: 'n',
        cookieVerifier: 'v',
        config,
        getKey,
        store,
        exchange: async () => {
          throw new Error('token exchange failed: 400');
        },
      }),
    /token exchange failed/
  );
  assert.equal(store.calls.create.length, 0);
});

test('completeLogin rejects a token whose nonce does not match the login attempt', async () => {
  const { getKey, signId } = await keycloak();
  const store = mockStore();
  const idToken = await signId('some-other-nonce'); // not the cookie nonce
  await assert.rejects(
    () =>
      completeLogin({
        code: 'c',
        stateParam: 's',
        cookieState: 's',
        cookieNonce: 'nonce-1',
        cookieVerifier: 'v',
        config,
        getKey,
        store,
        exchange: okExchange(idToken),
      }),
    /nonce/
  );
  assert.equal(store.calls.create.length, 0); // no session on a bad token
});
