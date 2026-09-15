import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header/site-header";
import styles from "./error-page.module.scss";

interface ErrorPageProps {
  /** A short stamp-style label, e.g. "404" or "Error" — purely decorative. */
  eyebrow: string;
  heading: string;
  message: string;
  children: ReactNode;
}

/** Shared full-page layout for not-found.tsx and error.tsx — a centered index-card matching the auth pages' visual language, with SiteHeader still present so there's always a way back to the rest of the app. */
export function ErrorPage({ eyebrow, heading, message, children }: ErrorPageProps) {
  return (
    <>
      <SiteHeader />
      <div className={styles.page}>
        <div className={`${styles.card} index-card`}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1 className={styles.heading}>{heading}</h1>
          <p className={styles.message}>{message}</p>
          <div className={styles.actions}>{children}</div>
        </div>
      </div>
    </>
  );
}
