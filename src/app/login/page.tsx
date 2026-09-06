import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/logo/logo";
import { LoginForm } from "@/features/auth/login-form/login-form";
import styles from "@/features/auth/auth-form.module.scss";

export const metadata: Metadata = {
  title: "Log in — StudyLoop",
};

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.homeLink} aria-label="StudyLoop home">
        <Logo />
      </Link>
      {/* LoginForm reads the `reason`/`redirect` query params (useSearchParams),
          which Next requires a Suspense boundary for during prerendering. */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
