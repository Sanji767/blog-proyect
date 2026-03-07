// src/components/sections/home/UseCases.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Briefcase, Home, Plane, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { banks } from "@/lib/banks";
import { cn } from "@/lib/utils";

const CASES = [
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
];

export default function UseCases() {
  const [active, setActive] = useState(CASES[0].id);

  const currentCase = useMemo(
    () => CASES.find((c) => c.id === active) ?? CASES[0],
    [active]
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
                Dime quién eres,{" "}
                <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
                  y te digo por dónde empezar
                </span>
                .
              </h2>

              <div className="grid gap-3">
                {CASES.map((c) => {
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
                  Recomendación
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
                              Top para {currentCase.label}
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
                              IBAN
                            </p>
                            <p className="mt-2 font-semibold">
                              {recommended.ibanPrefix} ({recommended.ibanCountry})
                            </p>
                          </div>
                          <div className="rounded-xl border-2 border-border bg-card p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                              Cuota mensual
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
                            <Link href={`/programas/${recommended.slug}`}>
                              Ver análisis
                              <ArrowRight className="h-4 w-4" />
                            </Link>
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
                                Web oficial
                              </a>
                            </Button>
                          ) : (
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="w-full flex-1"
                            >
                              <Link href="/bancos">Ver alternativas</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-secondary-foreground/80">
                        No hemos encontrado datos para este banco.
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

