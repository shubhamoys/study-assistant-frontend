"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { SiteHeader } from "@/components/site-header/site-header";
import { useAuth } from "@/features/auth/use-auth";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { DECK_QUERY, type DeckQueryData, type DeckQueryVars } from "@/features/store/graphql";
import { DeckForm } from "../deck-form/deck-form";
import { FlashcardEditor } from "../flashcard-editor/flashcard-editor";
import styles from "./edit-deck-page.module.scss";

interface EditDeckPageProps {
  deckId: string;
}

export function EditDeckPage({ deckId }: EditDeckPageProps) {
  const { isReady } = useRequireAuth();
  const { user } = useAuth();
  const { data, loading, error } = useQuery<DeckQueryData, DeckQueryVars>(
    DECK_QUERY,
    { variables: { id: deckId }, skip: !isReady },
  );

  if (!isReady) {
    return null;
  }

  const deck = data?.deck;
  const isOwner = Boolean(deck && user && deck.authorId === user.id);

  return (
    <>
      <SiteHeader />
      <div className={styles.page}>
        <div className={styles.content}>
          <Link href="/decks" className={styles.backLink}>
            ← Back to my decks
          </Link>

          {loading && <p className={styles.status}>Loading deck…</p>}
          {error && (
            <p className={styles.statusError}>
              Couldn&apos;t load this deck — it may have been removed.
            </p>
          )}
          {deck && !isOwner && (
            <p className={styles.statusError}>
              You can only edit decks you created.
            </p>
          )}

          {deck && isOwner && (
            <>
              <h1 className={styles.heading}>Edit deck</h1>
              <DeckForm
                mode="edit"
                deckId={deck.id}
                initial={{
                  title: deck.title,
                  description: deck.description,
                  coverUrl: deck.coverUrl,
                  categoryId: deck.category.id,
                  difficulty: deck.difficulty,
                }}
              />
              <FlashcardEditor deckId={deck.id} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
