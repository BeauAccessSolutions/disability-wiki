// Session persistence — the revocable-session half of layered sessions
// (BAS invariant #1), on the same Supabase project as the contribution queue.
// Dependency-free PostgREST via fetch (bundles in workerd), service-role key.
//
// This module holds the READ path (resolveSub) the write endpoint needs today.
// The write path (createSession / revoke) lands with the /auth/* routes, which
// require a registered Keycloak client to integration-test end-to-end.

export interface SessionStore {
  /**
   * Given a presented session token's SHA-256 hash, return the contributor's
   * pairwise `sub` iff the session exists, is unrevoked, and unexpired. Else null.
   */
  resolveSub(tokenHash: string, nowIso: string): Promise<string | null>;
}

interface SessionEnv {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

export class SupabaseSessionStore implements SessionStore {
  private readonly url: string;
  private readonly serviceRoleKey: string;
  private readonly fetchImpl: typeof fetch;

  constructor(url: string, serviceRoleKey: string, fetchImpl: typeof fetch = fetch) {
    this.url = url.replace(/\/+$/, '');
    this.serviceRoleKey = serviceRoleKey;
    this.fetchImpl = fetchImpl;
  }

  async resolveSub(tokenHash: string, nowIso: string): Promise<string | null> {
    // Embed contributors(sub) via the FK; filter to a live session server-side so
    // an expired/revoked row can never authenticate.
    const q = new URLSearchParams({
      select: 'contributors(sub)',
      token_hash: `eq.${tokenHash}`,
      revoked_at: 'is.null',
      expires_at: `gt.${nowIso}`,
      limit: '1',
    });
    const res = await this.fetchImpl(`${this.url}/rest/v1/contributor_sessions?${q}`, {
      headers: {
        apikey: this.serviceRoleKey,
        authorization: `Bearer ${this.serviceRoleKey}`,
        accept: 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error(`session lookup failed: ${res.status}`);
    }
    const rows = (await res.json()) as Array<{ contributors: { sub: string | null } | null }>;
    const sub = rows[0]?.contributors?.sub;
    return sub ?? null;
  }
}

/** Sessions live in Supabase; return a store only when its credentials are present. */
export function selectSessionStore(env: SessionEnv): SessionStore | null {
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    return new SupabaseSessionStore(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  }
  return null;
}
