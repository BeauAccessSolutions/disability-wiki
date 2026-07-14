// Community-contribution core — pure, runtime-agnostic logic.
//
// The contribution model (docs/contribution-model.md): pseudonymous
// suggest-edit / propose-page → moderation queue → promotion into markdown.
// The published site never reads this; submissions are a *staging* surface.
//
// This module holds only pure functions (validation, id derivation, the write
// gate) so they are unit-testable without the Cloudflare runtime. The Pages
// Function in `functions/api/contributions.ts` is a thin wrapper over these.

export type SubmissionKind = 'suggest_edit' | 'propose_page';

/** A raw, untrusted request body as received from the contribution form. */
export interface RawSubmission {
  kind?: unknown;
  page?: unknown; // suggest_edit: the path being commented on, e.g. /benefits/us/ssi/
  section?: unknown; // suggest_edit: optional section heading
  title?: unknown; // propose_page: new page title
  category?: unknown; // propose_page: top-level category dir, e.g. "benefits"
  body?: unknown; // both: the suggestion / draft text (plain markdown)
}

/** A validated submission, ready to hand to the store. */
export type ValidSubmission =
  | { kind: 'suggest_edit'; page: string; section?: string; body: string }
  | { kind: 'propose_page'; title: string; category: string; body: string };

export interface ValidationResult {
  ok: boolean;
  value?: ValidSubmission;
  errors: string[];
}

// Bounds — generous enough for a real page draft, tight enough to reject abuse.
const BODY_MIN = 10;
const BODY_MAX = 20_000;
const TITLE_MAX = 120;
const SECTION_MAX = 120;

// Category allowlist mirrors the repo's top-level content dirs. Keep in sync with
// the category directories under the repo root (benefits/, rights/, crisis/, …).
export const CONTENT_CATEGORIES = [
  'benefits',
  'rights',
  'crisis',
  'housing',
  'health',
  'work',
  'education',
  'community',
  'foundations',
  'start',
] as const;

/** A page path must look like an internal absolute path: /a/b/ — no scheme, no `..`. */
function isInternalPagePath(p: string): boolean {
  return /^\/[a-z0-9]+(?:\/[a-z0-9-]+)*\/?$/i.test(p) && !p.includes('..');
}

function asTrimmedString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

/**
 * Validate + normalize an untrusted submission. Never trusts client-supplied
 * identity — the contributor id is derived server-side, not read from the body.
 */
export function validateSubmission(raw: RawSubmission): ValidationResult {
  const errors: string[] = [];
  const kind = raw.kind;

  if (kind !== 'suggest_edit' && kind !== 'propose_page') {
    return { ok: false, errors: ['kind must be "suggest_edit" or "propose_page"'] };
  }

  const body = asTrimmedString(raw.body);
  if (body.length < BODY_MIN) errors.push(`body must be at least ${BODY_MIN} characters`);
  if (body.length > BODY_MAX) errors.push(`body must be at most ${BODY_MAX} characters`);

  if (kind === 'suggest_edit') {
    const page = asTrimmedString(raw.page);
    if (!page) errors.push('page is required for a suggested edit');
    else if (!isInternalPagePath(page)) errors.push('page must be an internal path like /benefits/us/ssi/');

    const section = asTrimmedString(raw.section);
    if (section.length > SECTION_MAX) errors.push(`section must be at most ${SECTION_MAX} characters`);

    if (errors.length) return { ok: false, errors };
    return {
      ok: true,
      errors: [],
      value: { kind, page, ...(section ? { section } : {}), body },
    };
  }

  // propose_page
  const title = asTrimmedString(raw.title);
  if (!title) errors.push('title is required for a proposed page');
  else if (title.length > TITLE_MAX) errors.push(`title must be at most ${TITLE_MAX} characters`);

  const category = asTrimmedString(raw.category).toLowerCase();
  if (!category) errors.push('category is required for a proposed page');
  else if (!(CONTENT_CATEGORIES as readonly string[]).includes(category)) {
    errors.push(`category must be one of: ${CONTENT_CATEGORIES.join(', ')}`);
  }

  if (errors.length) return { ok: false, errors };
  return { ok: true, errors: [], value: { kind, title, category, body } };
}

/** The identity the store keys on. `sub` is Keycloak's per-client pairwise subject. */
export interface ContributorIdentity {
  contributorId: string;
  provisional: boolean;
}

/**
 * Derive the contributor id from a validated session's pairwise `sub`
 * (BAS invariant #3 — keyed by the app's own pairwise sub, not correlatable
 * across apps). Until Keycloak is wired, callers pass `null` and get a
 * provisional id — but the write gate below refuses provisional writes in prod.
 */
export function deriveContributor(sub: string | null): ContributorIdentity {
  if (sub && sub.length > 0) return { contributorId: sub, provisional: false };
  return { contributorId: 'provisional:anonymous', provisional: true };
}

export interface WriteGateEnv {
  ALLOW_PROVISIONAL_CONTRIBUTIONS?: string;
}

/**
 * Fail-closed write gate. A write is allowed only when the contributor is
 * authenticated (non-provisional), OR when the provisional flag is explicitly
 * enabled — which must be set only on local/preview, never production. So an
 * unauthenticated write can never ship by accident: with no session and no flag,
 * this returns false.
 */
export function isWriteAllowed(identity: ContributorIdentity, env: WriteGateEnv): boolean {
  if (!identity.provisional) return true;
  return env.ALLOW_PROVISIONAL_CONTRIBUTIONS === 'true';
}
