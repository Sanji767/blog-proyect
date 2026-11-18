"use client";

import { useEffect, useMemo, useState } from "react";
import { Calculator, Copy, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/components/i18n/LocaleProvider";

type RateType = "variable" | "fixed";

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

/** French amortization: monthly payment for a loan. Annual rate in percent. */
function monthlyPayment(principal: number, annualRatePercent: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate <= 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, -months);
  return (principal * monthlyRate) / (1 - factor);
}

const DEFAULTS = {
  principal: "150000",
  years: "25",
  euribor: "3.29",
  differential: "1",
  fixedRate: "3.5",
  newEuribor: "3.29",
};

export default function MortgageCalculator() {
  const { locale } = useLocale();
  const [principal, setPrincipal] = useState(DEFAULTS.principal);
  const [years, setYears] = useState(DEFAULTS.years);
  const [rateType, setRateType] = useState<RateType>("variable");
  const [euribor, setEuribor] = useState(DEFAULTS.euribor);
  const [differential, setDifferential] = useState(DEFAULTS.differential);
  const [fixedRate, setFixedRate] = useState(DEFAULTS.fixedRate);
  const [newEuribor, setNewEuribor] = useState(DEFAULTS.newEuribor);
  const [toast, setToast] = useState<string | null>(null);

  const intlLocale = locale === "en" ? "en-US" : "es-ES";

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(intlLocale, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
      }),
    [intlLocale],
  );

  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(intlLocale, {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [intlLocale],
  );

  const formatCurrency = (value: number) => currencyFormatter.format(value);
  const formatPercent = (value: number) => percentFormatter.format(value / 100);
  const formatSignedCurrency = (value: number) =>
    `${value > 0 ? "+" : value < 0 ? "−" : ""}${currencyFormatter.format(Math.abs(value))}`;

  const copy =
    locale === "en"
      ? {
          title: "Mortgage",
          titleAccent: "calculator",
          titleSuffix: "(Euribor + spread)",
          desc:
            "Work out your monthly mortgage payment with a variable rate (12-month Euribor + spread) or a fixed rate, and see what changes at your next reset.",
          copyLink: "Copy link",
          reset: "Reset",
          linkCopied: "Link copied.",
          resetDone: "Values reset.",
          rateType: "Rate type",
          variable: "Variable (Euribor + spread)",
          fixed: "Fixed rate",
          principal: "Outstanding capital (€)",
          years: "Remaining term (years)",
          euribor: "12-month Euribor (%)",
          differential: "Spread / differential (%)",
          fixedRate: "Fixed rate (TIN, %)",
          newEuribor: "Euribor at next reset (%)",
          newEuriborHint:
            "Enter the Euribor value you expect at your next annual reset to simulate the new payment.",
          currentRate: "Current rate",
          monthlyPayment: "Monthly payment",
          totalInterest: "Total interest",
          totalPaid: "Total paid",
          over: "Over",
          yearsSuffix: "years.",
          afterReset: "Payment after reset",
          monthlyChange: "Monthly change",
          resetNote:
            "With a variable mortgage, the payment is recalculated at each reset using the current Euribor plus your spread.",
          noteTitle: "Note",
          note:
            "This calculator uses the French amortization system and ignores fees, insurance, taxes and floor clauses. The default Euribor (3.29%) is the November 2026 monthly average — enter the current value for an accurate estimate.",
        }
      : {
          title: "Calculadora de",
          titleAccent: "hipoteca",
          titleSuffix: "(euríbor + diferencial)",
          desc:
            "Calcula tu cuota mensual con tipo variable (euríbor a 12 meses + diferencial) o tipo fijo, y simula cuánto cambiará en la próxima revisión.",
          copyLink: "Copiar enlace",
          reset: "Reset",
          linkCopied: "Enlace copiado.",
          resetDone: "Valores restablecidos.",
          rateType: "Tipo de interés",
          variable: "Variable (euríbor + diferencial)",
          fixed: "Fijo",
          principal: "Capital pendiente (€)",
          years: "Plazo restante (años)",
          euribor: "Euríbor a 12 meses (%)",
          differential: "Diferencial (%)",
          fixedRate: "Tipo fijo (TIN, %)",
          newEuribor: "Euríbor en la próxima revisión (%)",
          newEuriborHint:
            "Escribe el euríbor que esperas en tu próxima revisión anual para simular la nueva cuota.",
          currentRate: "Tipo actual",
          monthlyPayment: "Cuota mensual",
          totalInterest: "Intereses totales",
          totalPaid: "Total pagado",
          over: "A lo largo de",
          yearsSuffix: "años.",
          afterReset: "Cuota tras la revisión",
          monthlyChange: "Cambio mensual",
          resetNote:
            "Con una hipoteca variable, la cuota se recalcula en cada revisión con el euríbor vigente más tu diferencial.",
          noteTitle: "Nota",
          note:
            "Esta calculadora usa el sistema de amortización francés e ignora comisiones, seguros, impuestos y cláusulas suelo. El euríbor por defecto (3,29 %) es la media de noviembre de 2026: introduce el valor actual para una estimación precisa.",
        };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");
    const y = params.get("y");
    const t = params.get("t");
    const e = params.get("e");
    const d = params.get("d");
    const f = params.get("f");
    const r = params.get("r");

    if (p) setPrincipal(p);
    if (y) setYears(y);
    if (t === "variable" || t === "fixed") setRateType(t);
    if (e) setEuribor(e);
    if (d) setDifferential(d);
    if (f) setFixedRate(f);
    if (r) setNewEuribor(r);
  }, []);

  const computed = useMemo(() => {
    const principalValue = clampNumber(parseNumber(principal, 0), 0, 100_000_000);
    const yearsValue = clampNumber(parseNumber(years, 0), 0, 50);
    const euriborValue = clampNumber(parseNumber(euribor, 0), -5, 30);
    const differentialValue = clampNumber(parseNumber(differential, 0), 0, 10);
    const fixedRateValue = clampNumber(parseNumber(fixedRate, 0), 0, 30);
    const newEuriborValue = clampNumber(parseNumber(newEuribor, 0), -5, 30);

    const months = Math.round(yearsValue * 12);
    const annualRate =
      rateType === "variable" ? euriborValue + differentialValue : fixedRateValue;
    const payment = monthlyPayment(principalValue, annualRate, months);
    const totalPaid = payment * months;
    const totalInterest = Math.max(0, totalPaid - principalValue);

    const resetRate = newEuriborValue + differentialValue;
    const resetPayment = monthlyPayment(principalValue, resetRate, months);
    const monthlyChange = resetPayment - payment;

    return {
      principalValue,
      yearsValue,
      months,
      annualRate,
      payment,
      totalPaid,
      totalInterest,
      resetRate,
      resetPayment,
      monthlyChange,
    };
  }, [differential, euribor, fixedRate, newEuribor, principal, rateType, years]);

  const copyShareLink = async () => {
    const shareUrl = buildShareUrl({
      p: principal,
      y: years,
      t: rateType,
      e: euribor,
      d: differential,
      f: fixedRate,
      r: newEuribor,
    });
    await navigator.clipboard.writeText(shareUrl);
    setToast(copy.linkCopied);
    window.setTimeout(() => setToast(null), 1800);
  };

  const reset = () => {
    setPrincipal(DEFAULTS.principal);
    setYears(DEFAULTS.years);
    setRateType("variable");
    setEuribor(DEFAULTS.euribor);
    setDifferential(DEFAULTS.differential);
    setFixedRate(DEFAULTS.fixedRate);
    setNewEuribor(DEFAULTS.newEuribor);
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
              <Calculator className="h-4 w-4" />
              {locale === "en" ? "Mortgage" : "Hipoteca"}
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
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground/70">
                  {copy.rateType}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(
                    [
                      { id: "variable", label: copy.variable },
                      { id: "fixed", label: copy.fixed },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setRateType(opt.id)}
                      className={[
                        "rounded-full border-2 px-4 py-2 text-xs font-semibold transition-colors",
                        rateType === opt.id
                          ? "border-secondary bg-accent text-accent-foreground shadow-offset-accent"
                          : "border-secondary-foreground/15 bg-secondary-foreground/5 text-secondary-foreground hover:border-secondary-foreground/25",
                      ].join(" ")}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
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
                  inputMode="decimal"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="h-12 rounded-xl border-2 border-secondary-foreground/12 bg-transparent font-mono text-secondary-foreground placeholder:text-secondary-foreground/40"
                />
              </div>

              {rateType === "variable" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="euribor" className="text-xs text-secondary-foreground/70">
                      {copy.euribor}
                    </Label>
                    <Input
                      id="euribor"
                      inputMode="decimal"
                      value={euribor}
                      onChange={(e) => setEuribor(e.target.value)}
                      className="h-12 rounded-xl border-2 border-secondary-foreground/12 bg-transparent font-mono text-secondary-foreground placeholder:text-secondary-foreground/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="differential" className="text-xs text-secondary-foreground/70">
                      {copy.differential}
                    </Label>
                    <Input
                      id="differential"
                      inputMode="decimal"
                      value={differential}
                      onChange={(e) => setDifferential(e.target.value)}
                      className="h-12 rounded-xl border-2 border-secondary-foreground/12 bg-transparent font-mono text-secondary-foreground placeholder:text-secondary-foreground/40"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="newEuribor" className="text-xs text-secondary-foreground/70">
                      {copy.newEuribor}
                    </Label>
                    <Input
                      id="newEuribor"
                      inputMode="decimal"
                      value={newEuribor}
                      onChange={(e) => setNewEuribor(e.target.value)}
                      className="h-12 rounded-xl border-2 border-secondary-foreground/12 bg-transparent font-mono text-secondary-foreground placeholder:text-secondary-foreground/40"
                    />
                    <p className="text-xs leading-relaxed text-secondary-foreground/60">
                      {copy.newEuriborHint}
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="fixedRate" className="text-xs text-secondary-foreground/70">
                    {copy.fixedRate}
                  </Label>
                  <Input
                    id="fixedRate"
                    inputMode="decimal"
                    value={fixedRate}
                    onChange={(e) => setFixedRate(e.target.value)}
                    className="h-12 rounded-xl border-2 border-secondary-foreground/12 bg-transparent font-mono text-secondary-foreground placeholder:text-secondary-foreground/40"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.monthlyPayment}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground">
            {formatCurrency(computed.payment)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.currentRate}: {formatPercent(computed.annualRate)}
          </p>
        </Card>

        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.totalInterest}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground">
            {formatCurrency(computed.totalInterest)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.over} {computed.yearsValue} {copy.yearsSuffix}
          </p>
        </Card>

        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.totalPaid}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground">
            {formatCurrency(computed.totalPaid)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.over} {computed.months}{" "}
            {locale === "en" ? "monthly payments." : "cuotas mensuales."}
          </p>
        </Card>
      </div>

      {rateType === "variable" ? (
        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.afterReset}
          </p>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <p className="text-3xl font-black tracking-tight text-foreground">
              {formatCurrency(computed.resetPayment)}
            </p>
            <p className="text-xl font-black tracking-tight text-primary">
              {formatSignedCurrency(computed.monthlyChange)}
              <span className="ml-2 text-sm font-semibold text-muted-foreground">
                {copy.monthlyChange.toLowerCase()}
              </span>
            </p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.resetNote}{" "}
            {locale === "en"
              ? `New rate: ${formatPercent(computed.resetRate)}.`
              : `Nuevo tipo: ${formatPercent(computed.resetRate)}.`}
          </p>
        </Card>
      ) : null}

      <Card className="p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {copy.noteTitle}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.note}</p>
      </Card>
    </div>
  );
}
