import { API_ORIGIN } from "@/lib/graphql-endpoint";

/** avatarUrl from the API is relative (e.g. "/uploads/avatars/x.png") — the backend serves it from its own origin, not this Next.js app's. */
export function resolveAvatarUrl(avatarUrl: string | null): string | null {
  if (!avatarUrl) return null;
  return `${API_ORIGIN}${avatarUrl}`;
}
