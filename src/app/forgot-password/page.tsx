import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo/logo";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form/forgot-password-form";
import styles from "@/features/auth/auth-form.module.scss";

export const metadata: Metadata = {
  title: "Forgot password — StudyLoop",
};

export default function ForgotPasswordPage() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.homeLink} aria-label="StudyLoop home">
        <Logo />
      </Link>
      <ForgotPasswordForm />
    </div>
  );
}
