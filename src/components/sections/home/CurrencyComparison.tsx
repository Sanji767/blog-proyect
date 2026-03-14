"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightLeft, Info, Landmark } from "lucide-react";
import React, { useMemo, useState } from "react";

import Container from "@/components/layout/Container";
import { useLocale } from "@/components/i18n/LocaleProvider";

type ComparisonItem = {
  name: string;
  feePercent: number;
  fixedFee: number;
  isBank: boolean;
  icon?: React.ReactNode;
};

const COMPARISON_DATA_BY_LOCALE: Record<"es" | "en", ComparisonItem[]> = {
  es: [
    {
      name: "Banca tradicional (media)",
      feePercent: 3.5,
      fixedFee: 5.0,
      isBank: true,
      icon: <Landmark className="h-5 w-5" />,
    },
    {
      name: "Revolut (Standard)",
      feePercent: 0.5,
      fixedFee: 0,
      isBank: false,
    },
    {
      name: "Wise",
      feePercent: 0.41,
      fixedFee: 0,
      isBank: false,
    },
  ],
  en: [
    {
      name: "Traditional bank (average)",
      feePercent: 3.5,
      fixedFee: 5.0,
      isBank: true,
      icon: <Landmark className="h-5 w-5" />,
    },
    {
      name: "Revolut (Standard)",
      feePercent: 0.5,
      fixedFee: 0,
      isBank: false,
    },
    {
      name: "Wise",
      feePercent: 0.41,
      fixedFee: 0,
      isBank: false,
    },
  ],
};

const COPY = {
  es: {
    kicker: "Calculadora de ahorro",
    titlePrefix: "No dejes que las comisiones",
    titleHighlight: "se coman tu dinero",
    desc: "Mueve el selector para ver cuánto dinero llega realmente al destino cuando envías dinero al extranjero o pagas en otra divisa.",
    amountLabel: "Cantidad a enviar",
    estimatedFee: "Comisión estimada",
    lostFeesSuffix: "en comisiones",
    best: "Mejor opción",
    note: "Ejemplo orientativo: las comisiones varían según entidad, plan, divisa y método de pago. En banca tradicional, el coste total puede incluir comisión + margen en el tipo de cambio.",
  },
  en: {
    kicker: "Savings calculator",
    titlePrefix: "Don’t let fees",
    titleHighlight: "eat your money",
    desc: "Move the slider to see how much money actually arrives when you send money abroad or pay in another currency.",
    amountLabel: "Amount to send",
    estimatedFee: "Estimated fee",
    lostFeesSuffix: "in fees",
    best: "Best option",
    note: "Illustrative example: fees vary by provider, plan, currency and payment method. With traditional banks, total cost can include a fee plus a margin on the FX rate.",
  },
} as const;

export default function CurrencyComparison() {
  const { locale } = useLocale();
  const copy = COPY[locale];
  const numberLocale = locale === "en" ? "en-US" : "es-ES";
  const data = COMPARISON_DATA_BY_LOCALE[locale];

  const [amount, setAmount] = useState(1000);

  const calculateTotal = (val: number, feeP: number, fixed: number) => {
    return val - (val * (feeP / 100) + fixed);
  };

  const bestTotal = useMemo(() => {
    const totals = data.map((item) =>
      calculateTotal(amount, item.feePercent, item.fixedFee)
    );
    return Math.max(...totals);
  }, [amount, data]);

  return (
    <section className="border-t border-border bg-muted/20 py-16 md:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
              <ArrowRightLeft className="h-3.5 w-3.5" />
              {copy.kicker}
            </div>

            <h2 className="text-balance text-3xl font-black tracking-tight md:text-4xl">
              {copy.titlePrefix}{" "}
              <span className="inline-block border-2 border-secondary bg-background px-3 py-2 text-foreground shadow-offset-accent">
                {copy.titleHighlight}
              </span>
              .
            </h2>

            <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              {copy.desc}
            </p>

            <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
              <div className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <label className="text-sm font-semibold text-foreground">
                    {copy.amountLabel}
                  </label>
                  <span className="text-3xl font-black text-foreground">
                    {amount.toLocaleString(numberLocale)} €
                  </span>
                </div>

                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                />

                <div className="flex justify-between text-[10px] font-mono uppercase text-muted-foreground">
                  <span>100 €</span>
                  <span>{(5000).toLocaleString(numberLocale)} €</span>
                  <span>{(10000).toLocaleString(numberLocale)} €</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {data.map((item) => {
                const total = calculateTotal(amount, item.feePercent, item.fixedFee);
                const lost = amount - total;
                const isWinner = !item.isBank && total === bestTotal;

                return (
                  <motion.div
                    layout
                    key={item.name}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={[
                      "relative overflow-hidden rounded-2xl border-2 p-6",
                      "bg-secondary text-secondary-foreground border-secondary shadow-soft",
                      isWinner ? "shadow-offset-accent" : "",
                    ].join(" ")}
                  >
                    <div className="pointer-events-none absolute -top-28 -right-28 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

                    <div className="relative flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-secondary-foreground/12 bg-secondary-foreground/5 text-accent">
                          {item.icon ?? item.name[0]}
                        </div>
                        <div>
                          <h3 className="text-sm font-black tracking-tight text-accent">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-[11px] text-secondary-foreground/75">
                            {copy.estimatedFee}: {item.feePercent}%{" "}
                            {item.fixedFee > 0 ? `+ ${item.fixedFee}€` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="block text-lg font-black tracking-tight">
                          {total.toLocaleString(numberLocale, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          €
                        </span>
                        <span className="text-[11px] font-medium text-destructive">
                          -{lost.toLocaleString(numberLocale)} € {copy.lostFeesSuffix}
                        </span>
                      </div>
                    </div>

                    {isWinner ? (
                      <div className="absolute -top-2 -right-2 rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
                        {copy.best}
                      </div>
                    ) : null}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div className="flex gap-3 rounded-2xl border-2 border-border bg-card p-5 text-foreground shadow-soft">
              <Info className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {copy.note}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
