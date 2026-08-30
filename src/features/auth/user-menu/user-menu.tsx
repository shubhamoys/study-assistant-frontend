"use client";

import Link from "next/link";
import { CaretDown, Gear, SignOut } from "@phosphor-icons/react";
import { Avatar } from "@/components/avatar/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../use-auth";
import { useLogout } from "../use-logout";
import styles from "./user-menu.module.scss";

/**
 * The signed-in header entry point on desktop: avatar → dropdown with name /
 * account settings / log out. Replaces the old "Signed in as <email>" text +
 * separate log-out button. Hidden below the mobile breakpoint — see
 * MobileNavDrawer, which has its own copy of these same actions.
 */
export function UserMenu() {
  const { user } = useAuth();
  const logout = useLogout();

  if (!user) return null;

  const name = user.displayName ?? user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={styles.trigger} aria-label="Account menu">
        <Avatar avatarUrl={user.avatarUrl} label={name} size="sm" />
        <CaretDown size={12} weight="bold" className={styles.caret} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className={styles.label}>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">
            <Gear size={16} weight="bold" />
            Account settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void logout()}>
          <SignOut size={16} weight="bold" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
