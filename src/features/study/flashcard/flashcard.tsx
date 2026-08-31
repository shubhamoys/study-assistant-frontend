"use client";

import { useEffect, useRef, useState } from "react";
import { MarkdownContent } from "@/components/markdown-content/markdown-content";
import styles from "./flashcard.module.scss";

interface FlashcardProps {
  front: string;
  back: string;
  revealed: boolean;
}

// UI_UX_DESIGN.md §6.5: scale to 0.95, swap content, scale back — 150ms total,
// content swaps at the midpoint (when the card is smallest), not a 3D rotation.
const SETTLE_MS = 150;

/**
 * Caller must remount this on card change (`key={cardId}`) — its internal
 * `displaySide` intentionally only reacts to `revealed` toggling within the
 * same card's lifetime, not to a new card loading in; a `key` change resets
 * everything for free instead of needing extra "is this a new card" logic.
 */
export function Flashcard({ front, back, revealed }: FlashcardProps) {
  const [displaySide, setDisplaySide] = useState<"front" | "back">("front");
  const [isSettling, setIsSettling] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsSettling(true);
    const swapTimer = setTimeout(() => {
      setDisplaySide(revealed ? "back" : "front");
    }, SETTLE_MS / 2);
    const settleTimer = setTimeout(() => {
      setIsSettling(false);
    }, SETTLE_MS);
    return () => {
      clearTimeout(swapTimer);
      clearTimeout(settleTimer);
    };
  }, [revealed]);

  return (
    <div className={`${styles.card} ${isSettling ? styles.settling : ""}`}>
      <span className={styles.label}>
        {displaySide === "back" ? "Answer" : "Question"}
      </span>
      <MarkdownContent className={styles.content}>
        {displaySide === "back" ? back : front}
      </MarkdownContent>
    </div>
  );
}
