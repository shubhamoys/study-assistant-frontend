"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { MainNav } from "@/components/main-nav";
import { AuthStatus } from "@/features/auth/auth-status";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { AddToLibraryButton } from "@/features/library/add-to-library-button";
import { MY_LIBRARY_QUERY, type MyLibraryQueryData } from "@/features/library/graphql";
import { DeckCard } from "./deck-card";
import {
  CATEGORIES_QUERY,
  DECKS_QUERY,
  type CategoriesQueryData,
  type DecksQueryData,
  type DecksQueryVars,
} from "./graphql";
import styles from "./store-browser.module.scss";

export function StoreBrowser() {
  const { isReady } = useRequireAuth();
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  const { data: categoriesData } =
    useQuery<CategoriesQueryData>(CATEGORIES_QUERY);
  const {
    data: decksData,
    loading: decksLoading,
    error: decksError,
  } = useQuery<DecksQueryData, DecksQueryVars>(DECKS_QUERY, {
    variables: { categoryId },
  });
  const { data: libraryData } = useQuery<MyLibraryQueryData>(MY_LIBRARY_QUERY);

  if (!isReady) {
    return null;
  }

  const libraryDeckIds = new Set(
    libraryData?.myLibrary.map((entry) => entry.deck.id) ?? [],
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <span className="stamp">Store</span>
          <div className={styles.headerActions}>
            <AuthStatus />
            <ThemeToggle />
          </div>
        </div>
        <MainNav />
        <h1 className={styles.heading}>Browse decks</h1>
        <p className={styles.subheading}>
          Pick a deck to add to your library, then study it whenever you&apos;re ready.
        </p>
      </header>

      <div className={styles.categories}>
        <button
          type="button"
          className={`${styles.categoryChip} ${categoryId === undefined ? styles.categoryChipActive : ""}`}
          onClick={() => setCategoryId(undefined)}
        >
          All
        </button>
        {categoriesData?.categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`${styles.categoryChip} ${categoryId === category.id ? styles.categoryChipActive : ""}`}
            onClick={() => setCategoryId(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {decksLoading && <p className={styles.status}>Loading decks…</p>}
      {decksError && (
        <p className={styles.statusError}>
          Couldn&apos;t load decks — is the backend running?
        </p>
      )}
      {decksData && decksData.decks.length === 0 && (
        <p className={styles.status}>No decks in this category yet.</p>
      )}

      <div className={styles.grid}>
        {decksData?.decks.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            action={
              <AddToLibraryButton
                deckId={deck.id}
                inLibrary={libraryDeckIds.has(deck.id)}
              />
            }
          />
        ))}
      </div>
    </div>
  );
}
