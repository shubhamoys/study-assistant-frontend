import { CombinedGraphQLErrors } from "@apollo/client/errors";

const MESSAGES_BY_CODE: Record<string, string> = {
  CONFLICT: "That deck is already in your library.",
  NOT_FOUND: "That deck isn't available anymore.",
  // The Remove button is already hidden for a purchased deck — this only
  // ever surfaces if that check was somehow bypassed (a stale cached page,
  // a direct API call).
  FORBIDDEN: "Purchased decks can't be removed from your library.",
};

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

/** Maps a failed addDeckToLibrary/removeDeckFromLibrary error to user-facing copy. */
export function getLibraryErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    const code = error.errors[0]?.extensions?.code as string | undefined;
    return (code && MESSAGES_BY_CODE[code]) ?? FALLBACK_MESSAGE;
  }
  return FALLBACK_MESSAGE;
}
