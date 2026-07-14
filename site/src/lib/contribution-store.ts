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
