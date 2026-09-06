import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/logo/logo";
import { ResetPasswordForm } from "@/features/auth/reset-password-form/reset-password-form";
import styles from "@/features/auth/auth-form.module.scss";

export const metadata: Metadata = {
  title: "Reset password — StudyLoop",
};

export default function ResetPasswordPage() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.homeLink} aria-label="StudyLoop home">
        <Logo />
      </Link>
      {/* ResetPasswordForm reads the `token` query param (useSearchParams),
          which Next requires a Suspense boundary for during prerendering. */}
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
