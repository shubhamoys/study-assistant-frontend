import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/login-form/login-form";
import styles from "@/features/auth/auth-form.module.scss";

export const metadata: Metadata = {
  title: "Log in — AI Study Assistant",
};

export default function LoginPage() {
  return (
    <div className={styles.page}>
      {/* LoginForm reads the `reason`/`redirect` query params (useSearchParams),
          which Next requires a Suspense boundary for during prerendering. */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
