// resolveSub — the write endpoint's authentication check. Reads the httpOnly
// session cookie, hashes it, and looks up the live session's pairwise `sub`.
//
// Fail-closed at every step: not configured → null; no cookie → null; no live
// session → null. Only a valid, unrevoked, unexpired session yields a sub. This
// is what flips contributions.ts from "provisional flag only" to real auth.
import { keycloakConfigured, type OidcEnv } from './config.ts';
import { SESSION_COOKIE, hashToken, parseCookies } from './session.ts';
import { selectSessionStore, type SessionStore } from './session-store.ts';

export interface ResolveEnv extends OidcEnv {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

/**
 * Resolve the authenticated contributor's pairwise sub, or null. `storeFor` and
 * `nowIso` are injectable for testing; production uses the defaults.
 */
export async function resolveSub(
  request: Request,
  env: ResolveEnv,
  storeFor: (e: ResolveEnv) => SessionStore | null = selectSessionStore,
  nowIso: () => string = () => new Date().toISOString()
): Promise<string | null> {
  if (!keycloakConfigured(env)) return null; // real auth off → fail closed
  const store = storeFor(env);
  if (!store) return null;

  const token = parseCookies(request.headers.get('cookie'))[SESSION_COOKIE];
  if (!token) return null;

  const hash = await hashToken(token);
  return store.resolveSub(hash, nowIso());
}
