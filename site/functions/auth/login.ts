// GET /auth/login — start the BFF login. Redirects to Keycloak, stashing the
// CSRF state, replay nonce, and PKCE verifier in short-lived httpOnly cookies
// (scoped to /auth) that the callback reads back. Zero-JS: sign-in is a link.
import { keycloakConfigured, oidcConfig, type OidcEnv } from '../../src/lib/auth/config';
import { serializeCookie } from '../../src/lib/auth/session';
import { startLogin, OIDC_STATE, OIDC_NONCE, OIDC_VERIFIER, OIDC_COOKIE_TTL_SEC } from '../../src/lib/auth/login-flow';

export async function onRequestGet(context: { env: OidcEnv }): Promise<Response> {
  if (!keycloakConfigured(context.env)) {
    return new Response('sign-in is not configured', { status: 404 });
  }
  const config = oidcConfig(context.env);
  const { authUrl, state, nonce, verifier } = await startLogin(config);

  const opts = { maxAgeSec: OIDC_COOKIE_TTL_SEC, path: '/auth', sameSite: 'Lax' as const };
  const headers = new Headers({ location: authUrl, 'cache-control': 'no-store' });
  headers.append('set-cookie', serializeCookie(OIDC_STATE, state, opts));
  headers.append('set-cookie', serializeCookie(OIDC_NONCE, nonce, opts));
  headers.append('set-cookie', serializeCookie(OIDC_VERIFIER, verifier, opts));
  return new Response(null, { status: 302, headers });
}
