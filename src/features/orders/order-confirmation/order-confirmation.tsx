"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header/site-header";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { formatPrice } from "@/lib/format-price";
import {
  ORDER_QUERY,
  type OrderQueryData,
  type OrderQueryVars,
} from "../graphql";
import styles from "./order-confirmation.module.scss";

interface OrderConfirmationProps {
  orderId: string;
}

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  const { isReady } = useRequireAuth();
  const { data, loading, error } = useQuery<OrderQueryData, OrderQueryVars>(
    ORDER_QUERY,
    { variables: { id: orderId }, skip: !isReady },
  );

  if (!isReady) {
    return null;
  }

  const order = data?.order;

  return (
    <>
      <SiteHeader />
      <div className={styles.page}>
        {loading && <p className={styles.status}>Loading your order…</p>}
        {error && (
          <p className={styles.statusError}>
            Couldn&apos;t find this order — it may not belong to you.
          </p>
        )}

        {order && (
          <div className={`${styles.card} index-card`}>
            <span className={styles.badge}>✓ {order.status}</span>
            <h1 className={styles.heading}>Thanks for your purchase!</h1>
            <p className={styles.subheading}>
              These decks are now in your library, ready to study.
            </p>

            <ul className={styles.itemList}>
              {order.items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <span className={styles.itemTitle}>{item.deck.title}</span>
                  <span className={styles.itemPrice}>
                    {formatPrice(item.price)}
                  </span>
                </li>
              ))}
            </ul>

            {order.couponCode && (
              <div className={styles.discountRow}>
                <span>Coupon {order.couponCode}</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total paid</span>
              <span className={styles.totalAmount}>
                {formatPrice(order.totalAmount)}
              </span>
            </div>

            <div className={styles.actions}>
              <Button asChild>
                <Link href="/library">Go to your library</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/store">Continue browsing</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
