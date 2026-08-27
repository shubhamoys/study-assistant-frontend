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
  LOGIN_MUTATION,
  type LoginMutationData,
  type LoginMutationVars,
} from "./graphql";
import { loginSchema, type LoginFormValues } from "./schemas";
import { useRedirectIfAuthenticated } from "./use-redirect-if-authenticated";
import styles from "./auth-form.module.scss";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [loginMutation, { error }] = useMutation<
    LoginMutationData,
    LoginMutationVars
  >(LOGIN_MUTATION);

  async function onSubmit(values: LoginFormValues) {
    try {
      const { data } = await loginMutation({ variables: { input: values } });
      if (data) {
        dispatch(
          setCredentials({
            token: data.login.accessToken,
            user: data.login.user,
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
        <span className={styles.eyebrow}>Welcome back</span>
        <h1 className={styles.heading}>Pick up where you left off.</h1>
        <p className={styles.subheading}>
          Log in to your library and continue studying.
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
            autoComplete="current-password"
            placeholder="Your password"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password && (
            <span className={styles.fieldError}>
              {errors.password.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className={styles.footer}>
        New here?{" "}
        <Link href="/register" className={styles.footerLink}>
          Create an account
        </Link>
      </p>
    </div>
  );
}
