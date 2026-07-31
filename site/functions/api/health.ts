// GET /api/health — is the Functions layer up?
// GET /api/health?deep=1 — did the DECLARED BINDINGS actually resolve at runtime?
//
// WHY THE DEEP FORM EXISTS. Cloudflare does not reject a wrangler config it cannot use —
// it SKIPS it, with one build-log line, and the project keeps running on dashboard
// settings. That happened here: for weeks site/wrangler.jsonc was discarded on every
// build (fixed in #83), and it stayed invisible because the file's vars duplicated the
// dashboard's with identical values. Nothing broke until a binding existed in only one
// source — and then the endpoint that needed it returned 503 to real readers first.
//
// The post-deploy probe (tools/live-config-probe.json) can prove the vars arrived, because
// /api/auth/login's redirect encodes them. It could NOT prove the D1 binding, because
// feedback.ts validates the whole submission BEFORE it checks env.PAGE_FEEDBACK — so every
// request able to reach that check is also one that WRITES A ROW to the live tally when the
// binding is present, and that POST is D1's only consumer. Probing it would have corrupted
// the single signal the endpoint exists to produce.
//
// So this route makes the binding observable instead of making the observer privileged:
// read-only, writes nothing, needs no credential, discloses no data.
//
// WHAT IT DELIBERATELY DOES NOT DO, because privacy.md is a public promise: it stores
// nothing, reads no vote, and returns no count. `SELECT 1 ... LIMIT 1` proves the binding
// resolved AND the table exists without reading a single tally value.

interface D1Result<T = unknown> {
  results?: T[];
}
interface D1PreparedStatement {
  all<T = unknown>(): Promise<D1Result<T>>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

type Env = {
  PAGE_FEEDBACK?: D1Database;
};

/** Distinct states, because they have distinct causes and distinct fixes. */
export type BindingState =
  | 'ok'
  /** env.PAGE_FEEDBACK is undefined — the config was not applied to this deployment. */
  | 'unavailable'
  /** The binding resolved but the query failed — D1 unreachable, or the table is missing. */
  | 'unreachable';

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

/** Exported for the unit test: the whole decision, with no Request involved. */
export async function checkBindings(env: Env): Promise<Record<string, BindingState>> {
  if (!env.PAGE_FEEDBACK) return { PAGE_FEEDBACK: 'unavailable' };
  try {
    // Touches the table so a missing/renamed schema is caught too, but selects a
    // constant rather than any stored value — no tally row is ever read.
    await env.PAGE_FEEDBACK.prepare('SELECT 1 FROM page_feedback LIMIT 1').all();
    return { PAGE_FEEDBACK: 'ok' };
  } catch {
    return { PAGE_FEEDBACK: 'unreachable' };
  }
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json; charset=utf-8', allow: 'GET' },
    });
  }

  // The shallow form stays binding-free ON PURPOSE. It answers "is the Functions layer
  // up?", which is a different question from "did its bindings resolve?" — and it is the
  // exact shape of check that stays green through the outage the deep form exists to
  // catch. Collapsing the two would lose the discriminator.
  if (new URL(request.url).searchParams.get('deep') !== '1') {
    return json({ service: 'disability-wiki', status: 'ok' }, 200);
  }

  const bindings = await checkBindings(env);
  const ok = Object.values(bindings).every((v) => v === 'ok');
  return json({ service: 'disability-wiki', status: ok ? 'ok' : 'degraded', bindings }, ok ? 200 : 503);
}
