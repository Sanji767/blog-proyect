"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, TrendingDown, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/components/i18n/LocaleProvider";

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function parseNumber(value: string, fallback: number): number {
  const normalized = value.replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildShareUrl(params: Record<string, string>): string {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, val]) => {
    if (!val) url.searchParams.delete(key);
    else url.searchParams.set(key, val);
  });
  return url.toString();
}

export default function InflationCalculator() {
  const { locale } = useLocale();
  const [amount, setAmount] = useState("1000");
  const [years, setYears] = useState("10");
  const [inflation, setInflation] = useState("3");
  const [toast, setToast] = useState<string | null>(null);

  const intlLocale = locale === "en" ? "en-US" : "es-ES";

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(intlLocale, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }),
    [intlLocale],
  );

  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(intlLocale, {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    [intlLocale],
  );

  const formatCurrency = (value: number) => currencyFormatter.format(value);
  const formatPercent = (value: number) => percentFormatter.format(value / 100);

  const copy =
    locale === "en"
      ? {
          badge: "Calculator",
          title: "Inflation and",
          titleAccent: "purchasing power",
          desc:
            "Estimate how much you’ll need in the future to keep the same purchasing power (and how much your money “loses” today if it doesn’t grow).",
          copyLink: "Copy link",
          linkCopied: "Link copied.",
          amount: "Amount (€)",
          years: "Years",
          inflation: "Inflation (%)",
          futureEquivalent: "Future equivalent",
          futureEquivalentDescPrefix: "For",
          futureEquivalentDescMid: "to “be worth the same” in",
          futureEquivalentDescSuffix: "with inflation",
          yearsSuffix: "years",
          futureReal: "Future real value",
          futureRealDescPrefix: "Purchasing power of",
          futureRealDescSuffix: "in",
          accumulatedLoss: "Accumulated loss",
          dueToInflation: "Due to compounded inflation",
          yearly: "Yearly evolution",
          yearlyDesc: "Approximate table per year (future equivalent and real value).",
          year: "Year",
          realValue: "Real value",
        }
      : {
          badge: "Calculadora",
          title: "Inflación y",
          titleAccent: "poder adquisitivo",
          desc:
            "Calcula cuánto necesitas en el futuro para mantener el mismo poder adquisitivo (y cuánto “pierde” hoy tu dinero si no crece).",
          copyLink: "Copiar enlace",
          linkCopied: "Enlace copiado.",
          amount: "Cantidad (€)",
          years: "Años",
          inflation: "Inflación anual (%)",
          futureEquivalent: "Futuro equivalente",
          futureEquivalentDescPrefix: "Para que",
          futureEquivalentDescMid: "“valga lo mismo” en",
          futureEquivalentDescSuffix: "con inflación",
          yearsSuffix: "años",
          futureReal: "Valor real futuro",
          futureRealDescPrefix: "Poder adquisitivo de",
          futureRealDescSuffix: "dentro de",
          accumulatedLoss: "Pérdida acumulada",
          dueToInflation: "Por inflación compuesta",
          yearly: "Evolución anual",
          yearlyDesc: "Tabla aproximada por año (futuro equivalente y valor real).",
          year: "Año",
          realValue: "Valor real",
        };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const a = params.get("a");
    const y = params.get("y");
    const i = params.get("i");

    if (a) setAmount(a);
    if (y) setYears(y);
    if (i) setInflation(i);
  }, []);

  const computed = useMemo(() => {
    const amountValue = clampNumber(parseNumber(amount, 0), 0, 100_000_000);
    const yearsValue = clampNumber(parseNumber(years, 10), 1, 80);
    const inflationValue = clampNumber(parseNumber(inflation, 0), 0, 30);

    const factor = Math.pow(1 + inflationValue / 100, yearsValue);
    const futureNeeded = amountValue * factor;
    const futureRealValue = inflationValue > 0 ? amountValue / factor : amountValue;
    const lossPct = inflationValue > 0 ? (1 - 1 / factor) * 100 : 0;

    const timeline = Array.from({ length: yearsValue }, (_, idx) => {
      const year = idx + 1;
      const f = Math.pow(1 + inflationValue / 100, year);
      return {
        year,
        future: amountValue * f,
        real: amountValue / f,
      };
    });

    return {
      amountValue,
      yearsValue,
      inflationValue,
      factor,
      futureNeeded,
      futureRealValue,
      lossPct,
      timeline,
    };
  }, [amount, inflation, years]);

  const copyShareLink = async () => {
    const shareUrl = buildShareUrl({
      a: amount,
      y: years,
      i: inflation,
    });
    await navigator.clipboard.writeText(shareUrl);
    setToast(copy.linkCopied);
    window.setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="space-y-10">
      <Card className="relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-soft md:p-10">
        <div className="pointer-events-none absolute -top-28 -right-28 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-secondary-foreground/12 bg-secondary-foreground/5 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
              <TrendingDown className="h-4 w-4" />
              {copy.badge}
            </div>

            <h2 className="text-balance text-3xl font-black tracking-tight md:text-4xl">
              {copy.title}{" "}
              <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
                {copy.titleAccent}
              </span>
              .
            </h2>

            <p className="text-sm leading-relaxed text-secondary-foreground/80 md:text-base">
              {copy.desc}
            </p>

            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={copyShareLink} className="gap-2">
                <Copy className="h-4 w-4" />
                {copy.copyLink}
              </Button>
            </div>

            {toast ? (
              <p className="text-xs font-semibold text-secondary-foreground/70">
                {toast}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border-2 border-secondary-foreground/12 bg-secondary-foreground/5 p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-xs text-secondary-foreground/70">
                  {copy.amount}
                </Label>
                <Input
                  id="amount"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 rounded-xl border-2 border-secondary-foreground/12 bg-transparent font-mono text-secondary-foreground placeholder:text-secondary-foreground/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="years" className="text-xs text-secondary-foreground/70">
                  {copy.years}
                </Label>
                <Input
                  id="years"
                  inputMode="numeric"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="h-12 rounded-xl border-2 border-secondary-foreground/12 bg-transparent font-mono text-secondary-foreground placeholder:text-secondary-foreground/40"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="inflation" className="text-xs text-secondary-foreground/70">
                  {copy.inflation}
                </Label>
                <Input
                  id="inflation"
                  inputMode="decimal"
                  value={inflation}
                  onChange={(e) => setInflation(e.target.value)}
                  className="h-12 rounded-xl border-2 border-secondary-foreground/12 bg-transparent font-mono text-secondary-foreground placeholder:text-secondary-foreground/40"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.futureEquivalent}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground">
            {formatCurrency(computed.futureNeeded)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.futureEquivalentDescPrefix} {formatCurrency(computed.amountValue)}{" "}
            {copy.futureEquivalentDescMid} {computed.yearsValue} {copy.yearsSuffix}{" "}
            {copy.futureEquivalentDescSuffix} {formatPercent(computed.inflationValue)}.
          </p>
        </Card>

        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.futureReal}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground">
            {formatCurrency(computed.futureRealValue)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.futureRealDescPrefix} {formatCurrency(computed.amountValue)}{" "}
            {copy.futureRealDescSuffix} {computed.yearsValue} {copy.yearsSuffix}.
          </p>
        </Card>

        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.accumulatedLoss}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground">
            {formatPercent(computed.lossPct)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.dueToInflation} ({formatPercent(computed.inflationValue)}).
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border/60 p-6">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            {copy.yearly}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.yearlyDesc}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-background/60 text-xs uppercase text-muted-foreground">
                <th className="px-6 py-3">{copy.year}</th>
                <th className="px-6 py-3">{copy.futureEquivalent}</th>
                <th className="px-6 py-3">{copy.realValue}</th>
              </tr>
            </thead>
            <tbody>
              {computed.timeline.map((row) => (
                <tr key={row.year} className="border-b border-border/40 last:border-0">
                  <td className="px-6 py-3 font-semibold">{row.year}</td>
                  <td className="px-6 py-3 font-semibold">{formatCurrency(row.future)}</td>
                  <td className="px-6 py-3 text-muted-foreground">{formatCurrency(row.real)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
