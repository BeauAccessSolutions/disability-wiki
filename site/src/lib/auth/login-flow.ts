// The BFF login orchestration — the logic behind the /auth/* routes, extracted
// so it's unit-testable with a mocked Keycloak (fake token endpoint + local
// JWKS). The routes (functions/auth/*) are thin wrappers that only do cookies,
// redirects, and env plumbing.
import type { JWTVerifyGetKey } from 'jose';
import { buildAuthorizationUrl, exchangeCode, pkceChallenge, randomToken } from './oidc.ts';
import { verifyIdToken } from './verify.ts';
import { SESSION_TTL_MS, hashToken } from './session.ts';
import type { OidcConfig } from './config.ts';
import type { SessionStore } from './session-store.ts';

// Short-lived cookies that carry the login attempt's CSRF state, replay nonce,
// and PKCE verifier from /auth/login to /auth/callback. Scoped to /auth.
export const OIDC_STATE = 'dw_oidc_state';
export const OIDC_NONCE = 'dw_oidc_nonce';
export const OIDC_VERIFIER = 'dw_oidc_verifier';
export const OIDC_COOKIE_TTL_SEC = 600; // 10 min to complete the round trip

export interface StartedLogin {
  authUrl: string;
  state: string;
  nonce: string;
  verifier: string;
}

/** Begin login: mint the CSRF state, nonce, and PKCE verifier; build the auth URL. */
export async function startLogin(config: OidcConfig): Promise<StartedLogin> {
  const state = randomToken();
  const nonce = randomToken();
  const verifier = randomToken();
  const codeChallenge = await pkceChallenge(verifier);
  const authUrl = buildAuthorizationUrl(config, { state, nonce, codeChallenge });
  return { authUrl, state, nonce, verifier };
}

export interface CompleteLoginArgs {
  code: string | null;
  stateParam: string | null;
  cookieState?: string;
  cookieNonce?: string;
  cookieVerifier?: string;
  config: OidcConfig;
  getKey: JWTVerifyGetKey;
  store: SessionStore;
  // Injectable for tests.
  exchange?: typeof exchangeCode;
  nowMs?: () => number;
}

export interface CompletedLogin {
  sessionToken: string; // raw token → set as the httpOnly session cookie
  expiresAtIso: string;
  sub: string;
}

/**
 * Complete login on the callback. Order matters and every step fails closed:
 *   1. code present
 *   2. CSRF: state query param equals the state cookie
 *   3. PKCE verifier + nonce cookies present
 *   4. exchange code → tokens (PKCE, no client secret)
 *   5. verify id_token (sig/iss/aud/exp + our nonce)
 *   6. upsert contributor by pairwise sub, mint + persist a revocable session
 * Throws on any failure; the route turns that into a redirect, never a 500 leak.
 */
export async function completeLogin(args: CompleteLoginArgs): Promise<CompletedLogin> {
  if (!args.code) throw new Error('missing authorization code');
  if (!args.stateParam || !args.cookieState || args.stateParam !== args.cookieState) {
    throw new Error('state mismatch (possible CSRF)');
  }
  if (!args.cookieVerifier || !args.cookieNonce) {
    throw new Error('missing PKCE verifier or nonce cookie');
  }

  const exchange = args.exchange ?? exchangeCode;
  const tokens = await exchange(args.config, args.code, args.cookieVerifier);

  const identity = await verifyIdToken({
    idToken: tokens.id_token,
    getKey: args.getKey,
    issuer: args.config.issuer,
    audience: args.config.clientId,
    nonce: args.cookieNonce,
  });

  const { id: contributorId } = await args.store.upsertContributorBySub(identity.sub);

  const sessionToken = randomToken();
  const tokenHash = await hashToken(sessionToken);
  const nowMs = (args.nowMs ?? (() => Date.now()))();
  const expiresAtIso = new Date(nowMs + SESSION_TTL_MS).toISOString();
  await args.store.createSession(contributorId, tokenHash, expiresAtIso);

  return { sessionToken, expiresAtIso, sub: identity.sub };
}
