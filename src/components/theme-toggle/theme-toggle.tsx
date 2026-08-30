"use client";

import { MoonStars, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useHasMounted } from "@/hooks/use-has-mounted";

interface ThemeToggleProps {
  /** "icon" (default): the compact header button. "menu-item": a bare, unstyled button rendering an icon + label row — the caller (MobileNavDrawer) supplies `className` for the actual look, matching its other rows. */
  variant?: "icon" | "menu-item";
  className?: string;
}

export function ThemeToggle({
  variant = "icon",
  className,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();

  // Avoid rendering theme-dependent UI until after hydration — resolvedTheme
  // is unknown on the server.
  if (!mounted) {
    return variant === "menu-item" ? (
      <button type="button" className={className} disabled />
    ) : (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        className={className}
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";
  const toggle = () => setTheme(isDark ? "light" : "dark");

  if (variant === "menu-item") {
    return (
      <button
        type="button"
        className={className}
        aria-pressed={isDark}
        onClick={toggle}
      >
        {isDark ? (
          <Sun size={16} weight="bold" />
        ) : (
          <MoonStars size={16} weight="bold" />
        )}
        {label}
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      aria-pressed={isDark}
      onClick={toggle}
      className={className}
    >
      {isDark ? <Sun size={20} weight="bold" /> : <MoonStars size={20} weight="bold" />}
    </Button>
  );
}
