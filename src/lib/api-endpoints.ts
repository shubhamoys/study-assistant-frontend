import { API_ORIGIN } from "./graphql-endpoint";

/**
 * This app is GraphQL-first — these are the few REST routes that exist
 * alongside it (file uploads, which don't fit GraphQL's spec well). Add any
 * future REST route here rather than inlining a path string at the call
 * site, so a backend route change only needs updating in one place.
 */
export const endpoint = {
  avatarUpload: `${API_ORIGIN}/api/users/me/avatar`,
  attachmentUpload: `${API_ORIGIN}/api/attachments`,
} as const;
