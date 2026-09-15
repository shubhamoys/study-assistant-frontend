import { Button } from "@/components/ui/button";
import styles from "./owned-badge.module.scss";

/**
 * Shown in place of "Add to cart" once a paid deck is already owned (i.e.
 * purchased and sitting in the library) — mirrors AddToLibraryButton's
 * disabled "✓ In library" state for a free deck, so both "you already have
 * this" states look the same regardless of how the deck was acquired.
 */
export function OwnedBadge() {
  return (
    <Button variant="secondary" size="sm" disabled className={styles.owned}>
      ✓ Purchased
    </Button>
  );
}
