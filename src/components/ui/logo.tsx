// src/components/ui/logo.tsx
"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showText?: boolean;
  tone?: "default" | "inverse";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
};

export function LogoEmblem({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10 md:h-11 md:w-11",
    lg: "h-14 w-14",
  }[size];

  return (
    <div
      className={cn(
        "group relative flex shrink-0 items-center justify-center rounded-xl p-[2px] transition-transform duration-300 ease-out group-hover:scale-105",
        sizeClasses,
        className
      )}
    >
      {/* Outer ambient gradient glow */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary/60 via-accent/40 to-emerald-400/50 opacity-60 blur-md transition-opacity duration-500 group-hover:opacity-100" />

      {/* Glossy multi-gradient border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary via-accent to-emerald-400 p-[1.5px]">
        <div className="h-full w-full rounded-[10px] bg-gradient-to-br from-[#2c1642] via-[#1c0f2a] to-[#12081d]" />
      </div>

      {/* SVG Vector Monogram */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 h-full w-full p-1.5 transition-transform duration-300 ease-out group-hover:scale-105"
      >
        <defs>
          <linearGradient id="logo-f-cyan" x1="16" y1="13" x2="38" y2="47" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="50%" stopColor="#2fb7d1" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="logo-arrow-gold" x1="27" y1="46" x2="52" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f8c44c" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        {/* F Vertical Pillar */}
        <path
          d="M16 16.5C16 14.567 17.567 13 19.5 13H21.5C23.433 13 25 14.567 25 16.5V47.5C25 49.433 23.433 51 21.5 51H19.5C17.567 51 16 49.433 16 47.5V16.5Z"
          fill="url(#logo-f-cyan)"
        />

        {/* F Top Bar */}
        <path
          d="M21 13H38C39.933 13 41.5 14.567 41.5 16.5V17.5C41.5 19.433 39.933 21 38 21H21V13Z"
          fill="url(#logo-f-cyan)"
        />

        {/* F Middle Bar */}
        <path
          d="M21 27.5H32.5C34.433 27.5 36 29.067 36 31V31.5C36 33.433 34.433 35 32.5 35H21V27.5Z"
          fill="url(#logo-f-cyan)"
        />

        {/* Dynamic Financial Growth Trendline & Arrow */}
        <path
          d="M27 46L36 35L44 25L51 17.5"
          stroke="url(#logo-arrow-gold)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
        <path
          d="M43 16H52V25"
          stroke="url(#logo-arrow-gold)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />

        {/* European Sparkle Stars */}
        <path d="M51 9L51.8 11.2L54 12L51.8 12.8L51 15L50.2 12.8L48 12L50.2 11.2L51 9Z" fill="#fef08a" />
        <circle cx="42" cy="8.5" r="1.5" fill="#f8c44c" />
        <circle cx="56" cy="18" r="1.2" fill="#f8c44c" />
      </svg>
    </div>
  );
}

export default function Logo({
  className,
  showText = true,
  tone = "default",
  size = "md",
  showTagline = true,
}: LogoProps) {
  const isInverse = tone === "inverse";

  // Gracefully handle locale (falls back safely if context is absent)
  let isEnglish = false;
  try {
    const { locale } = useLocale();
    isEnglish = locale === "en";
  } catch {
    isEnglish = false;
  }

  const tagline = isEnglish ? "Banks · Europe · IBAN" : "Bancos · Europa · IBAN";

  return (
    <div className={cn("group inline-flex items-center gap-3.5 select-none", className)}>
      <LogoEmblem size={size} />

      {showText ? (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "font-display text-xl md:text-2xl font-black tracking-tight transition-colors",
                isInverse ? "text-secondary-foreground" : "text-foreground"
              )}
            >
              Finanzas
            </span>
            <span className="relative inline-flex items-center justify-center rounded-md bg-gradient-to-r from-primary to-cyan-400 px-1.5 py-0.5 text-xs font-black tracking-wider text-secondary shadow-sm">
              EU
            </span>
          </div>

          {showTagline ? (
            <p
              className={cn(
                "mt-1 text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors",
                isInverse ? "text-primary/90" : "text-muted-foreground"
              )}
            >
              {tagline}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
