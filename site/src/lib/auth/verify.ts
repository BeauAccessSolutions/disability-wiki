// ID-token verification against Keycloak's JWKS, using `jose`. NEVER hand-roll
// JWT parsing or signature checking — that's exactly where an auth bug becomes an
// account-takeover bug. `jose` validates the RS256 signature against the published
// keys and enforces the standard claims; it runs on WebCrypto (workerd-compatible).
//
// This is the "validate" half of layered sessions (BAS invariant #1): prove the
// token is a genuine, unexpired token for THIS client, extract the pairwise `sub`,
// and then session.ts mints our own credential. The OIDC token is never stored or
// reused as a data credential.
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';
import { jwksUri, type OidcConfig } from './config.ts';

export interface VerifiedIdentity {
  /** Keycloak pairwise subject id — the stable per-app identity. */
  sub: string;
  /** Authentication Context Class Reference — reserved for step-up (later). */
  acr?: string;
}

/** Remote JWKS resolver for production (jose caches + rotates keys). */
export function remoteJwks(config: OidcConfig): JWTVerifyGetKey {
  return createRemoteJWKSet(new URL(jwksUri(config)));
}

/**
 * Verify an id_token: RS256 signature (via getKey), issuer, audience, expiry
 * (jose enforces `exp`/`nbf`), and the nonce we issued at login (replay defense).
 * Throws on any failure — callers must fail closed. Injectable getKey makes this
 * unit-testable against a locally-generated key set.
 */
export async function verifyIdToken(args: {
  idToken: string;
  getKey: JWTVerifyGetKey;
  issuer: string;
  audience: string;
  nonce: string;
}): Promise<VerifiedIdentity> {
  const { payload } = await jwtVerify(args.idToken, args.getKey, {
    issuer: args.issuer,
    audience: args.audience,
  });

  if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
    throw new Error('id_token has no sub');
  }
  // Nonce binds the token to THIS login attempt — a captured token from another
  // flow won't match. jose does not check nonce; we must.
  if (payload.nonce !== args.nonce) {
    throw new Error('id_token nonce mismatch');
  }

  return {
    sub: payload.sub,
    acr: typeof payload.acr === 'string' ? payload.acr : undefined,
  };
}
