// OIDC configuration — the single source of truth for the Keycloak client, read
// from server-only env. Public browsing never touches this: identity gates
// contribution only (docs/platform-membership.md, mirrors Access Atlas §15).
//
// DROP-IN CONTRACT: when all three vars are set (the platform Keycloak exists and
// this app is registered as a client), `keycloakConfigured()` flips true and the
// contributor seam switches from fail-closed to real OIDC. When unset, behavior
// is exactly as before — nothing turns on by accident (fail-closed by default).

export interface OidcConfig {
  /** Token issuer, e.g. https://id.kindredaccess.org/realms/bas */
  issuer: string;
  /** The public client id registered for the Disability Wiki. */
  clientId: string;
  /** Must equal this app's /auth/callback URL, registered on the client. */
  redirectUri: string;
}

export interface OidcEnv {
  KEYCLOAK_ISSUER?: string;
  KEYCLOAK_CLIENT_ID?: string;
  KEYCLOAK_REDIRECT_URI?: string;
}

/** True only when every OIDC var is present — the switch that enables real auth. */
export function keycloakConfigured(env: OidcEnv): boolean {
  return Boolean(env.KEYCLOAK_ISSUER && env.KEYCLOAK_CLIENT_ID && env.KEYCLOAK_REDIRECT_URI);
}

/** Read the config; throws if called when not fully configured (guard with keycloakConfigured). */
export function oidcConfig(env: OidcEnv): OidcConfig {
  if (!keycloakConfigured(env)) {
    throw new Error('oidcConfig() called but Keycloak is not fully configured');
  }
  return {
    issuer: env.KEYCLOAK_ISSUER!.replace(/\/+$/, ''),
    clientId: env.KEYCLOAK_CLIENT_ID!,
    redirectUri: env.KEYCLOAK_REDIRECT_URI!,
  };
}

// Standard OIDC endpoint derivations for a Keycloak realm issuer.
export const authorizationEndpoint = (c: OidcConfig) => `${c.issuer}/protocol/openid-connect/auth`;
export const tokenEndpoint = (c: OidcConfig) => `${c.issuer}/protocol/openid-connect/token`;
export const jwksUri = (c: OidcConfig) => `${c.issuer}/protocol/openid-connect/certs`;
export const endSessionEndpoint = (c: OidcConfig) => `${c.issuer}/protocol/openid-connect/logout`;
