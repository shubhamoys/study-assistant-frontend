"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/site-header/site-header";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { MY_CART_QUERY, type MyCartQueryData } from "@/features/cart/graphql";
import { MY_LIBRARY_QUERY } from "@/features/library/graphql";
import {
  CHECKOUT_MUTATION,
  PREVIEW_COUPON_QUERY,
  type CheckoutMutationData,
  type CheckoutMutationVars,
  type CouponPreview,
  type PreviewCouponQueryData,
  type PreviewCouponQueryVars,
} from "@/features/orders/graphql";
import { formatPrice } from "@/lib/format-price";
import { getCheckoutErrorMessage } from "../get-checkout-error-message";
import { getCouponErrorMessage } from "../get-coupon-error-message";
import styles from "./checkout-view.module.scss";

export function CheckoutView() {
  const { isReady } = useRequireAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponPreview | null>(
    null,
  );
  const { data, loading, error } = useQuery<MyCartQueryData>(MY_CART_QUERY, {
    skip: !isReady,
  });
  const [checkout, { loading: payingLoading }] = useMutation<
    CheckoutMutationData,
    CheckoutMutationVars
  >(CHECKOUT_MUTATION, {
    // The nav's cart badge needs to see the now-empty cart immediately
    // (same refetch-over-cache-surgery call as Add/RemoveFromCartButton),
    // and the Library page needs to see the decks checkout just granted
    // access to, in case either was already cached from before payment.
    refetchQueries: [{ query: MY_CART_QUERY }, { query: MY_LIBRARY_QUERY }],
  });
  // network-only: a coupon's remaining redemptions/expiry can change between
  // requests, and this is never meant to read from — or pollute — the cache.
  const [previewCoupon, { loading: applyingCoupon }] = useLazyQuery<
    PreviewCouponQueryData,
    PreviewCouponQueryVars
  >(PREVIEW_COUPON_QUERY, { fetchPolicy: "network-only" });

  if (!isReady) {
    return null;
  }

  const items = data?.myCart ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.deck.price, 0);
  const discount = appliedCoupon?.discountAmount ?? 0;
  const total = subtotal - discount;

  async function handleApplyCoupon() {
    const code = couponInput.trim();
    if (!code) {
      return;
    }
    setCouponError(null);
    try {
      const { data: result } = await previewCoupon({ variables: { code } });
      if (result) {
        setAppliedCoupon(result.previewCoupon);
      }
    } catch (previewError) {
      setAppliedCoupon(null);
      setCouponError(getCouponErrorMessage(previewError));
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  }

  async function handlePay() {
    setErrorMessage(null);
    try {
      const { data: result } = await checkout({
        variables: { couponCode: appliedCoupon?.code },
      });
      if (result) {
        router.push(`/orders/${result.checkout.id}`);
      }
    } catch (checkoutError) {
      setErrorMessage(getCheckoutErrorMessage(checkoutError));
    }
  }

  return (
    <>
      <SiteHeader />
      <div className={styles.page}>
        <Link href="/cart" className={styles.backLink}>
          ← Back to cart
        </Link>

        <header className={styles.header}>
          <h1 className={styles.heading}>Checkout</h1>
          <p className={styles.subheading}>
            Review your order, then pay to unlock these decks.
          </p>
        </header>

        {loading && <p className={styles.status}>Loading your cart…</p>}
        {error && (
          <p className={styles.statusError}>
            Couldn&apos;t load your cart — is the backend running?
          </p>
        )}

        {data && items.length === 0 && (
          <div className={`${styles.empty} index-card-dashed`}>
            <p>Your cart is empty — there&apos;s nothing to check out.</p>
            <Link href="/store" className={styles.emptyLink}>
              Browse paid decks in the store →
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className={`${styles.summary} index-card`}>
            <ul className={styles.itemList}>
              {items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <span className={styles.itemTitle}>{item.deck.title}</span>
                  <span className={styles.itemPrice}>
                    {formatPrice(item.deck.price)}
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.couponRow}>
              {appliedCoupon ? (
                <div className={styles.couponApplied}>
                  <span className={styles.couponAppliedCode}>
                    {appliedCoupon.code} applied
                  </span>
                  <button
                    type="button"
                    className={styles.couponRemoveButton}
                    onClick={handleRemoveCoupon}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <Input
                    value={couponInput}
                    onChange={(event) =>
                      setCouponInput(event.target.value.toUpperCase())
                    }
                    placeholder="Coupon code"
                    className={styles.couponInput}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => void handleApplyCoupon()}
                    disabled={applyingCoupon || !couponInput.trim()}
                    className={styles.couponApplyButton}
                  >
                    {applyingCoupon ? "Checking…" : "Apply"}
                  </Button>
                </>
              )}
            </div>
            {couponError && (
              <p className={styles.statusError} role="alert">
                {couponError}
              </p>
            )}

            <div className={styles.totalsBlock}>
              {appliedCoupon && (
                <>
                  <div className={styles.subtotalRow}>
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className={styles.discountRow}>
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                </>
              )}
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalAmount}>
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {errorMessage && (
              <p className={styles.statusError} role="alert">
                {errorMessage}
              </p>
            )}

            <Button
              onClick={() => void handlePay()}
              disabled={payingLoading}
              className={styles.payButton}
            >
              {payingLoading ? "Paying…" : `Pay ${formatPrice(total)}`}
            </Button>
            <p className={styles.stubNote}>
              This is a placeholder payment — clicking Pay completes the
              order immediately, no real charge happens. Real payment
              processing (Razorpay) lands in a later checkpoint.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
