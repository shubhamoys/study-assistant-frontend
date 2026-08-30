"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/password-input/password-input";
import {
  RESET_PASSWORD_MUTATION,
  type ResetPasswordMutationData,
  type ResetPasswordMutationVars,
} from "../graphql";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../schemas";
import styles from "../auth-form.module.scss";

function getResetPasswordErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    const code = error.errors[0]?.extensions?.code;
    if (code === "BAD_REQUEST") {
      return "This reset link is invalid or has expired. Request a new one below.";
    }
  }
  return "Something went wrong. Please try again.";
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [succeeded, setSucceeded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [resetPasswordMutation, { error }] = useMutation<
    ResetPasswordMutationData,
    ResetPasswordMutationVars
  >(RESET_PASSWORD_MUTATION);

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) return;
    try {
      await resetPasswordMutation({
        variables: { input: { token, newPassword: values.newPassword } },
      });
      setSucceeded(true);
    } catch {
      // Surfaced via the reactive `error` state below.
    }
  }

  if (!token) {
    return (
      <div className={styles.card}>
        <header>
          <span className={styles.eyebrow}>Reset password</span>
          <h1 className={styles.heading}>This link is missing a token.</h1>
          <p className={styles.subheading}>
            Request a new password reset link and use it directly from your
            email.
          </p>
        </header>
        <p className={styles.footer}>
          <Link href="/forgot-password" className={styles.footerLink}>
            Request a new link
          </Link>
        </p>
      </div>
    );
  }

  if (succeeded) {
    return (
      <div className={styles.card}>
        <header>
          <span className={styles.eyebrow}>Reset password</span>
          <h1 className={styles.heading}>Password updated.</h1>
          <p className={styles.subheading}>
            You&apos;ve been logged out everywhere for safety — log in again
            with your new password.
          </p>
        </header>
        <Button size="lg" className={styles.submitButton} onClick={() => router.push("/login")}>
          Go to log in
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <header>
        <span className={styles.eyebrow}>Reset password</span>
        <h1 className={styles.heading}>Choose a new password.</h1>
      </header>

      <form
        className={`${styles.fields} index-card`}
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        noValidate
      >
        {error && (
          <div className={styles.formError} role="alert">
            <span className={styles.formErrorBadge} aria-hidden="true">
              !
            </span>
            <span>{getResetPasswordErrorMessage(error)}</span>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="newPassword">
            New password
          </label>
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={Boolean(errors.newPassword)}
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <span className={styles.fieldError}>
              {errors.newPassword.message}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="confirmPassword">
            Confirm new password
          </label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className={styles.fieldError}>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resetting…" : "Reset password"}
        </Button>
      </form>
    </div>
  );
}
