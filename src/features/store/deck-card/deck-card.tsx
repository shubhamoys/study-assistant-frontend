import Link from "next/link";
import type { ReactNode } from "react";
import type { DeckSummary } from "../graphql";
import styles from "./deck-card.module.scss";

const DIFFICULTY_LABEL: Record<DeckSummary["difficulty"], string> = {
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

      <div className={styles.cover} data-difficulty={deck.difficulty}>
        <span className={styles.coverInitial} aria-hidden="true">
          {deck.title.charAt(0).toUpperCase()}
        </span>
      </div>

      <div className={styles.body}>
        <span className="tag">{deck.category.name}</span>
        <h3 className={styles.title}>{deck.title}</h3>
        {deck.description && (
          <p className={styles.description}>{deck.description}</p>
        )}
        <div className={styles.meta}>
          <span>{DIFFICULTY_LABEL[deck.difficulty]}</span>
          <span aria-hidden="true">·</span>
          <span>
            {deck.cardCount} {deck.cardCount === 1 ? "card" : "cards"}
          </span>
        </div>
      </div>

      {action && <div className={styles.action}>{action}</div>}
    </article>
  );
}
