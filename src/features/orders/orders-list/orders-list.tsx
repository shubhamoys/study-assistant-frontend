"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { SiteHeader } from "@/components/site-header/site-header";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { formatPrice } from "@/lib/format-price";
import { MY_ORDERS_QUERY, type MyOrdersQueryData } from "../graphql";
import styles from "./orders-list.module.scss";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

export function OrdersList() {
  const { isReady } = useRequireAuth();
  const { data, loading, error } = useQuery<MyOrdersQueryData>(
    MY_ORDERS_QUERY,
    { skip: !isReady },
  );

  if (!isReady) {
    return null;
  }

  const orders = data?.myOrders ?? [];

  return (
    <>
      <SiteHeader />
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.heading}>Purchase history</h1>
          <p className={styles.subheading}>
            Every order you&apos;ve placed, most recent first.
          </p>
        </header>

        {loading && <p className={styles.status}>Loading your orders…</p>}
        {error && (
          <p className={styles.statusError}>
            Couldn&apos;t load your orders. Please check your connection and try again.
          </p>
        )}

        {data && orders.length === 0 && (
          <div className={`${styles.empty} index-card-dashed`}>
            <p>You haven&apos;t purchased anything yet.</p>
            <Link href="/store" className={styles.emptyLink}>
              Browse paid decks in the store →
            </Link>
          </div>
        )}

        {orders.length > 0 && (
          <ul className={styles.list}>
            {orders.map((order) => (
              <li key={order.id}>
                <Link href={`/orders/${order.id}`} className={styles.row}>
                  <div className={styles.rowMain}>
                    <span className={styles.rowTitle}>
                      {order.items.map((item) => item.deck.title).join(", ")}
                    </span>
                    <span className={styles.rowMeta}>
                      {new Date(order.createdAt).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "short", day: "numeric" },
                      )}
                      {order.couponCode && ` · Coupon ${order.couponCode}`}
                    </span>
                  </div>
                  <div className={styles.rowEnd}>
                    <span
                      className={`${styles.statusBadge} ${
                        order.status === "COMPLETED"
                          ? styles.statusBadgeSuccess
                          : ""
                      }`}
                    >
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                    <span className={styles.rowAmount}>
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
