"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, RotateCcw, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

type ContributionTiming = "start" | "end";

type SchedulePoint = {
  year: number;
  balance: number;
  contributed: number;
};

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

export default function SavingsGoalCalculator() {
  const { locale } = useLocale();
  const [target, setTarget] = useState("50000");
  const [principal, setPrincipal] = useState("1000");
  const [annualReturn, setAnnualReturn] = useState("6");
  const [years, setYears] = useState("10");
  const [timing, setTiming] = useState<ContributionTiming>("end");
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
          badge: "Goal",
          title: "How much to contribute",
          titleAccent: "per month",
          titleSuffix: "to reach your goal?",
          desc:
            "Estimate the monthly contribution needed to reach a target (with or without an initial balance) and an expected return.",
          copyLink: "Copy link",
          reset: "Reset",
          linkCopied: "Link copied.",
          resetDone: "Values reset.",
          target: "Target amount (€)",
          principal: "Initial principal (€)",
          years: "Years",
          annualReturn: "Expected annual return (%)",
          timing: "Contribution timing",
          endOfMonth: "end of month",
          startOfMonth: "start of month",
          monthlyNeeded: "Monthly contribution",
          toReach: "To reach",
          in: "in",
          yearsSuffix: "years",
          estimatedResult: "Estimated result",
          progress: "Progress",
          contributedAndInterest: "Contributions & interest",
          contributed: "Contributed",
          interest: "Interest",
          returnPerYear: "Return",
          perYear: "per year",
          tableTitle: "Yearly table",
          tableDesc: "Approximate values. Not financial advice.",
          year: "Year",
          balance: "Balance",
        }
      : {
          badge: "Objetivo",
          title: "¿Cuánto aportar",
          titleAccent: "al mes",
          titleSuffix: "para llegar a tu meta?",
          desc:
            "Calcula la aportación mensual aproximada para alcanzar un objetivo (con o sin capital inicial) y una rentabilidad esperada.",
          copyLink: "Copiar enlace",
          reset: "Reset",
          linkCopied: "Enlace copiado.",
          resetDone: "Valores restablecidos.",
          target: "Objetivo final (€)",
          principal: "Capital inicial (€)",
          years: "Años",
          annualReturn: "Rentabilidad anual esperada (%)",
          timing: "Aportación",
          endOfMonth: "al final del mes",
          startOfMonth: "al inicio del mes",
          monthlyNeeded: "Aportación mensual",
          toReach: "Para llegar a",
          in: "en",
          yearsSuffix: "años",
          estimatedResult: "Resultado estimado",
          progress: "Progreso",
          contributedAndInterest: "Aportado e interés",
          contributed: "Aportado",
          interest: "Interés",
          returnPerYear: "Rentabilidad",
          perYear: "al año",
          tableTitle: "Tabla por año",
          tableDesc: "Valores aproximados. No es asesoramiento financiero.",
          year: "Año",
          balance: "Balance",
        };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("t");
    const p = params.get("p");
    const r = params.get("r");
    const y = params.get("y");
    const ti = params.get("ti");

    if (t) setTarget(t);
    if (p) setPrincipal(p);
    if (r) setAnnualReturn(r);
    if (y) setYears(y);
    if (ti === "start" || ti === "end") setTiming(ti);
  }, []);

  const computed = useMemo(() => {
    const targetValue = clampNumber(parseNumber(target, 0), 0, 100_000_000);
    const principalValue = clampNumber(parseNumber(principal, 0), 0, 100_000_000);
    const annualReturnValue = clampNumber(parseNumber(annualReturn, 0), -50, 80);
    const yearsValue = clampNumber(parseNumber(years, 10), 1, 80);

    const months = Math.round(yearsValue * 12);
    const monthlyRate = annualReturnValue / 100 / 12;
    const growthFactor = Math.pow(1 + monthlyRate, months);

    const requiredFromContributions = targetValue - principalValue * growthFactor;

    let monthlyNeeded = 0;
    if (months <= 0) {
      monthlyNeeded = 0;
    } else if (Math.abs(monthlyRate) < 1e-12) {
      monthlyNeeded = requiredFromContributions / months;
    } else {
      const annuityFactorBase = (growthFactor - 1) / monthlyRate;
      const annuityFactor =
        timing === "start" ? annuityFactorBase * (1 + monthlyRate) : annuityFactorBase;
      monthlyNeeded = annuityFactor !== 0 ? requiredFromContributions / annuityFactor : 0;
    }

    monthlyNeeded = Math.max(0, monthlyNeeded);

    let balance = principalValue;
    let contributed = principalValue;
    const schedule: SchedulePoint[] = [];

    for (let month = 1; month <= months; month += 1) {
      if (timing === "start" && monthlyNeeded > 0) {
        balance += monthlyNeeded;
        contributed += monthlyNeeded;
      }

      balance *= 1 + monthlyRate;

      if (timing === "end" && monthlyNeeded > 0) {
        balance += monthlyNeeded;
        contributed += monthlyNeeded;
      }

      if (month % 12 === 0) {
        schedule.push({
          year: month / 12,
          balance,
          contributed,
        });
      }
    }

    const finalBalance = balance;
    const totalContributed = contributed;
    const totalInterest = finalBalance - totalContributed;

    const progressPct =
      targetValue > 0 ? clampNumber((finalBalance / targetValue) * 100, 0, 100) : 0;

    return {
      targetValue,
      principalValue,
      annualReturnValue,
      yearsValue,
      months,
      monthlyRate,
      monthlyNeeded,
      schedule,
      finalBalance,
      totalContributed,
      totalInterest,
      progressPct,
    };
  }, [annualReturn, principal, target, timing, years]);

  const copyShareLink = async () => {
    const shareUrl = buildShareUrl({
      t: target,
      p: principal,
      r: annualReturn,
      y: years,
      ti: timing,
    });
    await navigator.clipboard.writeText(shareUrl);
    setToast(copy.linkCopied);
    window.setTimeout(() => setToast(null), 1800);
  };

  const reset = () => {
    setTarget("50000");
    setPrincipal("1000");
    setAnnualReturn("6");
    setYears("10");
    setTiming("end");
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
              <Target className="h-4 w-4" />
              {copy.badge}
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
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={reset}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {copy.reset}
              </Button>
            </div>

            {toast ? <p className="text-xs font-semibold text-accent">{toast}</p> : null}
          </div>

          <div className="rounded-2xl border-2 border-secondary-foreground/10 bg-secondary-foreground/5 p-6 backdrop-blur">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="target" className="text-xs text-secondary-foreground/70">
                  {copy.target}
                </Label>
                <Input
                  id="target"
                  inputMode="decimal"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="h-12 rounded-xl border-2 border-secondary-foreground/12 bg-transparent font-mono text-secondary-foreground placeholder:text-secondary-foreground/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="principal" className="text-xs text-secondary-foreground/70">
                  {copy.principal}
                </Label>
                <Input
                  id="principal"
                  inputMode="decimal"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
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
                <Label
                  htmlFor="annualReturn"
                  className="text-xs text-secondary-foreground/70"
                >
                  {copy.annualReturn}
                </Label>
                <Input
                  id="annualReturn"
                  inputMode="decimal"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(e.target.value)}
                  className="h-12 rounded-xl border-2 border-secondary-foreground/12 bg-transparent font-mono text-secondary-foreground placeholder:text-secondary-foreground/40"
                />
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground/70">
                  {copy.timing}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(
                    [
                      { id: "end", label: copy.endOfMonth },
                      { id: "start", label: copy.startOfMonth },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTiming(opt.id)}
                      className={cn(
                        "rounded-full border-2 px-4 py-2 text-xs font-semibold transition-colors",
                        timing === opt.id
                          ? "border-secondary bg-accent text-accent-foreground shadow-offset-accent"
                          : "border-secondary-foreground/15 bg-secondary-foreground/5 text-secondary-foreground hover:border-secondary-foreground/25"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.monthlyNeeded}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground">
            {formatCurrency(computed.monthlyNeeded)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.toReach} {formatCurrency(computed.targetValue)} {copy.in}{" "}
            {computed.yearsValue} {copy.yearsSuffix}.
          </p>
        </Card>

        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.estimatedResult}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground">
            {formatCurrency(computed.finalBalance)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.progress}:{" "}
            <span className="font-semibold text-foreground">
              {computed.progressPct.toFixed(0)}%
            </span>
          </p>
        </Card>

        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.contributedAndInterest}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {copy.contributed}:{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(computed.totalContributed)}
            </span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.interest}:{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(computed.totalInterest)}
            </span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {copy.returnPerYear}: {formatPercent(computed.annualReturnValue)}{" "}
            {copy.perYear}.
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border/60 p-6">
          <h3 className="text-lg font-black tracking-tight">{copy.tableTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.tableDesc}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-background/60 text-xs uppercase text-muted-foreground">
                <th className="px-6 py-3">{copy.year}</th>
                <th className="px-6 py-3">{copy.contributed}</th>
                <th className="px-6 py-3">{copy.balance}</th>
                <th className="px-6 py-3">{copy.interest}</th>
              </tr>
            </thead>
            <tbody>
              {computed.schedule.map((p) => {
                const interest = p.balance - p.contributed;
                return (
                  <tr key={p.year} className="border-b border-border/40 last:border-0">
                    <td className="px-6 py-3 font-semibold">{p.year}</td>
                    <td className="px-6 py-3">{formatCurrency(p.contributed)}</td>
                    <td className="px-6 py-3 font-semibold">{formatCurrency(p.balance)}</td>
                    <td className="px-6 py-3 text-muted-foreground">{formatCurrency(interest)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
