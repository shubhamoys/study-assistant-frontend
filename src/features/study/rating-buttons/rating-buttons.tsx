"use client";

import type { Rating, RatingPreview } from "../graphql";
import styles from "./rating-buttons.module.scss";

interface RatingButtonsProps {
  again: RatingPreview;
  hard: RatingPreview;
  good: RatingPreview;
  easy: RatingPreview;
  disabled: boolean;
  onRate: (rating: Rating) => void;
}

const RATINGS: { rating: Rating; label: string; variant: string }[] = [
  { rating: "AGAIN", label: "Again", variant: "again" },
  { rating: "HARD", label: "Hard", variant: "hard" },
  { rating: "GOOD", label: "Good", variant: "good" },
  { rating: "EASY", label: "Easy", variant: "easy" },
];

export function RatingButtons({
  again,
  hard,
  good,
  easy,
  disabled,
  onRate,
}: RatingButtonsProps) {
  const previews: Record<Rating, RatingPreview> = { AGAIN: again, HARD: hard, GOOD: good, EASY: easy };

  return (
    <div className={styles.row}>
      {RATINGS.map(({ rating, label, variant }) => (
        <button
          key={rating}
          type="button"
          className={styles.button}
          data-variant={variant}
          disabled={disabled}
          onClick={() => onRate(rating)}
        >
          <span className={styles.label}>{label}</span>
          <span className={styles.interval}>{previews[rating].intervalLabel}</span>
        </button>
      ))}
    </div>
  );
}
