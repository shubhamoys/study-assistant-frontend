"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { AuthStatus } from "@/features/auth/auth-status";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { DeckCard } from "@/features/store/deck-card";
import { MY_LIBRARY_QUERY, type MyLibraryQueryData } from "./graphql";
import { RemoveFromLibraryButton } from "./remove-from-library-button";
import styles from "./library-browser.module.scss";

export function LibraryBrowser() {
  const { isReady } = useRequireAuth();
  const { data, loading, error } = useQuery<MyLibraryQueryData>(
    MY_LIBRARY_QUERY,
    { skip: !isReady },
  );

  if (!isReady) {
    return null;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <span className="stamp">Library</span>
          <div className={styles.headerActions}>
            <AuthStatus />
            <ThemeToggle />
          </div>
        </div>
        <MainNav />
        <h1 className={styles.heading}>Your library</h1>
        <p className={styles.subheading}>Decks you&apos;ve saved, ready to study.</p>
      </header>

      {loading && <p className={styles.status}>Loading your library…</p>}
      {error && (
        <p className={styles.statusError}>
          Couldn&apos;t load your library — is the backend running?
        </p>
      )}

      {data && data.myLibrary.length === 0 && (
        <div className={`${styles.empty} index-card-dashed`}>
          <p>Your library is empty.</p>
          <Link href="/store" className={styles.emptyLink}>
            Browse the store →
          </Link>
        </div>
      )}

      <div className={styles.grid}>
        {data?.myLibrary.map((entry) => (
          <DeckCard
            key={entry.id}
            deck={entry.deck}
            action={
              <div className={styles.cardActions}>
                <Button asChild size="sm">
                  <Link href={`/study/${entry.deck.id}`}>Study</Link>
                </Button>
                <RemoveFromLibraryButton deckId={entry.deck.id} />
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}
