"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  VERIFY_EMAIL_MUTATION,
  type VerifyEmailMutationData,
  type VerifyEmailMutationVars,
} from "../graphql";
import styles from "../auth-form.module.scss";

type Status = "verifying" | "success" | "error" | "missing-token";

export function VerifyEmailStatus() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>(
    token ? "verifying" : "missing-token",
  );
  // Dev StrictMode double-invokes effects — a verification token is
  // single-use server-side, so a second call would otherwise show a
  // misleading "invalid" result right after a real success.
  const attemptedRef = useRef(false);

  const [verifyEmailMutation] = useMutation<
    VerifyEmailMutationData,
    VerifyEmailMutationVars
  >(VERIFY_EMAIL_MUTATION);

  useEffect(() => {
    if (!token || attemptedRef.current) return;
    attemptedRef.current = true;

    verifyEmailMutation({ variables: { token } })
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token, verifyEmailMutation]);

  return (
    <div className={styles.card}>
      <header>
        <span className={styles.eyebrow}>Verify email</span>
        {status === "verifying" && (
          <h1 className={styles.heading}>Verifying…</h1>
        )}
        {status === "success" && (
          <h1 className={styles.heading}>Email verified.</h1>
        )}
        {status === "error" && (
          <>
            <h1 className={styles.heading}>This link didn&apos;t work.</h1>
            <p className={styles.subheading}>
              It may have already been used, or wasn&apos;t copied correctly.
            </p>
          </>
        )}
        {status === "missing-token" && (
          <>
            <h1 className={styles.heading}>This link is missing a token.</h1>
            <p className={styles.subheading}>
              Open the verification link from your email directly.
            </p>
          </>
        )}
      </header>

      {status !== "verifying" && (
        <p className={styles.footer}>
          <Link href="/account" className={styles.footerLink}>
            Go to your account
          </Link>
        </p>
      )}
    </div>
  );
}
