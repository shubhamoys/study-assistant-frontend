import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailStatus } from "@/features/auth/verify-email-status";
import styles from "@/features/auth/auth-form.module.scss";

export const metadata: Metadata = {
  title: "Verify email — AI Study Assistant",
};

export default function VerifyEmailPage() {
  return (
    <div className={styles.page}>
      {/* VerifyEmailStatus reads the `token` query param (useSearchParams),
          which Next requires a Suspense boundary for during prerendering. */}
      <Suspense>
        <VerifyEmailStatus />
      </Suspense>
    </div>
  );
}
