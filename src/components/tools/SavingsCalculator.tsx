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
  /** Honesty note: the condition behind the single rate shown. */
  note?: { es: string; en: string };
};

// Date the rates below were last verified against each provider's official
// terms. Rates are variable — update this const (and the numbers) monthly.
const RATES_AS_OF = "2026-11-20";

// Rates verified 2026-11-20 against official sources (see CHANGES.md).
// Single number per bank = the unconditional rate a new free-plan customer
// actually earns on the bulk of the balance; promos/tiers live in `note`.
// Order matters: index 0 is the "top option" (highest rate, highlighted).
const INTEREST_RATES: YieldItem[] = [
  {
    slug: "trade-republic",
    name: "Trade Republic",
    rate: 2.5,
    color: "bg-primary",
    highlight: true,
    note: {
      es: "Tipo estándar sin límite de saldo. Nuevos clientes: 4% hasta 20.000 € hasta el 1 mar 2027.",
      en: "Standard rate, no balance cap. New clients: 4% up to €20,000 until 1 Mar 2027.",
    },
  },
  {
    slug: "revolut",
    name: "Revolut",
    rate: 1.25,
    color: "bg-primary/40",
    note: {
      es: "Países Bajos, plan Standard: 2,50% hasta 2.500 € y 1,25% por encima. En España el plan Standard paga 1,15% TAE.",
      en: "Netherlands, Standard plan: 2.50% up to €2,500, 1.25% above. In Spain the Standard plan pays 1.15% APR.",
    },
  },
  {
    slug: "n26",
    name: "N26",
    rate: 0.5,
    color: "bg-primary-accent",
    note: {
      es: "Planes Standard, Smart y Go en España. 1,30% TAE con Metal (16,90 €/mes).",
      en: "Standard, Smart and Go plans in Spain. 1.30% APR with Metal (€16.90/mo).",
    },
  },
  {
    slug: "myinvestor",
    name: "MyInvestor",
    rate: 0.3,
    color: "bg-primary/60",
    note: {
      es: "Tipo sin condiciones desde el 7.º mes. 2,50% TAE los 6 primeros meses para nuevos clientes.",
      en: "No-conditions rate from month 7. 2.50% APR for the first 6 months for new clients.",
    },
  },
  { slug: "tradicional", name: "Banco Tradicional", rate: 0.05, color: "bg-muted-foreground" },
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
  ratesAsOf: (date: string) => string;
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
    ratesAsOf: (date) =>
      `Tipos verificados el ${date}. Los tipos son variables y pueden cambiar; verifica siempre el tipo vigente en la web oficial de cada entidad.`,
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
    ratesAsOf: (date) =>
      `Rates verified on ${date}. Rates are variable and may change; always check the current rate on each provider's official website.`,
  },
};

export default function SavingsCalculator() {
  const { locale } = useLocale();
  const copy = UI_COPY[locale];

  const ratesAsOfLabel = new Date(`${RATES_AS_OF}T00:00:00Z`).toLocaleDateString(
    locale === "en" ? "en-US" : "es-ES",
    { year: "numeric", month: "long", day: "numeric" },
  );

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
    <section className="relative overflow-hidden rounded-xl border border-border bg-card p-6 md:p-10 text-card-foreground shadow-soft transition-colors">
      <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <header className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary-text uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-primary-text" />
          <span>Herramienta Interactiva</span>
        </div>
        <h2 className="mt-3 text-2xl font-black md:text-3xl tracking-tight text-foreground">
          {copy.title}
        </h2>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-muted-foreground">
          {copy.subtitle}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {copy.ratesAsOf(ratesAsOfLabel)}
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Controls Column */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-border bg-muted/40 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {copy.savingsLabel}
              </label>
              <span className="text-2xl font-black text-primary">
                {amount.toLocaleString("es-ES")} €
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

          <div className="rounded-2xl border border-border bg-muted/40 p-6 shadow-sm">
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
                  className={`rounded-xl border py-2.5 text-xs font-bold transition-all ${
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
          <div className="relative overflow-hidden rounded-2xl border border-accent/60 bg-accent/10 p-5">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-6 w-6 shrink-0 text-accent-foreground" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-accent-foreground">
                  {copy.traditionalBankLoss}
                </p>
                <p className="mt-1 text-2xl font-black text-primary-text">
                  +{topProfit.toLocaleString("es-ES")} €
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
                  className={`group relative overflow-hidden rounded-2xl border p-4 transition-all ${
                    item.highlight
                      ? "border-primary/50 bg-primary/5 dark:bg-primary/10 shadow-md"
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
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-black uppercase text-primary-foreground shadow-sm">
                          <Award className="h-3 w-3" />
                          {copy.topRecommendation}
                        </span>
                      ) : null}
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-foreground">
                        +{res.profit.toLocaleString("es-ES")} €
                      </span>
                      <span className="ml-1 text-[11px] text-muted-foreground">
                        {copy.totalEarnings}
                      </span>
                    </div>
                  </div>

                  {item.note ? (
                    <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                      {item.note[locale]}
                    </p>
                  ) : null}

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
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-primary/20">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-primary-text dark:text-primary-light">
                        <CheckCircle2 className="h-4 w-4" />
                        Garantía hasta 100.000 € (FGD Europeo)
                      </p>
                      <Button asChild size="sm" className="gap-1.5 text-xs font-bold">
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
