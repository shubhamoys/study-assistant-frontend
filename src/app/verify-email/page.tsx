import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/logo/logo";
import { VerifyEmailStatus } from "@/features/auth/verify-email-status/verify-email-status";
import styles from "@/features/auth/auth-form.module.scss";

export const metadata: Metadata = {
  title: "Verify email — StudyLoop",
};

export default function VerifyEmailPage() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.homeLink} aria-label="StudyLoop home">
        <Logo />
      </Link>
      {/* VerifyEmailStatus reads the `token` query param (useSearchParams),
          which Next requires a Suspense boundary for during prerendering. */}
      <Suspense>
        <VerifyEmailStatus />
      </Suspense>
    </div>
  );
}
