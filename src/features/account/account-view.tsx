"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { MainNav } from "@/components/main-nav";
import { AuthStatus } from "@/features/auth/auth-status";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { setUser } from "@/features/auth/auth-slice";
import { useAppDispatch } from "@/lib/redux-hooks";
import { AvatarUploader } from "./avatar-uploader";
import { ChangePasswordForm } from "./change-password-form";
import { ACCOUNT_QUERY, type AccountQueryData } from "./graphql";
import { ProfileForm } from "./profile-form";
import styles from "./account-view.module.scss";

export function AccountView() {
  const { isReady } = useRequireAuth();
  const dispatch = useAppDispatch();

  const { data, loading, refetch } = useQuery<AccountQueryData>(
    ACCOUNT_QUERY,
    { skip: !isReady },
  );

  if (!isReady) {
    return null;
  }

  const user = data?.me;

  function handleProfileSaved(displayName: string) {
    if (user) {
      dispatch(setUser({ id: user.id, email: user.email, displayName }));
    }
  }

  function handleAvatarUploaded() {
    void refetch();
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <span className="stamp">Account</span>
          <div className={styles.headerActions}>
            <AuthStatus />
            <ThemeToggle />
          </div>
        </div>
        <MainNav />
      </header>

      {loading && !data && <p className={styles.status}>Loading…</p>}

      {user && (
        <>
          {!user.isEmailVerified && (
            <div className={styles.verifyNotice} role="status">
              <span className={styles.verifyNoticeBadge} aria-hidden="true">
                !
              </span>
              <span>
                Your email isn&apos;t verified yet. Check your inbox for the
                link we sent when you registered, or{" "}
                <Link href="/forgot-password" className={styles.verifyNoticeLink}>
                  request a new one
                </Link>
                .
              </span>
            </div>
          )}

          <section className={`${styles.section} index-card`}>
            <h2 className={styles.sectionTitle}>Profile</h2>
            <AvatarUploader
              avatarUrl={user.avatarUrl}
              displayName={user.displayName}
              email={user.email}
              onUploaded={handleAvatarUploaded}
            />
            <p className={styles.email}>{user.email}</p>
            <ProfileForm
              displayName={user.displayName}
              onSaved={handleProfileSaved}
            />
          </section>

          <ChangePasswordForm />
        </>
      )}
    </div>
  );
}
