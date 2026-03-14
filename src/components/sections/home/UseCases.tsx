// src/components/sections/home/UseCases.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Briefcase, Home, Plane, Star, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import Container from "@/components/layout/Container";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Button } from "@/components/ui/button";
import { banks } from "@/lib/banks";
import { cn } from "@/lib/utils";

const CASES_BY_LOCALE = {
  es: [
    {
      id: "remoto",
      label: "Trabajo remoto",
      icon: Briefcase,
      text: "IBAN para cobrar en varias divisas y gestionar cobros internacionales.",
      recommendedBank: "wise",
    },
    {
      id: "viajero",
      label: "Viajero",
      icon: Plane,
      text: "Tarjetas con buen tipo de cambio y gestión multidivisa.",
      recommendedBank: "revolut",
    },
    {
      id: "nomina",
      label: "Cuenta nómina",
      icon: Home,
      text: "Cuenta principal para recibos, domiciliaciones y el día a día.",
      recommendedBank: "n26",
    },
    {
      id: "negocios",
      label: "Autónomos / Pymes",
      icon: Users,
      text: "Subcuentas y organización de impuestos y gastos sin líos.",
      recommendedBank: "bunq",
    },
  ],
  en: [
    {
      id: "remote",
      label: "Remote work",
      icon: Briefcase,
      text: "An IBAN to get paid in multiple currencies and manage international payments.",
      recommendedBank: "wise",
    },
    {
      id: "travel",
      label: "Travel",
      icon: Plane,
      text: "Cards with good FX rates and real multi‑currency management.",
      recommendedBank: "revolut",
    },
    {
      id: "salary",
      label: "Salary account",
      icon: Home,
      text: "A main account for bills, direct debits and everyday banking.",
      recommendedBank: "n26",
    },
    {
      id: "business",
      label: "Freelance / small business",
      icon: Users,
      text: "Sub-accounts and a clean way to organize taxes and expenses.",
      recommendedBank: "bunq",
    },
  ],
} as const;

const COPY = {
  es: {
    titlePrefix: "Dime quién eres,",
    titleHighlight: "y te digo por dónde empezar",
    recommendation: "Recomendación",
    bestFor: "Top para",
    iban: "IBAN",
    monthlyFee: "Cuota mensual",
    viewAnalysis: "Ver análisis",
    officialSite: "Web oficial",
    seeAlternatives: "Ver alternativas",
    missingBank: "No hemos encontrado datos para este banco.",
  },
  en: {
    titlePrefix: "Tell me who you are,",
    titleHighlight: "and I’ll tell you where to start",
    recommendation: "Recommendation",
    bestFor: "Best for",
    iban: "IBAN",
    monthlyFee: "Monthly fee",
    viewAnalysis: "View analysis",
    officialSite: "Official site",
    seeAlternatives: "See alternatives",
    missingBank: "We couldn’t find data for this bank.",
  },
} as const;

export default function UseCases() {
  const { locale } = useLocale();
  const cases = CASES_BY_LOCALE[locale];
  const copy = COPY[locale];

  const [active, setActive] = useState<string>(cases[0].id);

  useEffect(() => {
    setActive(cases[0].id);
  }, [cases]);

  const currentCase = useMemo(
    () => cases.find((c) => c.id === active) ?? cases[0],
    [active, cases]
  );

  const recommended = useMemo(
    () => banks.find((b) => b.slug === currentCase.recommendedBank),
    [currentCase.recommendedBank]
  );

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="rounded-2xl border-2 border-border bg-card p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="space-y-6 lg:col-span-5">
              <h2 className="text-balance text-3xl font-black leading-tight md:text-4xl">
                {copy.titlePrefix}{" "}
                <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
                  {copy.titleHighlight}
                </span>
                .
              </h2>

              <div className="grid gap-3">
                {cases.map((c) => {
                  const Icon = c.icon;
                  const isActive = c.id === active;

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActive(c.id)}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border-2 px-4 py-4 text-left transition-colors",
                        isActive
                          ? "border-secondary bg-secondary text-secondary-foreground shadow-offset-accent"
                          : "border-border bg-background hover:border-secondary/35"
                      )}
                      aria-pressed={isActive}
                    >
                      <div
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-xl border-2",
                          isActive
                            ? "border-secondary-foreground/10 bg-secondary-foreground/5 text-accent"
                            : "border-border bg-muted text-primary"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            "font-semibold",
                            isActive ? "text-accent" : "text-foreground"
                          )}
                        >
                          {c.label}
                        </p>
                        <p
                          className={cn(
                            "mt-1 text-sm",
                            isActive
                              ? "text-secondary-foreground/80"
                              : "text-muted-foreground"
                          )}
                        >
                          {c.text}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-offset-accent">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {copy.recommendation}
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="mt-4 space-y-6"
                  >
                    <p className="text-balance text-2xl font-black leading-tight md:text-3xl">
                      “{currentCase.text}”
                    </p>

                    {recommended ? (
                      <div className="rounded-2xl border-2 border-secondary bg-background p-6 text-foreground shadow-soft">
                        <div className="flex items-center gap-5">
                          <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-border bg-muted p-2">
                            <Image
                              src={recommended.logo}
                              alt={recommended.name}
                              width={56}
                              height={56}
                              className="object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                              {copy.bestFor} {currentCase.label}
                            </p>
                            <h3 className="mt-1 text-2xl font-black tracking-tight">
                              {recommended.name}{" "}
                              <span className="inline-flex items-center gap-1 text-accent-foreground">
                                <Star className="h-4 w-4 fill-accent text-accent" />
                              </span>
                            </h3>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                          <div className="rounded-xl border-2 border-border bg-card p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                              {copy.iban}
                            </p>
                            <p className="mt-2 font-semibold">
                              {recommended.ibanPrefix} ({recommended.ibanCountry})
                            </p>
                          </div>
                          <div className="rounded-xl border-2 border-border bg-card p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                              {copy.monthlyFee}
                            </p>
                            <p className="mt-2 font-semibold">
                              {recommended.fees.monthly}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                          <Button
                            asChild
                            size="sm"
                            className="w-full flex-1 gap-2"
                          >
                            <LocalizedLink href={`/programas/${recommended.slug}`}>
                              {copy.viewAnalysis}
                              <ArrowRight className="h-4 w-4" />
                            </LocalizedLink>
                          </Button>

                          {recommended.affiliateUrl ? (
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="w-full flex-1"
                            >
                              <a
                                href={recommended.affiliateUrl}
                                data-analytics="affiliate"
                                data-affiliate-partner={recommended.slug}
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
                              className="w-full flex-1"
                            >
                              <LocalizedLink href="/bancos">
                                {copy.seeAlternatives}
                              </LocalizedLink>
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-secondary-foreground/80">
                        {copy.missingBank}
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
