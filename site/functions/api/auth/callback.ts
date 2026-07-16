// GET /api/auth/callback — Keycloak redirects here with ?code&state. Completes the
// flow (validate → verify → mint session), sets the httpOnly session cookie, and
// clears the temp cookies. Any failure → redirect to sign-in-required (never a
// 500 that leaks internals).
import { keycloakConfigured, oidcConfig, type OidcEnv } from '../../../src/lib/auth/config';
import { remoteJwks } from '../../../src/lib/auth/verify';
import { selectSessionStore } from '../../../src/lib/auth/session-store';
import { SESSION_COOKIE, SESSION_TTL_MS, parseCookies, serializeCookie } from '../../../src/lib/auth/session';
import { completeLogin, OIDC_STATE, OIDC_NONCE, OIDC_VERIFIER } from '../../../src/lib/auth/login-flow';

interface Env extends OidcEnv {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

function clearTemp(headers: Headers) {
  for (const name of [OIDC_STATE, OIDC_NONCE, OIDC_VERIFIER]) {
    headers.append('set-cookie', serializeCookie(name, '', { maxAgeSec: 0, path: '/api/auth' }));
  }
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  if (!keycloakConfigured(env)) return new Response('sign-in is not configured', { status: 404 });

  const store = selectSessionStore(env);
  const failed = () => {
    const headers = new Headers({ location: '/contribute/sign-in-required/', 'cache-control': 'no-store' });
    clearTemp(headers);
    return new Response(null, { status: 303, headers });
  };
  if (!store) return failed();

  const config = oidcConfig(env);
  const url = new URL(request.url);
  const cookies = parseCookies(request.headers.get('cookie'));

  try {
    const { sessionToken } = await completeLogin({
      code: url.searchParams.get('code'),
      stateParam: url.searchParams.get('state'),
      cookieState: cookies[OIDC_STATE],
      cookieNonce: cookies[OIDC_NONCE],
      cookieVerifier: cookies[OIDC_VERIFIER],
      config,
      getKey: remoteJwks(config),
      store,
    });

    const headers = new Headers({ location: '/contribute/', 'cache-control': 'no-store' });
    headers.append(
      'set-cookie',
      serializeCookie(SESSION_COOKIE, sessionToken, { maxAgeSec: Math.floor(SESSION_TTL_MS / 1000), path: '/' })
    );
    clearTemp(headers);
    return new Response(null, { status: 303, headers });
  } catch (err) {
    console.error('[auth] callback failed:', err instanceof Error ? err.message : err);
    return failed();
  }
}
