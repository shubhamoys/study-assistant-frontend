import { CombinedGraphQLErrors } from "@apollo/client/errors";

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

/**
 * Passes the server's own message straight through, same reasoning as
 * get-coupon-error-message.ts — OrdersService.checkout/verifyPayment only
 * ever throw pre-written, already user-safe copy ("Your cart has nothing
 * left to check out", "Payment verification failed", "This order is no
 * longer awaiting payment", etc.), so there's no separate code→copy map to
 * maintain, and every message stays accurate as new failure cases are added.
 */
export function getCheckoutErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors[0]?.message ?? FALLBACK_MESSAGE;
  }
  return FALLBACK_MESSAGE;
}
