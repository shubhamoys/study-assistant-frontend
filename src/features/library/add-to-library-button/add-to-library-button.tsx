"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import {
  ADD_DECK_TO_LIBRARY_MUTATION,
  MY_LIBRARY_QUERY,
  type AddDeckToLibraryData,
  type AddDeckToLibraryVars,
} from "../graphql";
import { getLibraryErrorMessage } from "../get-library-error-message";
import styles from "./add-to-library-button.module.scss";

interface AddToLibraryButtonProps {
  deckId: string;
  inLibrary: boolean;
}

export function AddToLibraryButton({ deckId, inLibrary }: AddToLibraryButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addDeckToLibrary, { loading }] = useMutation<
    AddDeckToLibraryData,
    AddDeckToLibraryVars
  >(ADD_DECK_TO_LIBRARY_MUTATION, {
    // Small catalog, infrequent action — a refetch is simpler and just as
    // correct as hand-updating the cache, and it's what keeps every screen
    // showing myLibrary (this page, the Library page) in sync for free.
    refetchQueries: [{ query: MY_LIBRARY_QUERY }],
  });

  if (inLibrary) {
    return (
      <Button variant="secondary" size="sm" disabled className={styles.inLibrary}>
        ✓ In library
      </Button>
    );
  }

  async function handleAdd() {
    setErrorMessage(null);
    try {
      await addDeckToLibrary({ variables: { deckId } });
    } catch (error) {
      setErrorMessage(getLibraryErrorMessage(error));
    }
  }

  return (
    <div className={styles.wrap}>
      <Button size="sm" onClick={() => void handleAdd()} disabled={loading}>
        {loading ? "Adding…" : "Add to library"}
      </Button>
      {errorMessage && (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
