"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, Copy, RotateCcw } from "lucide-react";

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

function Sparkline({
  values,
  className,
}: {
  values: number[];
  className?: string;
}) {
  const max = Math.max(1, ...values);
  const points = values.map((v, i) => {
    const x = values.length === 1 ? 0 : (i / (values.length - 1)) * 100;
    const y = 100 - (v / max) * 100;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const path = points.length > 0 ? `M${points.join(" L")}` : "";

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("h-20 w-full", className)}
    >
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.35" />
          <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      {path ? (
        <>
          <path
            d={`${path} L100,100 L0,100 Z`}
            fill="url(#sparkFill)"
            stroke="none"
          />
          <path
            d={path}
            fill="none"
            stroke="rgb(var(--primary))"
            strokeWidth="2.6"
            vectorEffect="non-scaling-stroke"
          />
        </>
      ) : null}
    </svg>
  );
}

export default function CompoundInterestCalculator() {
  const { locale } = useLocale();
  const [principal, setPrincipal] = useState("1000");
  const [monthlyContribution, setMonthlyContribution] = useState("100");
  const [annualReturn, setAnnualReturn] = useState("7");
  const [years, setYears] = useState("10");
  const [inflation, setInflation] = useState("2.5");
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
          badge: "Calculator",
          title: "Compound interest, contributions and",
          titleAccent: "real value",
          desc:
            "Project how much you can accumulate with monthly contributions. Includes inflation adjustment to estimate real purchasing power.",
          initial: "Initial principal",
          monthly: "Monthly contribution",
          annual: "Annual return",
          horizon: "Horizon",
          years: "years",
          copyLink: "Copy link",
          reset: "Reset",
          linkCopied: "Link copied.",
          resetDone: "Values reset.",
          principalLabel: "Initial principal (€)",
          monthlyLabel: "Monthly contribution (€)",
          returnLabel: "Annual return (%)",
          yearsLabel: "Years",
          inflationLabel: "Inflation (%)",
          contribTiming: "Contribution timing",
          endOfMonth: "end of month",
          startOfMonth: "start of month",
          nominalResult: "Nominal result",
          contributed: "Contributed",
          interest: "Interest",
          realResult: "Real result",
          adjustedByInflation: "Adjusted for inflation",
          evolution: "Trend",
          curveNote: "Estimated balance curve per year.",
          tableTitle: "Yearly table",
          tableDesc: "Approximate values. Not financial advice.",
          year: "Year",
          balance: "Balance",
        }
      : {
          badge: "Calculadora",
          title: "Interés compuesto, aportaciones y",
          titleAccent: "valor real",
          desc:
            "Proyecta cuánto puedes acumular con aportaciones mensuales. Incluye ajuste por inflación para ver el poder adquisitivo real.",
          initial: "Capital inicial",
          monthly: "Aportación mensual",
          annual: "Rentabilidad anual",
          horizon: "Horizonte",
          years: "años",
          copyLink: "Copiar enlace",
          reset: "Reset",
          linkCopied: "Enlace copiado.",
          resetDone: "Valores restablecidos.",
          principalLabel: "Capital inicial (€)",
          monthlyLabel: "Aportación mensual (€)",
          returnLabel: "Rentabilidad anual (%)",
          yearsLabel: "Años",
          inflationLabel: "Inflación anual (%)",
          contribTiming: "Aportación",
          endOfMonth: "al final del mes",
          startOfMonth: "al inicio del mes",
          nominalResult: "Resultado nominal",
          contributed: "Aportado",
          interest: "Interés",
          realResult: "Resultado real",
          adjustedByInflation: "Ajustado por inflación",
          evolution: "Evolución",
          curveNote: "Curva del balance estimado por año.",
          tableTitle: "Tabla por año",
          tableDesc: "Valores aproximados. No es asesoramiento financiero.",
          year: "Año",
          balance: "Balance",
        };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");
    const m = params.get("m");
    const r = params.get("r");
    const y = params.get("y");
    const i = params.get("i");
    const t = params.get("t");

    if (p) setPrincipal(p);
    if (m) setMonthlyContribution(m);
    if (r) setAnnualReturn(r);
    if (y) setYears(y);
    if (i) setInflation(i);
    if (t === "start" || t === "end") setTiming(t);
  }, []);

  const computed = useMemo(() => {
    const principalValue = clampNumber(parseNumber(principal, 0), 0, 10_000_000);
    const monthlyValue = clampNumber(parseNumber(monthlyContribution, 0), 0, 1_000_000);
    const annualReturnValue = clampNumber(parseNumber(annualReturn, 0), -50, 80);
    const yearsValue = clampNumber(parseNumber(years, 10), 1, 60);
    const inflationValue = clampNumber(parseNumber(inflation, 0), 0, 30);

    const months = Math.round(yearsValue * 12);
    const monthlyRate = annualReturnValue / 100 / 12;

    let balance = principalValue;
    let contributed = principalValue;
    const schedule: SchedulePoint[] = [];

    for (let month = 1; month <= months; month += 1) {
      if (timing === "start" && monthlyValue > 0) {
        balance += monthlyValue;
        contributed += monthlyValue;
      }

      balance *= 1 + monthlyRate;

      if (timing === "end" && monthlyValue > 0) {
        balance += monthlyValue;
        contributed += monthlyValue;
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

    const inflationFactor = Math.pow(1 + inflationValue / 100, yearsValue);
    const finalRealValue = finalBalance / inflationFactor;
    const finalReal = inflationValue > 0 ? finalRealValue : undefined;
    const totalRealGain =
      inflationValue > 0 ? finalRealValue - totalContributed / inflationFactor : undefined;

    return {
      principalValue,
      monthlyValue,
      annualReturnValue,
      yearsValue,
      inflationValue,
      schedule,
      finalBalance,
      totalContributed,
      totalInterest,
      finalReal,
      totalRealGain,
    };
  }, [annualReturn, inflation, monthlyContribution, principal, timing, years]);

  const chartValues = computed.schedule.map((p) => p.balance);
  const summaryRows = [
    { label: copy.initial, value: formatCurrency(computed.principalValue) },
    { label: copy.monthly, value: formatCurrency(computed.monthlyValue) },
    { label: copy.annual, value: formatPercent(computed.annualReturnValue) },
    { label: copy.horizon, value: `${computed.yearsValue} ${copy.years}` },
  ];

  const copyShareLink = async () => {
    const shareUrl = buildShareUrl({
      p: principal,
      m: monthlyContribution,
      r: annualReturn,
      y: years,
      i: inflation,
      t: timing,
    });
    await navigator.clipboard.writeText(shareUrl);
    setToast(copy.linkCopied);
    window.setTimeout(() => setToast(null), 1800);
  };

  const reset = () => {
    setPrincipal("1000");
    setMonthlyContribution("100");
    setAnnualReturn("7");
    setYears("10");
    setInflation("2.5");
    setTiming("end");
    setToast(copy.resetDone);
    window.setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="space-y-10">
      <Card className="relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-soft md:p-10">
        <div className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-secondary-foreground/12 bg-secondary-foreground/5 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
              <BarChart3 className="h-4 w-4" />
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

            <dl className="grid gap-2 text-sm">
              {summaryRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground/70">
                    {row.label}
                  </dt>
                  <dd className="font-semibold text-secondary-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>

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
                className="gap-2 border-secondary-foreground/20 text-secondary-foreground hover:border-secondary-foreground/35 hover:bg-secondary-foreground/5"
              >
                <RotateCcw className="h-4 w-4" />
                {copy.reset}
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
                <Label htmlFor="principal" className="text-xs text-secondary-foreground/70">
                  {copy.principalLabel}
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
                <Label htmlFor="monthly" className="text-xs text-secondary-foreground/70">
                  {copy.monthlyLabel}
                </Label>
                <Input
                  id="monthly"
                  inputMode="decimal"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="h-12 rounded-xl border-2 border-secondary-foreground/12 bg-transparent font-mono text-secondary-foreground placeholder:text-secondary-foreground/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="return" className="text-xs text-secondary-foreground/70">
                  {copy.returnLabel}
                </Label>
                <Input
                  id="return"
                  inputMode="decimal"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(e.target.value)}
                  className="h-12 rounded-xl border-2 border-secondary-foreground/12 bg-transparent font-mono text-secondary-foreground placeholder:text-secondary-foreground/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="years" className="text-xs text-secondary-foreground/70">
                  {copy.yearsLabel}
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
                  {copy.inflationLabel}
                </Label>
                <Input
                  id="inflation"
                  inputMode="decimal"
                  value={inflation}
                  onChange={(e) => setInflation(e.target.value)}
                  className="h-12 rounded-xl border-2 border-secondary-foreground/12 bg-transparent font-mono text-secondary-foreground placeholder:text-secondary-foreground/40"
                />
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground/70">
                  {copy.contribTiming}
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
            {copy.nominalResult}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground">
            {formatCurrency(computed.finalBalance)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.contributed}: {formatCurrency(computed.totalContributed)} ·{" "}
            {copy.interest}:{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(computed.totalInterest)}
            </span>
          </p>
        </Card>

        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.realResult}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground">
            {computed.finalReal !== undefined
              ? formatCurrency(computed.finalReal)
              : "—"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.adjustedByInflation} ({formatPercent(computed.inflationValue)}).
          </p>
        </Card>

        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.evolution}
          </p>
          <div className="mt-4">
            <Sparkline values={chartValues.length ? chartValues : [computed.finalBalance]} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {copy.curveNote}
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
                    <td className="px-6 py-3 font-semibold">
                      {formatCurrency(p.balance)}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {formatCurrency(interest)}
                    </td>
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
