"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FORGOT_PASSWORD_MUTATION,
  type ForgotPasswordMutationData,
  type ForgotPasswordMutationVars,
} from "../graphql";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas";
import styles from "../auth-form.module.scss";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [forgotPasswordMutation] = useMutation<
    ForgotPasswordMutationData,
    ForgotPasswordMutationVars
  >(FORGOT_PASSWORD_MUTATION);

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      await forgotPasswordMutation({ variables: { email: values.email } });
    } finally {
      // The mutation always resolves true (the backend never reveals
      // whether the email exists) — show the same success state either way.
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className={styles.card}>
        <header>
          <span className={styles.eyebrow}>Check your email</span>
          <h1 className={styles.heading}>Reset link sent.</h1>
          <p className={styles.subheading}>
            If an account exists for that email, we&apos;ve sent a link to
            reset your password. It expires in 1 hour.
          </p>
        </header>
        <p className={styles.footer}>
          <Link href="/login" className={styles.footerLink}>
            Back to log in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <header>
        <span className={styles.eyebrow}>Forgot password</span>
        <h1 className={styles.heading}>Let&apos;s get you back in.</h1>
        <p className={styles.subheading}>
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </p>
      </header>

      <form
        className={`${styles.fields} index-card`}
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        noValidate
      >
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <span className={styles.fieldError}>{errors.email.message}</span>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p className={styles.footer}>
        Remembered it?{" "}
        <Link href="/login" className={styles.footerLink}>
          Log in
        </Link>
      </p>
    </div>
  );
}
