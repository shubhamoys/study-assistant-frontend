"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header/site-header";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { DeckForm } from "../deck-form/deck-form";
import styles from "./create-deck-page.module.scss";

export function CreateDeckPage() {
  const { isReady } = useRequireAuth();

  if (!isReady) {
    return null;
  }

  return (
    <>
      <SiteHeader />
      <div className={styles.page}>
        <div className={styles.content}>
          <Link href="/decks" className={styles.backLink}>
            ← Back to my decks
          </Link>
          <h1 className={styles.heading}>Create deck</h1>
          <DeckForm mode="create" />
        </div>
      </div>
    </>
  );
}
