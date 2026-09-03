import Link from "next/link";
import type { ReactNode } from "react";
import { StarRating } from "@/components/star-rating/star-rating";
import { formatPrice } from "@/lib/format-price";
import type { DeckSummary } from "../graphql";
import styles from "./deck-card.module.scss";

const DIFFICULTY_LABEL: Record<
  NonNullable<DeckSummary["difficulty"]>,
  string
> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

interface DeckCardProps {
  deck: DeckSummary;
  /** Rendered bottom-right of the card — the caller owns the action (add to
   * library, remove from library, or nothing) so this component stays a
   * dumb, reusable summary card for both the Store grid and the Library grid. */
  action?: ReactNode;
}

export function DeckCard({ deck, action }: DeckCardProps) {
  return (
    <article className={`${styles.card} index-card`}>
      <Link href={`/store/${deck.id}`} className={styles.linkOverlay}>
        <span className={styles.visuallyHidden}>View {deck.title}</span>
      </Link>

      <div
        className={styles.cover}
        data-difficulty={deck.difficulty ?? undefined}
      >
        <span className={styles.coverInitial} aria-hidden="true">
          {deck.title.charAt(0).toUpperCase()}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.tags}>
          <span className="tag">
            {deck.category?.name ?? "Uncategorized"}
          </span>
          {!deck.isFree && (
            <span className={`tag ${styles.priceTag}`}>
              {formatPrice(deck.price)}
            </span>
          )}
        </div>
        <h3 className={styles.title}>{deck.title}</h3>
        {deck.description && (
          <p className={styles.description}>{deck.description}</p>
        )}
        <div className={styles.meta}>
          {deck.difficulty && (
            <>
              <span>{DIFFICULTY_LABEL[deck.difficulty]}</span>
              <span aria-hidden="true">·</span>
            </>
          )}
          <span>
            {deck.cardCount} {deck.cardCount === 1 ? "card" : "cards"}
          </span>
        </div>
        {deck.ratingCount > 0 && (
          <StarRating
            value={deck.ratingAverage}
            count={deck.ratingCount}
            size={13}
          />
        )}
      </div>

      {action && <div className={styles.action}>{action}</div>}
    </article>
  );
}
