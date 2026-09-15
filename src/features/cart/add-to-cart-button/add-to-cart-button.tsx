"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import {
  ADD_DECK_TO_CART_MUTATION,
  MY_CART_QUERY,
  type AddDeckToCartData,
  type AddDeckToCartVars,
} from "../graphql";
import { getCartErrorMessage } from "../get-cart-error-message";
import styles from "./add-to-cart-button.module.scss";

interface AddToCartButtonProps {
  deckId: string;
  inCart: boolean;
}

export function AddToCartButton({ deckId, inCart }: AddToCartButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addDeckToCart, { loading }] = useMutation<
    AddDeckToCartData,
    AddDeckToCartVars
  >(ADD_DECK_TO_CART_MUTATION, {
    // Same small-catalog refetch-over-cache-surgery call as AddToLibraryButton.
    refetchQueries: [{ query: MY_CART_QUERY }],
  });

  if (inCart) {
    return (
      <Button asChild variant="secondary" size="sm" className={styles.inCart}>
        <Link href="/cart">✓ In cart</Link>
      </Button>
    );
  }

  async function handleAdd() {
    setErrorMessage(null);
    try {
      await addDeckToCart({ variables: { deckId } });
    } catch (error) {
      setErrorMessage(getCartErrorMessage(error));
    }
  }

  return (
    <div className={styles.wrap}>
      <Button size="sm" onClick={() => void handleAdd()} disabled={loading}>
        {loading ? "Adding…" : "Add to cart"}
      </Button>
      {errorMessage && (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
