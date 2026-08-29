// Shared by apollo-client.ts (normal request traffic) and token-refresh.ts
// (a plain fetch(), deliberately outside Apollo — see that file for why).
export const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql";

// The backend's own origin, derived from GRAPHQL_URL rather than a second
// env var to configure — used for the one REST endpoint (avatar upload) and
// for resolving the relative avatarUrl the API returns (e.g.
// "/uploads/avatars/x.png") into a real <img src>, since the backend is a
// different origin than this Next.js app in dev.
export const API_ORIGIN = GRAPHQL_URL.replace(/\/graphql\/?$/, "");
