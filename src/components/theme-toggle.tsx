"use client";

import { MoonStars, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useHasMounted } from "@/hooks/use-has-mounted";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();

  // Avoid rendering theme-dependent UI until after hydration — resolvedTheme
  // is unknown on the server.
  if (!mounted) {
    return <Button variant="ghost" size="icon" aria-label="Toggle theme" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun size={20} weight="bold" /> : <MoonStars size={20} weight="bold" />}
    </Button>
  );
}
