"use client";

import { useState } from "react";
import { Star, StarHalf } from "@phosphor-icons/react";
import styles from "./star-rating.module.scss";

interface StarRatingProps {
  /** 0-5, may be fractional (e.g. an average) when read-only. */
  value: number;
  /** Number of ratings behind the average — shown as "(12)" when provided. Read-only mode only. */
  count?: number;
  /** Presence makes this interactive (click a star to set 1-5); omit for a read-only display. */
  onChange?: (rating: number) => void;
  size?: number;
}

/**
 * One component, two modes — read-only (deck cards, deck detail, review
 * list items) and interactive (the review form). Uses --brand-yellow for
 * filled stars, never the --rating-* tokens, which UI_UX_DESIGN.md reserves
 * exclusively for the four FSRS study ratings.
 */
export function StarRating({ value, count, onChange, size = 16 }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const interactive = Boolean(onChange);
  const displayValue = interactive && hovered !== null ? hovered : value;

  if (!interactive) {
    return (
      <span className={styles.wrap} aria-label={`Rated ${value.toFixed(1)} out of 5`}>
        <span className={styles.stars} aria-hidden="true">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} star={star} value={displayValue} size={size} />
          ))}
        </span>
        {count !== undefined && <span className={styles.count}>({count})</span>}
      </span>
    );
  }

  return (
    <span
      className={styles.wrap}
      role="radiogroup"
      aria-label="Rating"
      onMouseLeave={() => setHovered(null)}
    >
      <span className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            className={styles.starButton}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange?.(star)}
          >
            <StarIcon star={star} value={displayValue} size={size} />
          </button>
        ))}
      </span>
    </span>
  );
}

function StarIcon({ star, value, size }: { star: number; value: number; size: number }) {
  if (value >= star) {
    return <Star size={size} weight="fill" className={styles.filled} />;
  }
  if (value >= star - 0.5) {
    return <StarHalf size={size} weight="fill" className={styles.filled} />;
  }
  return <Star size={size} weight="regular" className={styles.empty} />;
}
