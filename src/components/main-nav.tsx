"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/use-auth";
import styles from "./main-nav.module.scss";

const LINKS = [
  { href: "/store", label: "Store" },
  { href: "/library", label: "Library" },
  { href: "/account", label: "Account" },
];

/** Store/Library nav — only rendered once a user is signed in. */
export function MainNav() {
  const pathname = usePathname();
  const { hydrated, isAuthenticated } = useAuth();

  if (!hydrated || !isAuthenticated) {
    return null;
  }

  return (
    <nav className={styles.nav} aria-label="Main">
      {LINKS.map((link) => {
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
