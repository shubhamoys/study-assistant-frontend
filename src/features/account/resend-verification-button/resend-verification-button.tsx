"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import {
  RESEND_VERIFICATION_EMAIL_MUTATION,
  type ResendVerificationEmailMutationData,
} from "@/features/auth/graphql";
import styles from "../account-view/account-view.module.scss";

// Mirrors RESEND_VERIFICATION_COOLDOWN_MS in the backend's auth.service.ts —
// the backend is the actual enforcement, this just drives the client-side
// countdown to match it.
const COOLDOWN_MS = 2 * 60 * 1000;

function formatCountdown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

interface ResendVerificationButtonProps {
  /** ISO timestamp of the last resend, from the server — restores the cooldown countdown across a page refresh instead of resetting it. */
  verificationEmailSentAt: string | null;
}

/** Standalone action button inside the "email not verified" banner — replaces sending people to the unrelated forgot-password flow just to trigger a new email. */
export function ResendVerificationButton({
  verificationEmailSentAt,
}: ResendVerificationButtonProps) {
  const initialCooldownEndsAt = verificationEmailSentAt
    ? new Date(verificationEmailSentAt).getTime() + COOLDOWN_MS
    : null;
  const [cooldownEndsAt, setCooldownEndsAt] = useState(initialCooldownEndsAt);
  const [now, setNow] = useState(() => Date.now());

  // Only subscribes to the passage of time while a cooldown is active, and
  // stops itself once it ends — the setState calls all happen inside the
  // interval callback, never synchronously in the effect body.
  useEffect(() => {
    if (!cooldownEndsAt) return;
    const interval = setInterval(() => {
      const nextNow = Date.now();
      setNow(nextNow);
      if (nextNow >= cooldownEndsAt) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownEndsAt]);

  const remainingMs = cooldownEndsAt ? Math.max(0, cooldownEndsAt - now) : 0;

  const [resendMutation, { loading }] =
    useMutation<ResendVerificationEmailMutationData>(
      RESEND_VERIFICATION_EMAIL_MUTATION,
    );

  const onCooldown = remainingMs > 0;

  async function handleClick() {
    try {
      await resendMutation();
      setCooldownEndsAt(Date.now() + COOLDOWN_MS);
    } catch {
      // The backend enforces the same 2-minute cooldown independently (see
      // auth.service.ts) — a rejection here just leaves the button
      // clickable again, no dedicated error banner for a low-stakes retry.
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className={styles.verifyNoticeButton}
      onClick={() => void handleClick()}
      disabled={loading || onCooldown}
    >
      {onCooldown
        ? `Resend available in ${formatCountdown(remainingMs)}`
        : loading
          ? "Sending…"
          : "Resend verification email"}
    </Button>
  );
}
