"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header/site-header";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { DeckCard } from "@/features/store/deck-card/deck-card";
import { formatPrice } from "@/lib/format-price";
import { MY_CART_QUERY, type MyCartQueryData } from "../graphql";
import { RemoveFromCartButton } from "../remove-from-cart-button/remove-from-cart-button";
import styles from "./cart-view.module.scss";

export function CartView() {
  const { isReady } = useRequireAuth();
  const { data, loading, error } = useQuery<MyCartQueryData>(MY_CART_QUERY, {
    skip: !isReady,
  });

  if (!isReady) {
    return null;
  }

  const items = data?.myCart ?? [];
  const total = items.reduce((sum, item) => sum + item.deck.price, 0);

  return (
    <>
      <SiteHeader />
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.heading}>Your cart</h1>
          <p className={styles.subheading}>
            Paid decks you&apos;ve picked out, ready for checkout.
          </p>
        </header>

        {loading && <p className={styles.status}>Loading your cart…</p>}
        {error && (
          <p className={styles.statusError}>
            Couldn&apos;t load your cart. Please check your connection and try again.
          </p>
        )}

        {data && items.length === 0 && (
          <div className={`${styles.empty} index-card-dashed`}>
            <p>Your cart is empty.</p>
            <Link href="/store" className={styles.emptyLink}>
              Browse paid decks in the store →
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <>
            <div className={styles.grid}>
              {items.map((item) => (
                <DeckCard
                  key={item.id}
                  deck={item.deck}
                  action={<RemoveFromCartButton deckId={item.deck.id} />}
                />
              ))}
            </div>

            <div className={`${styles.summary} index-card`}>
              <span className={styles.summaryLabel}>
                Total ({items.length} {items.length === 1 ? "deck" : "decks"})
              </span>
              <span className={styles.summaryTotal}>{formatPrice(total)}</span>
              <Button asChild className={styles.checkoutButton}>
                <Link href="/checkout">Proceed to checkout</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
