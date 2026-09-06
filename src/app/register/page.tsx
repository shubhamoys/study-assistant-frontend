import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo/logo";
import { RegisterForm } from "@/features/auth/register-form/register-form";
import styles from "@/features/auth/auth-form.module.scss";

export const metadata: Metadata = {
  title: "Create your account — StudyLoop",
};

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.homeLink} aria-label="StudyLoop home">
        <Logo />
      </Link>
      <RegisterForm />
    </div>
  );
}
