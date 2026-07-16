// POST /api/contributions — Cloudflare Pages Function.
//
// Thin wrapper over the pure logic in src/lib/contribution.ts. Fail-closed:
// refuses unless the contributor is authenticated OR the provisional flag is
// set (local/preview only). The published static site is unaffected by this
// endpoint — it only writes to the moderation queue (staging surface).
//
// Phase 3 wires resolveSub() to Keycloak (validate the OIDC token against JWKS,
// exchange for a local session — BAS invariant #1). Until then it returns null,
// so production (no flag) refuses every write.

import { deriveContributor, isWriteAllowed, validateSubmission } from '../../src/lib/contribution';
import type { RawSubmission } from '../../src/lib/contribution';
import { selectStore } from '../../src/lib/contribution-store';
import type { QueuedSubmission } from '../../src/lib/contribution-store';
import { resolveSub } from '../../src/lib/auth/resolve';
import type { ResolveEnv } from '../../src/lib/auth/resolve';

type Env = ResolveEnv & {
  ALLOW_PROVISIONAL_CONTRIBUTIONS?: string;
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

// Single dispatcher so non-POST verbs get an explicit 405 (with onRequestPost
// alone, other methods fall through to static asset handling → 404).
// Pages Functions inject { request, env } — typed loosely to avoid a workers-types dep.
export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json; charset=utf-8', allow: 'POST' },
    });
  }
  return handlePost(context);
}

async function handlePost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json({ error: 'expected application/json' }, 415);
  }

  let raw: RawSubmission;
  try {
    raw = (await request.json()) as RawSubmission;
  } catch {
    return json({ error: 'invalid JSON body' }, 400);
  }

  // Identity is derived server-side — never read from the request body.
  const identity = deriveContributor(await resolveSub(request, env));

  // Fail-closed gate BEFORE doing any work with the submission.
  if (!isWriteAllowed(identity, env)) {
    return json({ error: 'contributions require sign-in' }, 401);
  }

  const result = validateSubmission(raw);
  if (!result.ok || !result.value) {
    return json({ error: 'validation failed', details: result.errors }, 422);
  }

  const store = selectStore(env);
  const item: QueuedSubmission = {
    id: crypto.randomUUID(),
    contributorId: identity.contributorId,
    provisional: identity.provisional,
    submission: result.value,
    status: 'queued',
    createdAt: new Date().toISOString(),
  };

  try {
    const { id } = await store.enqueue(item);
    return json({ status: 'queued', id }, 202);
  } catch (err) {
    // Don't leak store internals to the client; log server-side for triage.
    console.error('[contribution] enqueue failed:', err instanceof Error ? err.message : err);
    return json({ error: 'could not queue submission, please try again later' }, 503);
  }
}
