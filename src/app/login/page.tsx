import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/login-form";
import styles from "@/features/auth/auth-form.module.scss";

export const metadata: Metadata = {
  title: "Log in — AI Study Assistant",
};

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <LoginForm />
    </div>
  );
}
