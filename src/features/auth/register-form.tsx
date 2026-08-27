"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { useAppDispatch } from "@/lib/redux-hooks";
import { setCredentials } from "./auth-slice";
import { getAuthErrorMessage } from "./get-auth-error-message";
import {
  REGISTER_MUTATION,
  type RegisterMutationData,
  type RegisterMutationVars,
} from "./graphql";
import { registerSchema, type RegisterFormValues } from "./schemas";
import { useRedirectIfAuthenticated } from "./use-redirect-if-authenticated";
import styles from "./auth-form.module.scss";

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const [registerMutation, { error }] = useMutation<
    RegisterMutationData,
    RegisterMutationVars
  >(REGISTER_MUTATION);

  async function onSubmit(values: RegisterFormValues) {
    try {
      // `confirmPassword` is client-only (see schemas.ts) — never sent to the API.
      const { data } = await registerMutation({
        variables: {
          input: { email: values.email, password: values.password },
        },
      });
      if (data) {
        dispatch(
          setCredentials({
            token: data.register.accessToken,
            user: data.register.user,
          }),
        );
        router.push("/");
      }
    } catch {
      // Already captured in `error` above (useMutation's reactive state) and
      // rendered as the banner below — nothing further to do with the
      // rejection itself, just don't let it go unhandled.
    }
  }

  return (
    <div className={styles.card}>
      <header>
        <span className={styles.eyebrow}>New account</span>
        <h1 className={styles.heading}>Start your shelf.</h1>
        <p className={styles.subheading}>
          Register to build a library and start studying.
        </p>
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
            <span>{getAuthErrorMessage(error)}</span>
          </div>
        )}

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

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="password">
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password && (
            <span className={styles.fieldError}>
              {errors.password.message}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="confirmPassword">
            Confirm password
          </label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your password"
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
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className={styles.footer}>
        Already have an account?{" "}
        <Link href="/login" className={styles.footerLink}>
          Log in
        </Link>
      </p>
    </div>
  );
}
