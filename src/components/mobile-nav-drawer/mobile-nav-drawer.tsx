"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Books, Gear, List, SignOut, Storefront } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle/theme-toggle";
import { NAV_LINKS } from "../main-nav/main-nav";
import { useLogout } from "@/features/auth/use-logout";
import styles from "./mobile-nav-drawer.module.scss";

const NAV_ICONS: Record<string, React.ReactNode> = {
  "/store": <Storefront size={18} weight="bold" />,
  "/library": <Books size={18} weight="bold" />,
};

/**
 * The mobile (< 768px) equivalent of the desktop header's inline nav +
 * theme toggle + avatar menu, all folded into one drawer — there's no room
 * for all of that inline at phone widths. Only rendered when signed in
 * (same as MainNav/UserMenu), so no avatar/photo shown here — the trigger
 * is a plain hamburger icon, not the user's avatar.
 */
export function MobileNavDrawer() {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu">
          <List size={20} weight="bold" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className={styles.content}>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <nav className={styles.list} aria-label="Mobile">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {NAV_ICONS[link.href]}
                  {link.label}
                </Link>
              </SheetClose>
            );
          })}

          <SheetClose asChild>
            <Link
              href="/account"
              className={`${styles.item} ${pathname.startsWith("/account") ? styles.itemActive : ""}`}
              aria-current={pathname.startsWith("/account") ? "page" : undefined}
            >
              <Gear size={18} weight="bold" />
              Account settings
            </Link>
          </SheetClose>

          <div className={styles.separator} />

          <ThemeToggle variant="menu-item" className={styles.item} />

          <SheetClose asChild>
            <button
              type="button"
              className={styles.item}
              onClick={() => void logout()}
            >
              <SignOut size={18} weight="bold" />
              Log out
            </button>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
