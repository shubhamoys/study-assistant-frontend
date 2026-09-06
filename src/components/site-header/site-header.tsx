"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo/logo";
import { ThemeToggle } from "@/components/theme-toggle/theme-toggle";
import { MainNav } from "@/components/main-nav/main-nav";
import { MobileNavDrawer } from "@/components/mobile-nav-drawer/mobile-nav-drawer";
import { useAuth } from "@/features/auth/use-auth";
import { UserMenu } from "@/features/auth/user-menu/user-menu";
import styles from "./site-header.module.scss";

/**
 * The one header every page renders (not hoisted into the root layout —
 * the five standalone auth-flow pages, login/register/forgot-password/
 * reset-password/verify-email, deliberately have no header at all).
 * Identical output on every page it does appear on, so nothing about it
 * ever shifts between routes — see the mobile-layout-shift fix this
 * replaced (the old per-page "stamp" badge whose width followed its text).
 *
 * Below the mobile breakpoint, the desktop nav/theme-toggle/avatar-menu
 * all fold into MobileNavDrawer instead (no room for all of it inline at
 * phone widths, and no avatar shown there — see that component).
 */
export function SiteHeader() {
  const { hydrated, isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={isAuthenticated ? "/library" : "/"} className={styles.brand}>
          <Logo />
        </Link>

        <div className={styles.desktopNav}>
          <MainNav />
        </div>

        <div className={styles.actions}>
          {hydrated && isAuthenticated && (
            <>
              <div className={styles.desktopOnly}>
                <ThemeToggle />
                <UserMenu />
              </div>
              <div className={styles.mobileOnly}>
                <MobileNavDrawer />
              </div>
            </>
          )}

          {hydrated && !isAuthenticated && (
            <div className={styles.guestActions}>
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Create account</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
