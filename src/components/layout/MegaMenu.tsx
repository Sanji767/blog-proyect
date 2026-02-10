// src/components/layout/MegaMenu.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

const featuredBanks = [
  { name: "Revolut", logo: "/images/logos/revolut.svg", url: "/programas/revolut" },
  { name: "N26", logo: "/images/logos/n26.svg", url: "/programas/n26" },
  { name: "Wise", logo: "/images/logos/wise.svg", url: "/programas/wise" },
  { name: "Bunq", logo: "/images/logos/bunq.svg", url: "/programas/bunq" },
] as const;

type Props = { onClose: () => void };

/**
 * Mega menú de bancos destacados.
 * Contraste correcto en dark y light mode.
 */
const MegaMenu = memo(function MegaMenu({ onClose }: Props) {
  return (
    <div
      className="w-[480px] rounded-2xl bg-white/95 dark:bg-zinc-900/95 shadow-lg ring-1 ring-border/30 overflow-hidden backdrop-blur-md"
      role="menu"
      aria-label="Bancos destacados"
    >
      <div className="grid gap-2 p-4 md:grid-cols-2">
        {featuredBanks.map((bank) => (
          <Link
            key={bank.name}
            href={bank.url}
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-muted/30 dark:hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
            role="menuitem"
          >
            <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg bg-white dark:bg-zinc-800">
              <Image
                src={bank.logo}
                alt={`${bank.name} logo`}
                fill
                sizes="32px"
                className="object-contain p-1"
                unoptimized
              />
            </div>
            <p className="truncate text-sm font-medium text-foreground dark:text-foreground">
              {bank.name}
            </p>
          </Link>
        ))}
      </div>

      <div className="border-t border-border/30 px-4 py-2 text-center bg-white/95 dark:bg-zinc-900/95">
        <Link
          href="/bancos"
          onClick={onClose}
          className="text-sm font-medium text-primary hover:underline focus-visible:underline"
        >
          Ver todos los bancos →
        </Link>
      </div>
    </div>
  );
});

MegaMenu.displayName = "MegaMenu";

export default MegaMenu;
