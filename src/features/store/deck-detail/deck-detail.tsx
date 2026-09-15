"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/markdown-content/markdown-content";
import { SiteHeader } from "@/components/site-header/site-header";
import { StarRating } from "@/components/star-rating/star-rating";
import { useAuth } from "@/features/auth/use-auth";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { AddToLibraryButton } from "@/features/library/add-to-library-button/add-to-library-button";
import { MY_LIBRARY_QUERY, type MyLibraryQueryData } from "@/features/library/graphql";
import { AddToCartButton } from "@/features/cart/add-to-cart-button/add-to-cart-button";
import { MY_CART_QUERY, type MyCartQueryData } from "@/features/cart/graphql";
import { formatPrice } from "@/lib/format-price";
import { DeckReviews } from "../deck-reviews/deck-reviews";
import { OwnedBadge } from "../owned-badge/owned-badge";
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
  const { user } = useAuth();
  const { data, loading, error } = useQuery<DeckQueryData, DeckQueryVars>(
    DECK_QUERY,
    { variables: { id: deckId }, skip: !isReady },
  );
  const { data: libraryData } = useQuery<MyLibraryQueryData>(MY_LIBRARY_QUERY, {
    skip: !isReady,
  });
  const { data: cartData } = useQuery<MyCartQueryData>(MY_CART_QUERY, {
    skip: !isReady,
  });

  if (!isReady) {
    return null;
  }

  const inLibrary = Boolean(
    libraryData?.myLibrary.some((entry) => entry.deck.id === deckId),
  );
  const inCart = Boolean(
    cartData?.myCart.some((item) => item.deck.id === deckId),
  );
  const isOwner = Boolean(data && user && data.deck.authorId === user.id);

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
              <span className="tag">
                {data.deck.category?.name ?? "Uncategorized"}
              </span>
              <h1 className={styles.title}>{data.deck.title}</h1>
              {data.deck.description && (
                <MarkdownContent className={styles.description}>
                  {data.deck.description}
                </MarkdownContent>
              )}

              <p className={styles.author}>By {data.deck.authorDisplayName}</p>

              <dl className={styles.stats}>
                {data.deck.difficulty && (
                  <div className={styles.stat}>
                    <dt>Difficulty</dt>
                    <dd>{DIFFICULTY_LABEL[data.deck.difficulty]}</dd>
                  </div>
                )}
                <div className={styles.stat}>
                  <dt>Cards</dt>
                  <dd>{data.deck.cardCount}</dd>
                </div>
                <div className={styles.stat}>
                  <dt>Study time</dt>
                  <dd>~{data.deck.estimatedStudyMinutes} min</dd>
                </div>
                <div className={styles.stat}>
                  <dt>Price</dt>
                  <dd>
                    {data.deck.isFree ? "Free" : formatPrice(data.deck.price)}
                  </dd>
                </div>
                <div className={styles.stat}>
                  <dt>Rating</dt>
                  <dd>
                    {data.deck.ratingCount > 0 ? (
                      <StarRating
                        value={data.deck.ratingAverage}
                        count={data.deck.ratingCount}
                        size={16}
                      />
                    ) : (
                      "No ratings yet"
                    )}
                  </dd>
                </div>
                <div className={styles.stat}>
                  <dt>Downloads</dt>
                  <dd>{data.deck.downloadsCount}</dd>
                </div>
              </dl>

              <div className={styles.actionRow}>
                {data.deck.isFree ? (
                  <AddToLibraryButton
                    deckId={data.deck.id}
                    inLibrary={inLibrary}
                  />
                ) : inLibrary ? (
                  <OwnedBadge />
                ) : (
                  <AddToCartButton deckId={data.deck.id} inCart={inCart} />
                )}
                {inLibrary && (
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/study/${data.deck.id}`}>Study</Link>
                  </Button>
                )}
                {isOwner && (
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/decks/${data.deck.id}/edit`}>Edit deck</Link>
                  </Button>
                )}
              </div>
            </article>
          )}

          {data && <DeckReviews deckId={data.deck.id} />}
        </div>
      </div>
    </>
  );
}
