-- =============================================================================
-- 0002_contributor_identity.sql — key contributors by the Keycloak subject and
-- give the app its own revocable data-access session (BAS invariant #1).
-- Mirrors Access Atlas's 0006_contributor_identity.sql.
--
-- 1. contributors.sub — the Keycloak PAIRWISE subject id. Pairwise = each app
--    gets a DIFFERENT stable sub for the same person, so identities can't be
--    correlated across platform apps (invariant #3). Nullable: provisional /
--    pre-Keycloak contributors have no sub. Unique: one row per subject.
--
-- 2. contributor_sessions — the app's OWN session, minted AFTER validating the
--    OIDC token against Keycloak's JWKS (layered sessions: the identity token is
--    never itself a data credential). The httpOnly cookie holds a random token;
--    only its SHA-256 hash is stored, so a leaked DB read can't be replayed.
--    Revocable (revoked_at) and expiring (expires_at).
--
-- Server-only, like 0001: RLS on, public roles revoked, service_role granted
-- (RLS ≠ GRANT). contributor_id in wiki_contributions (0001) is the same pairwise
-- sub stored here, so delete/export by sub (invariant #3) spans both tables.
-- =============================================================================

create table contributors (
  id         uuid primary key default gen_random_uuid(),
  sub        text unique,                       -- Keycloak pairwise sub; null pre-auth
  created_at timestamptz not null default now()
);

comment on column contributors.sub is
  'Keycloak PAIRWISE subject id (per-app; never cross-app, invariant #3). Null for provisional/pre-Keycloak.';

create table contributor_sessions (
  id             uuid primary key default gen_random_uuid(),
  contributor_id uuid not null references contributors(id) on delete cascade,
  token_hash     text not null unique,          -- sha256(cookie token); raw token never stored
  created_at     timestamptz not null default now(),
  expires_at     timestamptz not null,
  revoked_at     timestamptz                    -- non-null => revoked (logout / admin)
);

create index contributor_sessions_contributor_idx on contributor_sessions (contributor_id);
-- Fast, safe session lookup: hash match + live only.
create index contributor_sessions_live_idx on contributor_sessions (token_hash) where revoked_at is null;

alter table contributors         enable row level security;
alter table contributor_sessions enable row level security;

revoke all on contributors         from anon, authenticated;
revoke all on contributor_sessions from anon, authenticated;

grant select, insert, update on contributors         to service_role;
grant select, insert, update on contributor_sessions to service_role;
