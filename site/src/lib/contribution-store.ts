// Moderation-queue store — the seam behind which a real datastore slots in.
//
// Phase 2 keeps this an interface + a no-persistence stub so the endpoint shape
// is proven end-to-end WITHOUT committing to a datastore or storing real
// contributor data before the hosting / data-controller decision is made
// (docs/platform-membership.md → "Open decisions & blockers"). When that lands,
// implement `ContributionStore` against Cloudflare D1/KV or Supabase — nothing
// else in the contribution flow changes.

import type { ValidSubmission } from './contribution';

export interface QueuedSubmission {
  id: string;
  contributorId: string; // pairwise sub (BAS invariant #3), keyed for delete/export
  provisional: boolean;
  submission: ValidSubmission;
  status: 'queued'; // moderation transitions (approved/rejected) are Phase 2 moderator UI
  createdAt: string; // ISO 8601, supplied by the caller (Workers have no ambient clock at import)
}

export interface ContributionStore {
  /** Persist a submission to the moderation queue; returns its queue id. */
  enqueue(item: QueuedSubmission): Promise<{ id: string }>;
}

/**
 * No-persistence stub. Accepts and drops the write (logs a redacted line), so the
 * endpoint returns a real 202 without any datastore. Body text is NOT logged —
 * unmoderated submissions are treated as sensitive until reviewed.
 */
export class StubContributionStore implements ContributionStore {
  async enqueue(item: QueuedSubmission): Promise<{ id: string }> {
    console.log(
      `[contribution] stub enqueue id=${item.id} kind=${item.submission.kind} provisional=${item.provisional}`
    );
    return { id: item.id };
  }
}

/**
 * Supabase-backed store. Inserts into the `wiki_contributions` moderation queue
 * via PostgREST — dependency-free (plain fetch), so it bundles cleanly in the
 * Cloudflare Pages Function (workerd) runtime. Uses the **service-role** key,
 * which is server-only and never reaches the client (BAS invariant #1: the
 * function is the trust boundary). Schema + RLS/grants: supabase/migrations.
 */
export class SupabaseContributionStore implements ContributionStore {
  private readonly url: string;
  private readonly serviceRoleKey: string;
  private readonly fetchImpl: typeof fetch;

  // Explicit field assignment (not TS parameter properties) — the latter is
  // non-erasable syntax that node's --test type-stripping rejects.
  // fetchImpl defaults to a wrapper that calls the global `fetch` by identifier — a
  // bare captured reference throws "Illegal invocation" on the Workers runtime.
  constructor(url: string, serviceRoleKey: string, fetchImpl: typeof fetch = (input, init) => fetch(input, init)) {
    this.url = url;
    this.serviceRoleKey = serviceRoleKey;
    this.fetchImpl = fetchImpl;
  }

  async enqueue(item: QueuedSubmission): Promise<{ id: string }> {
    const endpoint = `${this.url.replace(/\/+$/, '')}/rest/v1/wiki_contributions`;
    const row = {
      id: item.id,
      contributor_id: item.contributorId,
      provisional: item.provisional,
      kind: item.submission.kind,
      payload: item.submission,
      status: item.status,
      created_at: item.createdAt,
    };
    const res = await this.fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: this.serviceRoleKey,
        authorization: `Bearer ${this.serviceRoleKey}`,
        prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`supabase insert failed: ${res.status} ${detail.slice(0, 200)}`);
    }
    return { id: item.id };
  }
}

export interface StoreEnv {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

/**
 * Pick the store from the environment: Supabase when both credentials are
 * present, else the no-persistence stub. So production (with the secrets set)
 * persists to the moderation queue, while local/preview without secrets is inert.
 */
export function selectStore(env: StoreEnv): ContributionStore {
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    return new SupabaseContributionStore(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  }
  return new StubContributionStore();
}
