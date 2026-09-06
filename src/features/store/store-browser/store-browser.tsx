"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SiteHeader } from "@/components/site-header/site-header";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { AddToLibraryButton } from "@/features/library/add-to-library-button/add-to-library-button";
import { MY_LIBRARY_QUERY, type MyLibraryQueryData } from "@/features/library/graphql";
import { AddToCartButton } from "@/features/cart/add-to-cart-button/add-to-cart-button";
import { MY_CART_QUERY, type MyCartQueryData } from "@/features/cart/graphql";
import { DeckCard } from "../deck-card/deck-card";
import {
  CATEGORIES_QUERY,
  DECKS_QUERY,
  type CategoriesQueryData,
  type DecksQueryData,
  type DecksQueryVars,
  type Difficulty,
  type DeckSortOrder,
} from "../graphql";
import styles from "./store-browser.module.scss";

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

const SORT_OPTIONS: { value: DeckSortOrder; label: string }[] = [
  { value: "NEWEST", label: "Newest" },
  { value: "RATING", label: "Highest rated" },
  { value: "DOWNLOADS", label: "Most downloaded" },
  { value: "TITLE", label: "Title A–Z" },
];

export function StoreBrowser() {
  const { isReady } = useRequireAuth();
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(undefined);
  const [sort, setSort] = useState<DeckSortOrder | undefined>(undefined);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data: categoriesData } =
    useQuery<CategoriesQueryData>(CATEGORIES_QUERY);
  const {
    data: decksData,
    loading: decksLoading,
    error: decksError,
  } = useQuery<DecksQueryData, DecksQueryVars>(DECKS_QUERY, {
    variables: {
      categoryId,
      difficulty,
      sort,
      search: debouncedSearch || undefined,
    },
  });
  const { data: libraryData } = useQuery<MyLibraryQueryData>(MY_LIBRARY_QUERY);
  const { data: cartData } = useQuery<MyCartQueryData>(MY_CART_QUERY);

  if (!isReady) {
    return null;
  }

  const libraryDeckIds = new Set(
    libraryData?.myLibrary.map((entry) => entry.deck.id) ?? [],
  );
  const cartDeckIds = new Set(
    cartData?.myCart.map((item) => item.deck.id) ?? [],
  );

  return (
    <>
      <SiteHeader />
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.heading}>Browse decks</h1>
          <p className={styles.subheading}>
            Pick a deck to add to your library, then study it whenever
            you&apos;re ready.
          </p>
        </header>

        <div className={styles.controls}>
          <Input
            type="search"
            placeholder="Search decks…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className={styles.search}
            aria-label="Search decks"
          />
          <Select
            value={sort ?? "NEWEST"}
            onChange={(event) => setSort(event.target.value as DeckSortOrder)}
            className={styles.sort}
            aria-label="Sort decks"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className={styles.chipRow}>
          <button
            type="button"
            className={`${styles.chip} ${categoryId === undefined ? styles.chipActive : ""}`}
            onClick={() => setCategoryId(undefined)}
          >
            All
          </button>
          {categoriesData?.categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`${styles.chip} ${categoryId === category.id ? styles.chipActive : ""}`}
              onClick={() => setCategoryId(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className={styles.chipRow}>
          <button
            type="button"
            className={`${styles.chip} ${difficulty === undefined ? styles.chipActive : ""}`}
            onClick={() => setDifficulty(undefined)}
          >
            Any difficulty
          </button>
          {DIFFICULTIES.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.chip} ${difficulty === option.value ? styles.chipActive : ""}`}
              onClick={() => setDifficulty(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {decksLoading && <p className={styles.status}>Loading decks…</p>}
        {decksError && (
          <p className={styles.statusError}>
            Couldn&apos;t load decks. Please check your connection and try again.
          </p>
        )}
        {decksData && decksData.decks.length === 0 && (
          <p className={styles.status}>No decks match your filters yet.</p>
        )}

        <div className={styles.grid}>
          {decksData?.decks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              action={
                deck.isFree ? (
                  <AddToLibraryButton
                    deckId={deck.id}
                    inLibrary={libraryDeckIds.has(deck.id)}
                  />
                ) : (
                  <AddToCartButton
                    deckId={deck.id}
                    inCart={cartDeckIds.has(deck.id)}
                  />
                )
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}
