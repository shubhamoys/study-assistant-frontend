"use client";

import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating/star-rating";
import { SiteHeader } from "@/components/site-header/site-header";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import {
  DELETE_DECK_MUTATION,
  MY_DECKS_QUERY,
  type DeleteDeckMutationData,
  type DeleteDeckMutationVars,
  type MyDecksQueryData,
} from "@/features/store/graphql";
import styles from "./decks-list.module.scss";

export function DecksList() {
  const { isReady } = useRequireAuth();
  const { data, loading, error, refetch } = useQuery<MyDecksQueryData>(
    MY_DECKS_QUERY,
    { skip: !isReady },
  );
  const [deleteDeck, { loading: deleting }] = useMutation<
    DeleteDeckMutationData,
    DeleteDeckMutationVars
  >(DELETE_DECK_MUTATION);

  if (!isReady) {
    return null;
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    try {
      await deleteDeck({ variables: { id } });
      await refetch();
    } catch {
      // The list simply won't update — no dedicated error banner for a
      // low-stakes retry action, matching this app's other delete flows.
    }
  }

  return (
    <>
      <SiteHeader />
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.heading}>My decks</h1>
            <p className={styles.subheading}>
              Decks you&apos;ve created and can edit.
            </p>
          </div>
          <Button asChild>
            <Link href="/decks/new">Create deck</Link>
          </Button>
        </header>

        {loading && <p className={styles.status}>Loading your decks…</p>}
        {error && (
          <p className={styles.statusError}>
            Couldn&apos;t load your decks — is the backend running?
          </p>
        )}

        {data && data.myDecks.length === 0 && (
          <div className={`${styles.empty} index-card-dashed`}>
            <p>You haven&apos;t created any decks yet.</p>
            <Link href="/decks/new" className={styles.emptyLink}>
              Create your first deck →
            </Link>
          </div>
        )}

        <div className={styles.grid}>
          {data?.myDecks.map((deck) => (
            <article key={deck.id} className={`${styles.card} index-card`}>
              <div className={styles.cardBody}>
                <span className="tag">{deck.category.name}</span>
                <h2 className={styles.cardTitle}>{deck.title}</h2>
                <p className={styles.cardMeta}>
                  {deck.cardCount} {deck.cardCount === 1 ? "card" : "cards"}
                </p>
                {deck.ratingCount > 0 && (
                  <StarRating
                    value={deck.ratingAverage}
                    count={deck.ratingCount}
                    size={13}
                  />
                )}
              </div>
              <div className={styles.cardActions}>
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/decks/${deck.id}/edit`}>Edit</Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => void handleDelete(deck.id, deck.title)}
                  disabled={deleting}
                >
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
