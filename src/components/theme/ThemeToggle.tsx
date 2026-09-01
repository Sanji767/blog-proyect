"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { locale } = useLocale();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-secondary-foreground/15 bg-secondary text-primary opacity-70",
          className
        )}
      >
        <Sun className="h-4 w-4" />
      </div>
    );
  }

  const isDark = (theme ?? resolvedTheme) === "dark";
  const label =
    locale === "en"
      ? isDark
        ? "Switch to light mode"
        : "Switch to dark mode"
      : isDark
      ? "Cambiar a modo día"
      : "Cambiar a modo noche";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "group relative inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-secondary-foreground/15 bg-secondary text-primary transition-all duration-200 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className
      )}
      aria-label={label}
      title={label}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45 text-accent" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12 text-primary group-hover:text-accent" />
      )}
    </button>
  );
}
