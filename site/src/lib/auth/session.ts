// The app's OWN data-access session — the "mint" half of layered sessions
// (BAS invariant #1). After verify.ts proves the OIDC token, a session is created
// here that is short-lived, REVOCABLE (a DB row, not a bare signed JWT), and the
// only credential the write endpoints trust.
//
// SECURITY: the httpOnly cookie holds a high-entropy random token; only its
// SHA-256 hash is persisted (`token_hash`). The raw token exists only in the
// user's cookie, so a leaked DB snapshot can't be replayed. Lookups hash the
// presented token and compare.

export const SESSION_COOKIE = 'dw_session';

// 30 days, then re-auth. Revocation (logout / admin) is immediate regardless.
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** SHA-256 hex of a session/opaque token (WebCrypto — workerd runtime). */
export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Parse a Cookie header into a name→value map. */
export function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    const name = part.slice(0, eq).trim();
    if (name) out[name] = decodeURIComponent(part.slice(eq + 1).trim());
  }
  return out;
}

export interface CookieOptions {
  maxAgeSec?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  path?: string;
}

/** Serialize a Set-Cookie value. Session cookies default to httpOnly+Secure+Lax. */
export function serializeCookie(name: string, value: string, opts: CookieOptions = {}): string {
  const {
    maxAgeSec,
    httpOnly = true,
    secure = true,
    sameSite = 'Lax',
    path = '/',
  } = opts;
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${path}`, `SameSite=${sameSite}`];
  if (httpOnly) parts.push('HttpOnly');
  if (secure) parts.push('Secure');
  if (typeof maxAgeSec === 'number') parts.push(`Max-Age=${Math.floor(maxAgeSec)}`);
  return parts.join('; ');
}

/** A Set-Cookie value that immediately clears the named cookie. */
export function clearCookie(name: string): string {
  return serializeCookie(name, '', { maxAgeSec: 0 });
}
