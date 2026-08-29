"use client";

import Link from "next/link";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/redux-hooks";
import { getRefreshToken } from "@/lib/auth-token";
import { clearCredentials } from "./auth-slice";
import {
  LOGOUT_MUTATION,
  type LogoutMutationData,
  type LogoutMutationVars,
} from "./graphql";
import { useAuth } from "./use-auth";
import styles from "./auth-status.module.scss";

export function AuthStatus() {
  const dispatch = useAppDispatch();
  const { user, hydrated, isAuthenticated } = useAuth();
  const [logoutMutation, { loading }] = useMutation<
    LogoutMutationData,
    LogoutMutationVars
  >(LOGOUT_MUTATION);

  // Avoid a flash of the wrong state before localStorage has been read.
  if (!hydrated) {
    return <div className={styles.wrap} aria-hidden="true" />;
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.wrap}>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">Log in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/register">Create account</Link>
        </Button>
      </div>
    );
  }

  async function handleLogout() {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await logoutMutation({ variables: { refreshToken } });
      }
    } finally {
      // Always clear local state, even if the server call failed (offline,
      // token already expired, etc.) — the user's intent to log out locally
      // still wins.
      dispatch(clearCredentials());
    }
  }

  return (
    <div className={styles.wrap}>
      <span className={styles.welcome}>
        Signed in as <strong>{user?.displayName ?? user?.email}</strong>
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => void handleLogout()}
        disabled={loading}
      >
        {loading ? "Logging out…" : "Log out"}
      </Button>
    </div>
  );
}
