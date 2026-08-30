"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/use-auth";
import styles from "./main-nav.module.scss";

// Account isn't here — it's reached via the profile menu in SiteHeader
// (avatar → dropdown → "Account settings"), not a top-level nav link.
export const NAV_LINKS = [
  { href: "/store", label: "Store" },
  { href: "/library", label: "Library" },
];

/** Store/Library nav — only rendered once a user is signed in. Desktop inline row; SiteHeader's mobile menu renders the same NAV_LINKS as a dropdown instead. */
export function MainNav() {
  const pathname = usePathname();
  const { hydrated, isAuthenticated } = useAuth();

  if (!hydrated || !isAuthenticated) {
    return null;
  }

  return (
    <nav className={styles.nav} aria-label="Main">
      {NAV_LINKS.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.link} ${isActive ? styles.linkActive : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
