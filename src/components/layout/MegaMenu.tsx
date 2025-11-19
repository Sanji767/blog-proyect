// src/components/layout/MegaMenu.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

const featuredBanks = [
  {
    name: "Revolut",
    logo: "/banks/revolut.png",
    url: "/programas/revolut",
    tag: "Recomendado",
    tagColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  {
    name: "N26",
    logo: "/banks/n26.png",
    url: "/programas/n26",
    tag: "Cuenta gratis",
    tagColor:
      "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  },
  {
    name: "Wise",
    logo: "/banks/wise.png",
    url: "/programas/wise",
    tag: "Multidivisa",
    tagColor:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  },
  {
    name: "Bunq",
    logo: "/banks/bunq.png",
    url: "/programas/bunq",
    tag: "IBAN NL",
    tagColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
];

const MegaMenu = memo(function MegaMenu({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="absolute left-1/2 top-full z-40 mt-3 w-[520px] -translate-x-1/2">
      {/* “flecha” arriba */}
      <div className="mx-auto h-3 w-3 rotate-45 rounded-sm bg-background shadow-[0_-4px_12px_rgba(0,0,0,0.06)]" />

      <div className="mt-[-6px] overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
        <div className="grid gap-2 p-4 md:grid-cols-2">
          {featuredBanks.map((bank) => (
            <Link
              key={bank.name}
              href={bank.url}
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/70"
            >
              <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                <Image
                  src={bank.logo}
                  alt={bank.name}
                  fill
                  sizes="36px"
                  className="object-contain p-1.5"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {bank.name}
                </p>
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${bank.tagColor}`}
                >
                  {bank.tag}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="border-t border-border/70 bg-muted/40 px-4 py-3 text-center">
          <Link
            href="/bancos"
            onClick={onClose}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Ver todos los bancos →
          </Link>
        </div>
      </div>
    </div>
  );
});

export default MegaMenu;
