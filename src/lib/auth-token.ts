// Phase 1 auth is a Bearer access token with no refresh token yet, so it's
// stored client-side and attached to every GraphQL request (see
// src/graphql/apollo-client.ts). Isolated here so the Apollo link and the
// Redux persistence middleware share one storage key instead of duplicating it.
const TOKEN_KEY = "study-assistant.accessToken";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}
