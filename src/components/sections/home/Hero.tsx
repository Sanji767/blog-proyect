// src/components/sections/home/Hero.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, ScanLine, ShieldCheck, Sparkles } from "lucide-react";

import Container from "@/components/layout/Container";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" },
};

const COPY = {
  es: {
    badge: "Guía 2026 · Europa",
    h1Prefix: "Elige tu banco en Europa con",
    h1Highlight: "criterio",
    desc: "Comparativas claras de bancos digitales (Revolut, N26, Wise…). Datos, fuentes y recomendaciones directas para decidir sin prisa.",
    ctaPrimary: "Ver ranking",
    ctaSecondary: "Ver bancos",
    footer: "IBAN Scanner, guías y comparativas sin humo.",
    asideKicker: "En 3 minutos",
    asideTitle: "Qué hace FinanzasEU (y por qué te ahorra tiempo)",
    asideItems: [
      "Licencia, IBAN y comisiones explicadas en lenguaje humano.",
      "Validador de IBAN SEPA para comprobar datos antes de enviar dinero.",
      "Recomendaciones directas según tu caso (viajar, freelance, nómina).",
    ],
    asidePrimary: "IBAN Scanner",
    asideSecondary: "Ver artículos",
  },
  en: {
    badge: "Guide 2026 · Europe",
    h1Prefix: "Choose your bank in Europe with",
    h1Highlight: "clarity",
    desc: "Clear comparisons of digital banks (Revolut, N26, Wise…). Data, sources and direct recommendations to decide without stress.",
    ctaPrimary: "See ranking",
    ctaSecondary: "Browse banks",
    footer: "IBAN Scanner, guides and comparisons without fluff.",
    asideKicker: "In 3 minutes",
    asideTitle: "What FinanzasEU does (and how it saves you time)",
    asideItems: [
      "License, IBAN and fees explained in plain language.",
      "SEPA IBAN validator to double-check details before sending money.",
      "Direct recommendations based on your case (travel, freelance, salary).",
    ],
    asidePrimary: "IBAN Scanner",
    asideSecondary: "Read articles",
  },
} as const;

export default function Hero() {
  const { locale } = useLocale();
  const copy = COPY[locale];

  return (
    <section className="py-16 md:py-24">
      <Container className="grid gap-12 lg:grid-cols-12 lg:items-start">
        <motion.div
          initial="initial"
          animate="animate"
          className="space-y-8 lg:col-span-7"
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline">{copy.badge}</Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-balance text-4xl font-black leading-[1.02] tracking-tight md:text-6xl"
          >
            {copy.h1Prefix}{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              {copy.h1Highlight}
            </span>
            .
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            {copy.desc}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <LocalizedLink href="/comparativa">
                {copy.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </LocalizedLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <LocalizedLink href="/bancos">{copy.ctaSecondary}</LocalizedLink>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="border-t-2 border-border pt-6 text-sm text-muted-foreground"
          >
            {copy.footer}
          </motion.div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="lg:col-span-5"
        >
          <div className="rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-offset-accent">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {copy.asideKicker}
            </p>
            <h2 className="mt-4 text-balance text-2xl font-black leading-tight md:text-3xl">
              {copy.asideTitle}
            </h2>

            <ul className="mt-6 space-y-4 text-sm text-secondary-foreground/85">
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-accent" />
                {copy.asideItems[0]}
              </li>
              <li className="flex items-start gap-3">
                <ScanLine className="mt-0.5 h-4 w-4 text-accent" />
                {copy.asideItems[1]}
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 text-accent" />
                {copy.asideItems[2]}
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="sm" className="w-full flex-1 gap-2">
                <LocalizedLink href="/iban">
                  {copy.asidePrimary}
                  <ArrowRight className="h-4 w-4" />
                </LocalizedLink>
              </Button>
              <Button asChild size="sm" variant="outline" className="w-full flex-1">
                <LocalizedLink href="/blog">{copy.asideSecondary}</LocalizedLink>
              </Button>
            </div>
          </div>
        </motion.aside>
      </Container>
    </section>
  );
}
