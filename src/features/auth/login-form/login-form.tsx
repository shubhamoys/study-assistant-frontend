"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input/password-input";
import { useAppDispatch } from "@/lib/redux-hooks";
import { setCredentials } from "../auth-slice";
import { getAuthErrorMessage } from "../get-auth-error-message";
import {
  LOGIN_MUTATION,
  type LoginMutationData,
  type LoginMutationVars,
} from "../graphql";
import { loginSchema, type LoginFormValues } from "../schemas";
import { useRedirectIfAuthenticated } from "../use-redirect-if-authenticated";
import styles from "../auth-form.module.scss";

export function LoginForm() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const showAuthRequiredNotice = searchParams.get("reason") === "auth-required";
  const redirectParam = searchParams.get("redirect");
  // Only ever follow a same-origin path — never redirect off-site based on a
  // query param (open-redirect guard), and never to "//host" either.
  const redirectTo =
    redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/";

  // Single source of truth for "where does a signed-in visitor on this page
  // go": covers both a visitor who was already logged in when they landed
  // here, and one who just submitted this form (dispatch below flips
  // `isAuthenticated`, which this effect reacts to). Doing the post-login
  // redirect here too (instead of also calling `router.push` in onSubmit)
  // avoids a race between two separate navigations landing on different URLs.
  useRedirectIfAuthenticated(redirectTo);

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
            accessToken: data.login.accessToken,
            refreshToken: data.login.refreshToken,
            user: data.login.user,
          }),
        );
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
          <div className={styles.fieldLabelRow}>
            <label className={styles.fieldLabel} htmlFor="password">
              Password
            </label>
            <Link href="/forgot-password" className={styles.inlineLink}>
              Forgot password?
            </Link>
          </div>
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

      {showAuthRequiredNotice && (
        <div className={styles.formNotice} role="status">
          <span className={styles.formNoticeBadge} aria-hidden="true">
            i
          </span>
          <span>You need to log in to continue.</span>
        </div>
      )}
    </div>
  );
}
