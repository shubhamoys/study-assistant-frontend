"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header/site-header";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { AddToLibraryButton } from "@/features/library/add-to-library-button/add-to-library-button";
import { MY_LIBRARY_QUERY, type MyLibraryQueryData } from "@/features/library/graphql";
import { DECK_QUERY, type DeckQueryData, type DeckQueryVars } from "../graphql";
import styles from "./deck-detail.module.scss";

const DIFFICULTY_LABEL: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

interface DeckDetailProps {
  deckId: string;
}

export function DeckDetail({ deckId }: DeckDetailProps) {
  const { isReady } = useRequireAuth();
  const { data, loading, error } = useQuery<DeckQueryData, DeckQueryVars>(
    DECK_QUERY,
    { variables: { id: deckId }, skip: !isReady },
  );
  const { data: libraryData } = useQuery<MyLibraryQueryData>(MY_LIBRARY_QUERY, {
    skip: !isReady,
  });

  if (!isReady) {
    return null;
  }

  const inLibrary = Boolean(
    libraryData?.myLibrary.some((entry) => entry.deck.id === deckId),
  );

  return (
    <>
      <SiteHeader />
      <div className={styles.page}>
        <div className={styles.content}>
          <Link href="/store" className={styles.backLink}>
            ← Back to store
          </Link>

          {loading && <p className={styles.status}>Loading deck…</p>}
          {error && (
            <p className={styles.statusError}>
              Couldn&apos;t load this deck — it may have been removed.
            </p>
          )}

          {data && (
            <article className={`${styles.card} index-card`}>
              <span className="tag">{data.deck.category.name}</span>
              <h1 className={styles.title}>{data.deck.title}</h1>
              {data.deck.description && (
                <p className={styles.description}>{data.deck.description}</p>
              )}

              <dl className={styles.stats}>
                <div className={styles.stat}>
                  <dt>Difficulty</dt>
                  <dd>{DIFFICULTY_LABEL[data.deck.difficulty]}</dd>
                </div>
                <div className={styles.stat}>
                  <dt>Cards</dt>
                  <dd>{data.deck.cardCount}</dd>
                </div>
                <div className={styles.stat}>
                  <dt>Price</dt>
                  <dd>
                    {data.deck.isFree
                      ? "Free"
                      : `₹${(data.deck.price / 100).toFixed(2)}`}
                  </dd>
                </div>
              </dl>

              <div className={styles.actionRow}>
                <AddToLibraryButton
                  deckId={data.deck.id}
                  inLibrary={inLibrary}
                />
                {inLibrary && (
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/study/${data.deck.id}`}>Study</Link>
                  </Button>
                )}
              </div>
            </article>
          )}
        </div>
      </div>
    </>
  );
}
