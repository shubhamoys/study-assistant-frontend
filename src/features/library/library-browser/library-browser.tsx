"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SiteHeader } from "@/components/site-header/site-header";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { DeckCard } from "@/features/store/deck-card/deck-card";
import {
  CATEGORIES_QUERY,
  type CategoriesQueryData,
  type Difficulty,
} from "@/features/store/graphql";
import {
  MY_LIBRARY_QUERY,
  type LibrarySortOrder,
  type MyLibraryQueryData,
  type MyLibraryQueryVars,
} from "../graphql";
import { RemoveFromLibraryButton } from "../remove-from-library-button/remove-from-library-button";
import styles from "./library-browser.module.scss";

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

const SORT_OPTIONS: { value: LibrarySortOrder; label: string }[] = [
  { value: "RECENT", label: "Recently added" },
  { value: "TITLE", label: "Title A–Z" },
  { value: "LAST_STUDIED", label: "Last studied" },
  { value: "RATING", label: "Highest rated" },
];

export function LibraryBrowser() {
  const { isReady } = useRequireAuth();
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(undefined);
  const [sort, setSort] = useState<LibrarySortOrder | undefined>(undefined);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const hasFilters = Boolean(categoryId || difficulty || debouncedSearch);

  const { data: categoriesData } =
    useQuery<CategoriesQueryData>(CATEGORIES_QUERY, { skip: !isReady });
  const { data, loading, error } = useQuery<
    MyLibraryQueryData,
    MyLibraryQueryVars
  >(MY_LIBRARY_QUERY, {
    skip: !isReady,
    variables: {
      categoryId,
      difficulty,
      sort,
      search: debouncedSearch || undefined,
    },
  });

  if (!isReady) {
    return null;
  }

  return (
    <>
      <SiteHeader />
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.heading}>Your library</h1>
          <p className={styles.subheading}>
            Decks you&apos;ve saved, ready to study.
          </p>
        </header>

        <div className={styles.controls}>
          <Input
            type="search"
            placeholder="Search your library…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className={styles.search}
            aria-label="Search your library"
          />
          <Select
            value={sort ?? "RECENT"}
            onChange={(event) => setSort(event.target.value as LibrarySortOrder)}
            className={styles.sort}
            aria-label="Sort your library"
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

        {loading && <p className={styles.status}>Loading your library…</p>}
        {error && (
          <p className={styles.statusError}>
            Couldn&apos;t load your library. Please check your connection and try again.
          </p>
        )}

        {data && data.myLibrary.length === 0 && !hasFilters && (
          <div className={`${styles.empty} index-card-dashed`}>
            <p>Your library is empty.</p>
            <Link href="/store" className={styles.emptyLink}>
              Browse the store →
            </Link>
          </div>
        )}

        {data && data.myLibrary.length === 0 && hasFilters && (
          <p className={styles.status}>No decks in your library match these filters.</p>
        )}

        <div className={styles.grid}>
          {data?.myLibrary.map((entry) => (
            <DeckCard
              key={entry.id}
              deck={entry.deck}
              action={
                <div className={styles.cardActions}>
                  <Button asChild size="sm">
                    <Link href={`/study/${entry.deck.id}`}>Study</Link>
                  </Button>
                  {/* A purchase is permanent — no way to accidentally remove
                      a deck you paid for. See LibraryService.removeDeck's
                      matching server-side rejection. */}
                  {entry.deck.isFree && (
                    <RemoveFromLibraryButton deckId={entry.deck.id} />
                  )}
                </div>
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}
