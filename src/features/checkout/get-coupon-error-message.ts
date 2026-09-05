import { CombinedGraphQLErrors } from "@apollo/client/errors";

const FALLBACK_MESSAGE = "Couldn't apply that coupon. Please try again.";

/**
 * Unlike getCheckoutErrorMessage, this passes the server's own message
 * straight through — OrdersService.previewCoupon/checkout only ever throw
 * pre-written, already user-safe coupon copy ("This coupon has expired",
 * "Invalid coupon code", etc.), so there's no separate code→copy map to
 * maintain here.
 */
export function getCouponErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors[0]?.message ?? FALLBACK_MESSAGE;
  }
  return FALLBACK_MESSAGE;
}
