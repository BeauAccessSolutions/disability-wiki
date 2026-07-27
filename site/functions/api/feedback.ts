// POST /api/feedback — anonymous per-page helpfulness tally.
//
// WHAT IS STORED: a page path and two integers. That is the whole schema.
//
// WHAT IS DELIBERATELY NOT STORED, and must stay that way — privacy.md makes
// these promises in plain language and they are the reason this endpoint is
// allowed to exist at all:
//   - no IP address (not hashed, not truncated, not "just for rate limiting")
//   - no cookie, no session, no generated identifier
//   - no user agent, no referrer, no timestamp per vote
//   - no free text (that would carry health and safety disclosures on this site)
//
// The consequence is honest and worth stating: these counts cannot be deduplicated
// server-side. One determined person can move a number. That is an acceptable
// trade for a signal whose only job is "which pages should a human go and read
// again" — and the alternative, an identifier, is the thing being avoided.
//
// Storage is Cloudflare D1 (SQLite on the platform already in use) rather than a
// new vendor. If the binding is absent the endpoint says so with a 503 and the
// widget tells the reader their answer did not record — it never shows a
// thank-you for a vote that went nowhere.

interface D1Result<T = unknown> {
  results?: T[];
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run<T = unknown>(): Promise<D1Result<T>>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

type Env = {
  // Bound in the Cloudflare Pages project settings; see docs/deploy-feedback.md.
  PAGE_FEEDBACK?: D1Database;
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

/**
 * A vote may only be recorded against a real content path on this site.
 *
 * The path arrives from the client, so it is untrusted: without this an open
 * endpoint would let anyone write arbitrary rows, and the tally a maintainer
 * reads would be worthless. Same shape as the manifest path rule in OTACore —
 * absolute, no traversal, no scheme, bounded length.
 */
export function isValidPagePath(path: string): boolean {
  if (path.length === 0 || path.length > 256) return false;
  if (!path.startsWith('/')) return false;
  if (path.includes('..') || path.includes('//')) return false;
  // No scheme, no host, no query, no fragment — a bare site path only.
  if (/[:?#\\]/.test(path)) return false;
  return /^[a-zA-Z0-9/_\-.]+$/.test(path);
}

/** Crisis pages carry no widget, so a vote for one is forged or stale. */
export function isCrisisPath(path: string): boolean {
  return /^\/(es\/)?crisis(\/|$)/.test(path);
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json; charset=utf-8', allow: 'POST' },
    });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'expected form encoding' }, 400);
  }

  const page = String(form.get('page') ?? '');
  const helpful = String(form.get('helpful') ?? '');

  if (helpful !== 'yes' && helpful !== 'no') return json({ error: 'bad answer' }, 400);
  if (!isValidPagePath(page)) return json({ error: 'bad page' }, 400);
  if (isCrisisPath(page)) return json({ error: 'not collected for crisis pages' }, 400);

  if (!env.PAGE_FEEDBACK) {
    // Not provisioned. Say so plainly instead of pretending to record — a silent
    // success here would leave a maintainer trusting an empty table.
    return json({ error: 'feedback store not configured' }, 503);
  }

  try {
    await env.PAGE_FEEDBACK.prepare(
      `INSERT INTO page_feedback (page, yes, no)
       VALUES (?1, ?2, ?3)
       ON CONFLICT(page) DO UPDATE SET
         yes = yes + excluded.yes,
         no  = no  + excluded.no`
    )
      .bind(page, helpful === 'yes' ? 1 : 0, helpful === 'no' ? 1 : 0)
      .run();
  } catch {
    return json({ error: 'could not record' }, 500);
  }

  // No-JS path: the browser did a real form POST, so send it back where it came
  // from rather than leaving the reader on a JSON document. `return` is validated
  // exactly like `page` so this can never become an open redirect.
  const back = String(form.get('return') ?? '');
  if (back && isValidPagePath(back)) {
    return new Response(null, {
      status: 303,
      headers: { location: `${back}?feedback=recorded`, 'cache-control': 'no-store' },
    });
  }
  return json({ ok: true }, 200);
}
