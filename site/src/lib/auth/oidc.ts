// OIDC Authorization-Code-+-PKCE mechanics for the server-side BFF flow.
//
// Runs ONLY on the server (the /auth/* Pages Functions) — the browser never sees
// a token, so the zero-JS browsing surface is untouched and the identity token
// stays server-side (BAS invariant #1). Uses WebCrypto (workerd runtime); JWT/JWKS
// verification lives in verify.ts (jose) — never hand-rolled.
import { authorizationEndpoint, tokenEndpoint, type OidcConfig } from './config.ts';

// --- base64url over bytes (no Buffer in workerd) -----------------------------
export function base64url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** High-entropy random value, base64url — used for the PKCE verifier, state, and session tokens. */
export function randomToken(bytes = 32): string {
  return base64url(crypto.getRandomValues(new Uint8Array(bytes)));
}

/** PKCE S256 challenge = base64url(SHA-256(verifier)) (RFC 7636). */
export async function pkceChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64url(new Uint8Array(digest));
}

/** Build the Keycloak authorization URL for the login redirect. */
export function buildAuthorizationUrl(
  config: OidcConfig,
  params: { state: string; nonce: string; codeChallenge: string }
): string {
  const u = new URL(authorizationEndpoint(config));
  u.search = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: 'openid',
    state: params.state,
    nonce: params.nonce,
    code_challenge: params.codeChallenge,
    code_challenge_method: 'S256',
  }).toString();
  return u.toString();
}

export interface TokenResponse {
  id_token: string;
  access_token: string;
  token_type: string;
  expires_in?: number;
}

/** Exchange the authorization code for tokens (public client → PKCE, no secret). */
export async function exchangeCode(
  config: OidcConfig,
  code: string,
  codeVerifier: string,
  fetchImpl: typeof fetch = fetch
): Promise<TokenResponse> {
  const res = await fetchImpl(tokenEndpoint(config), {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      code_verifier: codeVerifier,
    }).toString(),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`token exchange failed: ${res.status} ${detail.slice(0, 200)}`);
  }
  const body = (await res.json()) as TokenResponse;
  if (!body.id_token) throw new Error('token response missing id_token');
  return body;
}
