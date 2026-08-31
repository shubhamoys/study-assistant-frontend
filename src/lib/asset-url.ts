import { API_ORIGIN } from "@/lib/graphql-endpoint";

/**
 * Any relative upload path the API returns (avatars, deck covers, markdown
 * image attachments — e.g. "/uploads/avatars/x.png") needs the backend's own
 * origin prefixed, since the backend is a different origin than this Next.js
 * app. Originally avatar-specific (`resolveAvatarUrl`); generalized once
 * deck covers and markdown-embedded images needed the exact same resolution.
 */
export function resolveAssetUrl(path: string | null): string | null {
  if (!path) return null;
  return `${API_ORIGIN}${path}`;
}
