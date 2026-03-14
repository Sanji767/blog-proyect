// src/components/sections/home/HomeBanksPreview.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import Container from "@/components/layout/Container";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Button } from "@/components/ui/button";
import { banks } from "@/lib/banks";

const COPY = {
  es: {
    kicker: "Ranking 2026",
    titlePrefix: "Recomendaciones",
    titleHighlight: "Top",
    desc: "Bancos que suelen encajar para abrir cuenta online desde el extranjero, viajar o gestionar dinero en varias divisas.",
    viewAll: "Ver todo el directorio",
    top: "Top",
    iban: "IBAN",
    monthlyFee: "Cuota mensual",
    viewAnalysis: "Ver análisis",
    officialSite: "Web oficial",
    seeAlternatives: "Ver alternativas",
  },
  en: {
    kicker: "Ranking 2026",
    titlePrefix: "Top",
    titleHighlight: "picks",
    desc: "Banks that tend to fit for opening an account from abroad, travelling, or managing money in multiple currencies.",
    viewAll: "See full directory",
    top: "Top",
    iban: "IBAN",
    monthlyFee: "Monthly fee",
    viewAnalysis: "View analysis",
    officialSite: "Official site",
    seeAlternatives: "See alternatives",
  },
} as const;

export default function HomeBanksPreview() {
  const { locale } = useLocale();
  const copy = COPY[locale];

  const featured = [...banks]
    .filter((b) => b._status !== "draft")
    .sort((a, b) => (a._priority ?? 999) - (b._priority ?? 999))
    .slice(0, 3);

  return (
    <section className="border-t border-border bg-muted/30 py-16 md:py-24">
      <Container>
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {copy.kicker}
            </p>
            <h2 className="text-balance text-3xl font-black tracking-tight md:text-5xl">
              {copy.titlePrefix}{" "}
              <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
                {copy.titleHighlight}
              </span>
            </h2>
            <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              {copy.desc}
            </p>
          </div>

          <Button asChild variant="outline" className="gap-2 shrink-0">
            <LocalizedLink href="/bancos">
              {copy.viewAll}
              <ArrowUpRight className="h-4 w-4" />
            </LocalizedLink>
          </Button>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featured.map((bank, index) => (
            <motion.article
              key={bank.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-7 text-secondary-foreground shadow-soft transition-shadow hover:shadow-offset-accent"
            >
              <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 -right-28 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 rounded-xl border-2 border-secondary-foreground/12 bg-secondary-foreground/5 p-2">
                    <Image
                      src={bank.logo}
                      alt={bank.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                      {copy.top} #{index + 1}
                    </p>
                    <h3 className="mt-2 text-2xl font-black leading-tight text-accent">
                      {bank.name}
                    </h3>
                  </div>
                </div>

                <span className="inline-flex items-center rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
                  #{index + 1}
                </span>
              </div>

              <p className="relative mt-5 text-sm leading-relaxed text-secondary-foreground/80 line-clamp-3">
                {bank.tagline}
              </p>

              <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border-2 border-secondary-foreground/10 bg-secondary-foreground/5 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-foreground/70">
                    {copy.iban}
                  </p>
                  <p className="mt-2 font-semibold">
                    {bank.ibanPrefix} ({bank.ibanCountry})
                  </p>
                </div>
                <div className="rounded-xl border-2 border-secondary-foreground/10 bg-secondary-foreground/5 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-foreground/70">
                    {copy.monthlyFee}
                  </p>
                  <p className="mt-2 font-semibold">{bank.fees.monthly}</p>
                </div>
              </div>

              <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="sm" className="flex-1">
                  <LocalizedLink href={`/programas/${bank.slug}`}>
                    {copy.viewAnalysis}
                  </LocalizedLink>
                </Button>

                {bank.affiliateUrl ? (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="flex-1 border-secondary-foreground/20 text-secondary-foreground hover:border-secondary-foreground/35 hover:bg-secondary-foreground/5"
                  >
                    <a
                      href={bank.affiliateUrl}
                      data-analytics="affiliate"
                      data-affiliate-partner={bank.slug}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {copy.officialSite}
                    </a>
                  </Button>
                ) : (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="flex-1 border-secondary-foreground/20 text-secondary-foreground hover:border-secondary-foreground/35 hover:bg-secondary-foreground/5"
                  >
                    <LocalizedLink href="/bancos">{copy.seeAlternatives}</LocalizedLink>
                  </Button>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
