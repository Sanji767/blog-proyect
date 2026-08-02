"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Scale, ArrowRight, Trophy, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { banks } from "@/lib/banks";
import type { Locale } from "@/lib/i18n";

type Duel = {
  slug1: string;
  slug2: string;
  tagline: Record<Locale, string>;
  winnerSlug: string;
};

const POPULAR_DUELS: Duel[] = [
  {
    slug1: "revolut",
    slug2: "wise",
    tagline: {
      es: "Duelo de gigantes de cuentas multidivisa y viajes internacionales",
      en: "Multi-currency and international transfer heavyweights duel",
    },
    winnerSlug: "revolut",
  },
  {
    slug1: "n26",
    slug2: "revolut",
    tagline: {
      es: "IBAN alemán vs IBAN lituano: ¿cuál es el mejor neobanco europeo?",
      en: "German IBAN vs Lithuanian IBAN: Which European neobank wins?",
    },
    winnerSlug: "n26",
  },
  {
    slug1: "trade-republic",
    slug2: "myinvestor",
    tagline: {
      es: "La batalla del ahorro remunerado e inversión low-cost",
      en: "The ultimate showdown of high-yield savings & investing",
    },
    winnerSlug: "trade-republic",
  },
  {
    slug1: "bbva",
    slug2: "santander",
    tagline: {
      es: "Comparativa de cuentas digitales de la banca tradicional española",
      en: "Traditional Spanish banking titans face off in digital accounts",
    },
    winnerSlug: "bbva",
  },
];

const UI_COPY: Record<Locale, {
  badge: string;
  title: string;
  subtitle: string;
  customTitle: string;
  customSubtitle: string;
  bank1Label: string;
  bank2Label: string;
  compareBtn: string;
  popularTitle: string;
  versus: string;
  viewComparison: string;
}> = {
  es: {
    badge: "Comparador Cara a Cara",
    title: "Duelos y Comparativas Bancarias 2026",
    subtitle: "Analizamos las diferencias clave de comisiones, IBAN, apps y límites para ayudarte a decidir.",
    customTitle: "Crea tu propia comparativa",
    customSubtitle: "Selecciona dos entidades y analiza sus especificaciones cara a cara.",
    bank1Label: "Primer Banco",
    bank2Label: "Segundo Banco",
    compareBtn: "Comparar Ahora →",
    popularTitle: "Comparativas más populares en Google",
    versus: "VS",
    viewComparison: "Ver duelo completo →",
  },
  en: {
    badge: "Head-to-Head Comparisons",
    title: "Bank Duels & Side-by-Side Reviews 2026",
    subtitle: "We break down fees, IBANs, app UX, and limits to help you choose the winner.",
    customTitle: "Create Your Custom Comparison",
    customSubtitle: "Select any two providers and compare specs head-to-head.",
    bank1Label: "First Provider",
    bank2Label: "Second Provider",
    compareBtn: "Compare Now →",
    popularTitle: "Top Searched Bank Duels",
    versus: "VS",
    viewComparison: "View full duel →",
  },
};

export default function ComparisonHubClient() {
  const { locale } = useLocale();
  const copy = UI_COPY[locale];
  const router = useRouter();

  // Sort all banks alphabetically by name for easy selection
  const availableBanks = [...banks].sort((a, b) => a.name.localeCompare(b.name));

  const [bank1, setBank1] = useState<string>("revolut");
  const [bank2, setBank2] = useState<string>("wise");

  const handleCustomCompare = () => {
    if (bank1 === bank2) return;
    const path = locale === "en" ? `/en/comparar/${bank1}-vs-${bank2}` : `/comparar/${bank1}-vs-${bank2}`;
    router.push(path);
  };

  return (
    <div className="space-y-12 md:space-y-16">
      <header className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-bold text-accent uppercase tracking-wider">
          <Scale className="h-3.5 w-3.5 text-accent" />
          <span>{copy.badge}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-accent">
          {copy.title}
        </h1>
        <p className="text-sm md:text-base leading-relaxed text-secondary-foreground/80">
          {copy.subtitle}
        </p>
      </header>

      {/* Custom Comparison Generator */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-accent bg-secondary p-6 md:p-8 shadow-soft">
        <div className="max-w-xl mx-auto text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-black text-accent">{copy.customTitle}</h2>
          <p className="text-xs md:text-sm text-secondary-foreground/80">{copy.customSubtitle}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-12 items-center max-w-3xl mx-auto">
          <div className="sm:col-span-5 space-y-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground/70">
              {copy.bank1Label}
            </label>
            <select
              value={bank1}
              onChange={(e) => setBank1(e.target.value)}
              className="w-full rounded-2xl border-2 border-accent/40 bg-background p-3.5 text-sm font-bold text-foreground shadow-sm focus:border-accent focus:outline-none dark:bg-slate-900 dark:text-white"
            >
              {availableBanks.map((b) => (
                <option key={b.slug} value={b.slug} className="bg-background text-foreground dark:bg-slate-900 dark:text-white py-1">
                  {b.name} ({b.ibanPrefix || b.country})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex justify-center py-2 sm:py-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-accent/10 font-black text-accent text-sm shadow-sm">
              VS
            </span>
          </div>

          <div className="sm:col-span-5 space-y-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground/70">
              {copy.bank2Label}
            </label>
            <select
              value={bank2}
              onChange={(e) => setBank2(e.target.value)}
              className="w-full rounded-2xl border-2 border-accent/40 bg-background p-3.5 text-sm font-bold text-foreground shadow-sm focus:border-accent focus:outline-none dark:bg-slate-900 dark:text-white"
            >
              {availableBanks.map((b) => (
                <option key={b.slug} value={b.slug} className="bg-background text-foreground dark:bg-slate-900 dark:text-white py-1">
                  {b.name} ({b.ibanPrefix || b.country})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            onClick={handleCustomCompare}
            disabled={bank1 === bank2}
            className="font-bold px-8"
          >
            {copy.compareBtn}
          </Button>
        </div>
      </section>

      {/* Popular Duels Grid */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-accent">
            {copy.popularTitle}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {POPULAR_DUELS.map((duel) => {
            const b1 = availableBanks.find((b) => b.slug === duel.slug1);
            const b2 = availableBanks.find((b) => b.slug === duel.slug2);
            if (!b1 || !b2) return null;

            const comparisonSlug = `${duel.slug1}-vs-${duel.slug2}`;

            return (
              <motion.article
                key={comparisonSlug}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-secondary-foreground/10 bg-secondary p-6 shadow-soft transition-all hover:border-accent"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-lg text-accent">{b1.name}</span>
                      <span className="rounded-full bg-accent/10 border border-accent/20 px-2 py-0.5 text-xs font-black text-accent">
                        {copy.versus}
                      </span>
                      <span className="font-black text-lg text-accent">{b2.name}</span>
                    </div>

                    <Trophy className="h-5 w-5 text-amber-500 shrink-0" />
                  </div>

                  <p className="mt-4 text-xs md:text-sm leading-relaxed text-secondary-foreground/80">
                    {duel.tagline[locale]}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-secondary-foreground/10 flex justify-end">
                  <Button asChild variant="ghost" size="sm" className="gap-1 font-bold group-hover:text-accent">
                    <LocalizedLink href={`/comparar/${comparisonSlug}`}>
                      {copy.viewComparison}
                    </LocalizedLink>
                  </Button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
