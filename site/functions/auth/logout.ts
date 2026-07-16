// POST /auth/logout — revoke the current session and clear the cookie. Zero-JS:
// sign-out is a plain form POST. Idempotent and best-effort: even if revocation
// fails, the cookie is cleared so the browser is signed out.
import { keycloakConfigured, type OidcEnv } from '../../src/lib/auth/config';
import { selectSessionStore } from '../../src/lib/auth/session-store';
import { SESSION_COOKIE, clearCookie, hashToken, parseCookies } from '../../src/lib/auth/session';

interface Env extends OidcEnv {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const token = parseCookies(request.headers.get('cookie'))[SESSION_COOKIE];
  const store = keycloakConfigured(env) ? selectSessionStore(env) : null;

  if (store && token) {
    try {
      await store.revoke(await hashToken(token), new Date().toISOString());
    } catch (err) {
      // Best-effort: still clear the cookie below so the browser is signed out.
      console.error('[auth] revoke failed:', err instanceof Error ? err.message : err);
    }
  }

  const headers = new Headers({ location: '/', 'cache-control': 'no-store' });
  headers.append('set-cookie', clearCookie(SESSION_COOKIE));
  return new Response(null, { status: 303, headers });
}
