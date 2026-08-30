import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form/forgot-password-form";
import styles from "@/features/auth/auth-form.module.scss";

export const metadata: Metadata = {
  title: "Forgot password — AI Study Assistant",
};

export default function ForgotPasswordPage() {
  return (
    <div className={styles.page}>
      <ForgotPasswordForm />
    </div>
  );
}
