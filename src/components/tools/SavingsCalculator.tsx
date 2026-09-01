"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Award, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n";
import { banks } from "@/lib/banks";

type YieldItem = {
  slug: string;
  name: string;
  rate: number;
  color: string;
  highlight?: boolean;
};

const INTEREST_RATES: YieldItem[] = [
  { slug: "trade-republic", name: "Trade Republic", rate: 3.75, color: "bg-emerald-500", highlight: true },
  { slug: "n26", name: "N26", rate: 2.80, color: "bg-teal-500" },
  { slug: "myinvestor", name: "MyInvestor", rate: 2.50, color: "bg-cyan-500" },
  { slug: "revolut", name: "Revolut", rate: 2.00, color: "bg-blue-500" },
  { slug: "tradicional", name: "Banco Tradicional", rate: 0.05, color: "bg-slate-400" },
];

const UI_COPY: Record<Locale, {
  title: string;
  subtitle: string;
  savingsLabel: string;
  timeframeLabel: string;
  oneYear: string;
  threeYears: string;
  fiveYears: string;
  resultsTitle: string;
  perYear: string;
  totalEarnings: string;
  openAccount: string;
  traditionalBankLoss: string;
  topRecommendation: string;
}> = {
  es: {
    title: "Calculadora de Rentabilidad de Ahorro",
    subtitle: "Descubre cuánto dinero estás perdiendo al dejar tus ahorros al 0% en tu banco de siempre.",
    savingsLabel: "Tus ahorros acumulados",
    timeframeLabel: "Plazo de tiempo",
    oneYear: "1 Año",
    threeYears: "3 Años",
    fiveYears: "5 Años",
    resultsTitle: "Ganancias estimadas por entidad",
    perYear: "/año",
    totalEarnings: "Beneficio total",
    openAccount: "Abrir cuenta remunerada",
    traditionalBankLoss: "Estás dejando de ganar hasta",
    topRecommendation: "Mejor opción",
  },
  en: {
    title: "Savings Yield Calculator",
    subtitle: "See how much interest you are missing out on by keeping cash in traditional 0% accounts.",
    savingsLabel: "Your total savings",
    timeframeLabel: "Time horizon",
    oneYear: "1 Year",
    threeYears: "3 Years",
    fiveYears: "5 Years",
    resultsTitle: "Estimated returns by provider",
    perYear: "/year",
    totalEarnings: "Total profit",
    openAccount: "Open high-yield account",
    traditionalBankLoss: "You are missing out on up to",
    topRecommendation: "Best Value",
  },
};

export default function SavingsCalculator() {
  const { locale } = useLocale();
  const copy = UI_COPY[locale];

  const [amount, setAmount] = useState<number>(5000);
  const [years, setYears] = useState<number>(1);

  const calculateReturn = (rate: number) => {
    // Compound interest calculation
    const total = amount * Math.pow(1 + rate / 100, years);
    const profit = total - amount;
    return {
      total: Math.round(total),
      profit: Math.round(profit),
      annual: Math.round(profit / years),
    };
  };

  const topOption = INTEREST_RATES[0];
  const topProfit = calculateReturn(topOption.rate).profit;

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-border bg-card p-6 md:p-10 text-card-foreground shadow-soft transition-colors">
      <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <header className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Herramienta Interactiva</span>
        </div>
        <h2 className="mt-3 text-2xl font-black md:text-3xl tracking-tight text-foreground">
          {copy.title}
        </h2>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-muted-foreground">
          {copy.subtitle}
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Controls Column */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border-2 border-border bg-muted/40 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {copy.savingsLabel}
              </label>
              <span className="text-2xl font-black text-primary">
                {amount.toLocaleString()} €
              </span>
            </div>

            <input
              type="range"
              min={500}
              max={50000}
              step={500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-4 h-3 w-full cursor-pointer appearance-none rounded-lg bg-muted-foreground/20 accent-primary"
            />
            <div className="mt-2 flex justify-between text-[11px] font-semibold text-muted-foreground">
              <span>500 €</span>
              <span>25.000 €</span>
              <span>50.000 €</span>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-border bg-muted/40 p-6 shadow-sm">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {copy.timeframeLabel}
            </label>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: copy.oneYear, val: 1 },
                { label: copy.threeYears, val: 3 },
                { label: copy.fiveYears, val: 5 },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setYears(item.val)}
                  className={`rounded-xl border-2 py-2.5 text-xs font-bold transition-all ${
                    years === item.val
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-foreground/80 hover:border-primary/50 hover:bg-muted"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loss Callout Card */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 p-5 dark:bg-amber-500/15">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  {copy.traditionalBankLoss}
                </p>
                <p className="mt-1 text-2xl font-black text-amber-700 dark:text-amber-300">
                  +{topProfit.toLocaleString()} €
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  en {years} {years === 1 ? "año" : "años"} por mantener tu dinero inactivo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Bars Column */}
        <div className="space-y-4 lg:col-span-7">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {copy.resultsTitle}
          </h3>

          <div className="space-y-3">
            {INTEREST_RATES.map((item) => {
              const res = calculateReturn(item.rate);
              const bankObj = banks.find((b) => b.slug === item.slug);
              const targetUrl = bankObj?.affiliateUrl || bankObj?.website;

              const percentWidth = Math.max(12, Math.min(100, (res.profit / (topProfit || 1)) * 100));

              return (
                <div
                  key={item.slug}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-4 transition-all ${
                    item.highlight
                      ? "border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-md"
                      : "border-border bg-card hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-sm text-foreground">{item.name}</span>
                      <span className="rounded-full bg-muted border border-border px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                        {item.rate}% APY
                      </span>
                      {item.highlight ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-sm">
                          <Award className="h-3 w-3" />
                          {copy.topRecommendation}
                        </span>
                      ) : null}
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-foreground">
                        +{res.profit.toLocaleString()} €
                      </span>
                      <span className="ml-1 text-[11px] text-muted-foreground">
                        {copy.totalEarnings}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentWidth}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>

                  {item.highlight && targetUrl ? (
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-emerald-500/20">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Garantía hasta 100.000 € (FGD Europeo)
                      </p>
                      <Button asChild size="sm" className="gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                        <a
                          href={targetUrl}
                          data-analytics="affiliate"
                          data-affiliate-partner={item.slug}
                          target="_blank"
                          rel="noreferrer noopener sponsored"
                        >
                          {copy.openAccount}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
