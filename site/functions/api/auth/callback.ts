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
  // TEMP DIAGNOSTIC: tag the fail-closed redirect with a coarse reason category so a
  // single real login pinpoints which step rejected (no secrets/token contents). Remove
  // once the go-live round-trip is green.
  const failed = (reason: string) => {
    const headers = new Headers({
      location: `/contribute/sign-in-required/?e=${reason}`,
      'cache-control': 'no-store',
    });
    clearTemp(headers);
    return new Response(null, { status: 303, headers });
  };
  if (!store) return failed('no_store');

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
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[auth] callback failed:', msg);
    // TEMP DIAGNOSTIC: map the thrown message to a coarse category.
    let reason = 'other';
    if (msg.includes('state mismatch')) reason = 'state';
    else if (msg.includes('missing authorization code')) reason = 'no_code';
    else if (msg.includes('PKCE verifier or nonce cookie')) reason = 'pkce_cookie';
    else if (msg.includes('token exchange failed')) reason = 'exchange';
    else if (msg.includes('nonce mismatch')) reason = 'nonce';
    else if (msg.includes('missing id_token')) reason = 'no_id_token';
    else if (/aud|iss|signature|claim|jwt|jwk|exp|verif/i.test(msg)) reason = 'verify';
    else if (/supabase|session|contributor|store|insert|http \d/i.test(msg)) reason = 'store';
    // TEMP: for an uncategorized error, surface the (non-secret) message text so one
    // retry pinpoints it. jose/PostgREST error strings carry no token/key material.
    if (reason === 'other') return failed('other&m=' + encodeURIComponent(msg.slice(0, 200)));
    return failed(reason);
  }
}
