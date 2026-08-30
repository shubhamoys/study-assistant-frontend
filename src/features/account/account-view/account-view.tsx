"use client";

import { useQuery } from "@apollo/client/react";
import { SiteHeader } from "@/components/site-header/site-header";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { setUser } from "@/features/auth/auth-slice";
import { useAppDispatch } from "@/lib/redux-hooks";
import { AvatarUploader } from "../avatar-uploader/avatar-uploader";
import { ChangePasswordForm } from "../change-password-form/change-password-form";
import { ACCOUNT_QUERY, type AccountQueryData } from "../graphql";
import { ProfileForm } from "../profile-form/profile-form";
import { ResendVerificationButton } from "../resend-verification-button/resend-verification-button";
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
      dispatch(
        setUser({
          id: user.id,
          email: user.email,
          displayName,
          avatarUrl: user.avatarUrl,
        }),
      );
    }
  }

  function handleAvatarUploaded(avatarUrl: string) {
    if (user) {
      dispatch(
        setUser({
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          avatarUrl,
        }),
      );
    }
    void refetch();
  }

  return (
    <>
      <SiteHeader />
      <div className={styles.page}>
        {loading && !data && <p className={styles.status}>Loading…</p>}

        {user && (
          <>
            {!user.isEmailVerified && (
              <div className={styles.verifyNotice} role="status">
                <span className={styles.verifyNoticeBadge} aria-hidden="true">
                  !
                </span>
                <div className={styles.verifyNoticeBody}>
                  <span>
                    Your email isn&apos;t verified yet. Check your inbox for
                    the link we sent when you registered.
                  </span>
                  <ResendVerificationButton
                    verificationEmailSentAt={user.verificationEmailSentAt}
                  />
                </div>
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
    </>
  );
}
