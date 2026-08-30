import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/register-form/register-form";
import styles from "@/features/auth/auth-form.module.scss";

export const metadata: Metadata = {
  title: "Create your account — AI Study Assistant",
};

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <RegisterForm />
    </div>
  );
}
