"use client";

import Link from "next/link";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header/site-header";
import { useAuth } from "@/features/auth/use-auth";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { downloadDeckExport } from "@/lib/deck-export";
import {
  DECK_FLASHCARDS_QUERY,
  DECK_QUERY,
  type DeckFlashcardsQueryData,
  type DeckFlashcardsQueryVars,
  type DeckQueryData,
  type DeckQueryVars,
} from "@/features/store/graphql";
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
  const [loadFlashcards, { loading: exporting }] = useLazyQuery<
    DeckFlashcardsQueryData,
    DeckFlashcardsQueryVars
  >(DECK_FLASHCARDS_QUERY, { fetchPolicy: "network-only" });

  if (!isReady) {
    return null;
  }

  const deck = data?.deck;
  const isOwner = Boolean(deck && user && deck.authorId === user.id);

  async function handleExport() {
    if (!deck) return;
    const { data: cardsData } = await loadFlashcards({
      variables: { deckId: deck.id },
    });
    downloadDeckExport(deck, cardsData?.deckFlashcards ?? []);
  }

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
              <div className={styles.headingRow}>
                <h1 className={styles.heading}>Edit deck</h1>
                <div className={styles.headingActions}>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={exporting}
                    onClick={() => void handleExport()}
                  >
                    {exporting ? "Exporting…" : "Export"}
                  </Button>
                  <Link href={`/store/${deck.id}`} className={styles.viewLink}>
                    View deck →
                  </Link>
                </div>
              </div>
              <DeckForm
                mode="edit"
                deckId={deck.id}
                initial={{
                  title: deck.title,
                  description: deck.description,
                  coverUrl: deck.coverUrl,
                  categoryId: deck.category?.id ?? null,
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
