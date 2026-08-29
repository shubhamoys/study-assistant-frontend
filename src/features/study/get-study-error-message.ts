import { CombinedGraphQLErrors } from "@apollo/client/errors";

const MESSAGES_BY_CODE: Record<string, string> = {
  NOT_FOUND: "This deck isn't in your library, or the session has ended.",
};

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

/** Maps a failed submitCardReview/completeStudySession error to user-facing copy. */
export function getStudyErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    const code = error.errors[0]?.extensions?.code as string | undefined;
    return (code && MESSAGES_BY_CODE[code]) ?? FALLBACK_MESSAGE;
  }
  return FALLBACK_MESSAGE;
}
