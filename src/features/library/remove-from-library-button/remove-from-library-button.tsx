"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import {
  MY_LIBRARY_QUERY,
  REMOVE_DECK_FROM_LIBRARY_MUTATION,
  type RemoveDeckFromLibraryData,
  type RemoveDeckFromLibraryVars,
} from "../graphql";
import { getLibraryErrorMessage } from "../get-library-error-message";
import styles from "../add-to-library-button/add-to-library-button.module.scss";

interface RemoveFromLibraryButtonProps {
  deckId: string;
}

export function RemoveFromLibraryButton({ deckId }: RemoveFromLibraryButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [removeDeckFromLibrary, { loading }] = useMutation<
    RemoveDeckFromLibraryData,
    RemoveDeckFromLibraryVars
  >(REMOVE_DECK_FROM_LIBRARY_MUTATION, {
    refetchQueries: [{ query: MY_LIBRARY_QUERY }],
  });

  async function handleRemove() {
    setErrorMessage(null);
    try {
      await removeDeckFromLibrary({ variables: { deckId } });
    } catch (error) {
      setErrorMessage(getLibraryErrorMessage(error));
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
