"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import {
  MY_CART_QUERY,
  REMOVE_DECK_FROM_CART_MUTATION,
  type RemoveDeckFromCartData,
  type RemoveDeckFromCartVars,
} from "../graphql";
import { getCartErrorMessage } from "../get-cart-error-message";
import styles from "../add-to-cart-button/add-to-cart-button.module.scss";

interface RemoveFromCartButtonProps {
  deckId: string;
}

export function RemoveFromCartButton({ deckId }: RemoveFromCartButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [removeDeckFromCart, { loading }] = useMutation<
    RemoveDeckFromCartData,
    RemoveDeckFromCartVars
  >(REMOVE_DECK_FROM_CART_MUTATION, {
    refetchQueries: [{ query: MY_CART_QUERY }],
  });

  async function handleRemove() {
    setErrorMessage(null);
    try {
      await removeDeckFromCart({ variables: { deckId } });
    } catch (error) {
      setErrorMessage(getCartErrorMessage(error));
    }
  }

  return (
    <div className={styles.wrap}>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => void handleRemove()}
        disabled={loading}
      >
        {loading ? "Removing…" : "Remove"}
      </Button>
      {errorMessage && (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
