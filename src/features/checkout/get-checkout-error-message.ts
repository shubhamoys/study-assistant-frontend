import { CombinedGraphQLErrors } from "@apollo/client/errors";

const MESSAGES_BY_CODE: Record<string, string> = {
  BAD_REQUEST:
    "Your cart has nothing left to check out — a deck may have gone free or been removed since you added it.",
};

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

/** Maps a failed checkout mutation error to user-facing copy. */
export function getCheckoutErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    const code = error.errors[0]?.extensions?.code as string | undefined;
    return (code && MESSAGES_BY_CODE[code]) ?? FALLBACK_MESSAGE;
  }
  return FALLBACK_MESSAGE;
}
