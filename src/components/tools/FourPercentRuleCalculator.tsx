"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Flame, RotateCcw } from "lucide-react";

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

export default function FourPercentRuleCalculator() {
  const { locale } = useLocale();
  const [monthly, setMonthly] = useState("1500");
  const [swr, setSwr] = useState("4");
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
          title: "4% rule",
          titleAccent: "4%",
          titleSuffix: "(target portfolio)",
          desc:
            "Quick estimate of the portfolio needed to sustain an annual spend based on a withdrawal rate (“safe withdrawal rate”).",
          copyLink: "Copy link",
          reset: "Reset",
          linkCopied: "Link copied.",
          resetDone: "Values reset.",
          monthly: "Target monthly spend/income (€)",
          swr: "Withdrawal rate (%)",
          estimatedCapital: "Estimated capital",
          withWithdrawal: "With withdrawal",
          annualSpend: "Annual spend",
          perMonth: "per month",
          noteTitle: "Note",
          note:
            "This is a rule of thumb based on historical studies. It doesn’t guarantee results and it doesn’t replace financial advice.",
        }
      : {
          title: "Regla del",
          titleAccent: "4%",
          titleSuffix: "(capital objetivo)",
          desc:
            "Estimación rápida de capital necesario para sostener un gasto anual según un porcentaje de retirada (“safe withdrawal rate”).",
          copyLink: "Copiar enlace",
          reset: "Reset",
          linkCopied: "Enlace copiado.",
          resetDone: "Valores restablecidos.",
          monthly: "Gasto/ingreso mensual objetivo (€)",
          swr: "Porcentaje de retirada (%)",
          estimatedCapital: "Capital estimado",
          withWithdrawal: "Con retirada",
          annualSpend: "Gasto anual",
          perMonth: "/ mes",
          noteTitle: "Nota",
          note:
            "Es una regla orientativa basada en estudios históricos. No garantiza resultados ni sustituye asesoramiento financiero.",
        };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get("m");
    const s = params.get("s");
    if (m) setMonthly(m);
    if (s) setSwr(s);
  }, []);

  const computed = useMemo(() => {
    const monthlyValue = clampNumber(parseNumber(monthly, 0), 0, 1_000_000);
    const swrValue = clampNumber(parseNumber(swr, 4), 0.5, 10);

    const annual = monthlyValue * 12;
    const rate = swrValue / 100;
    const requiredCapital = rate > 0 ? annual / rate : Number.POSITIVE_INFINITY;

    return {
      monthlyValue,
      annual,
      swrValue,
      requiredCapital,
    };
  }, [monthly, swr]);

  const copyShareLink = async () => {
    const shareUrl = buildShareUrl({ m: monthly, s: swr });
    await navigator.clipboard.writeText(shareUrl);
    setToast(copy.linkCopied);
    window.setTimeout(() => setToast(null), 1800);
  };

  const reset = () => {
    setMonthly("1500");
    setSwr("4");
    setToast(copy.resetDone);
    window.setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="space-y-10">
      <Card className="relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-soft md:p-10">
        <div className="pointer-events-none absolute -top-28 -right-28 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-secondary-foreground/12 bg-secondary-foreground/5 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
              <Flame className="h-4 w-4" />
              FIRE
            </div>

            <h2 className="text-balance text-3xl font-black tracking-tight md:text-4xl">
              {copy.title}{" "}
              <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
                {copy.titleAccent}
              </span>{" "}
              {copy.titleSuffix}
            </h2>

            <p className="text-sm leading-relaxed text-secondary-foreground/80 md:text-base">
              {copy.desc}
            </p>

            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={copyShareLink} className="gap-2">
                <Copy className="h-4 w-4" />
                {copy.copyLink}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={reset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                {copy.reset}
              </Button>
            </div>

            {toast ? <p className="text-xs font-semibold text-accent">{toast}</p> : null}
          </div>

          <div className="rounded-2xl border-2 border-secondary-foreground/10 bg-secondary-foreground/5 p-6 backdrop-blur">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="monthly" className="text-xs text-secondary-foreground/70">
                  {copy.monthly}
                </Label>
                <Input
                  id="monthly"
                  inputMode="decimal"
                  value={monthly}
                  onChange={(e) => setMonthly(e.target.value)}
                  className="h-12 rounded-xl border-2 border-secondary-foreground/12 bg-transparent font-mono text-secondary-foreground placeholder:text-secondary-foreground/40"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="swr" className="text-xs text-secondary-foreground/70">
                  {copy.swr}
                </Label>
                <Input
                  id="swr"
                  inputMode="decimal"
                  value={swr}
                  onChange={(e) => setSwr(e.target.value)}
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
            {copy.estimatedCapital}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground">
            {Number.isFinite(computed.requiredCapital)
              ? formatCurrency(computed.requiredCapital)
              : "—"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.withWithdrawal} {formatPercent(computed.swrValue)}.
          </p>
        </Card>

        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.annualSpend}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground">
            {formatCurrency(computed.annual)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            ({formatCurrency(computed.monthlyValue)} {copy.perMonth})
          </p>
        </Card>

        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.noteTitle}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {copy.note}
          </p>
        </Card>
      </div>
    </div>
  );
}
