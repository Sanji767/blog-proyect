"use client";

import { useEffect, useMemo, useState } from "react";
import { Calculator, Copy, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/components/i18n/LocaleProvider";

type Compounding = "monthly" | "quarterly" | "yearly";

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

function compoundingToPeriods(value: Compounding): number {
  switch (value) {
    case "monthly":
      return 12;
    case "quarterly":
      return 4;
    case "yearly":
      return 1;
  }
}

export default function TaeCalculator() {
  const { locale } = useLocale();
  const [tin, setTin] = useState("3.5");
  const [compounding, setCompounding] = useState<Compounding>("monthly");
  const [amount, setAmount] = useState("10000");
  const [annualFee, setAnnualFee] = useState("0");
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

  const copy =
    locale === "en"
      ? {
          title: "APR/APY calculator",
          titleAccent: "APR/APY",
          titleSuffix: "(from nominal rate)",
          desc:
            "Convert nominal rate to an effective annual rate based on compounding and estimate yearly interest (with an optional fixed fee).",
          copyLink: "Copy link",
          reset: "Reset",
          linkCopied: "Link copied.",
          resetDone: "Values reset.",
          compounding: "Compounding",
          monthly: "monthly",
          quarterly: "quarterly",
          yearly: "yearly",
          principal: "Principal (€)",
          annualFee: "Fixed annual fee (€)",
          periodsPrefix: "With",
          periodsSuffix: "periods/year.",
          annualInterest: "Annual interest (approx.)",
          on: "On",
          net: "Net (with fee)",
          breakEven: "Break-even point",
          noteTitle: "Note",
          note:
            "This calculator simplifies the effective rate calculation (compounding) and an optional fixed fee. Real accounts may include additional conditions (tiers, average balance, limits, taxes).",
        }
      : {
          title: "Calculadora",
          titleAccent: "TAE",
          titleSuffix: "(desde TIN)",
          desc:
            "Convierte TIN a TAE según la frecuencia de capitalización y estima el interés anual (con comisión fija opcional).",
          copyLink: "Copiar enlace",
          reset: "Reset",
          linkCopied: "Enlace copiado.",
          resetDone: "Valores restablecidos.",
          compounding: "Capitalización",
          monthly: "mensual",
          quarterly: "trimestral",
          yearly: "anual",
          principal: "Capital (€)",
          annualFee: "Comisión anual fija (€)",
          periodsPrefix: "Con",
          periodsSuffix: "periodos/año.",
          annualInterest: "Interés anual (aprox.)",
          on: "Sobre",
          net: "Neto (con comisión)",
          breakEven: "Punto de equilibrio",
          noteTitle: "Nota",
          note:
            "Esta calculadora simplifica el cálculo de TAE (capitalización) y una comisión fija. En cuentas reales pueden existir condiciones adicionales (saldo medio, tramos, límites, impuestos).",
        };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("t");
    const c = params.get("c");
    const a = params.get("a");
    const f = params.get("f");

    if (t) setTin(t);
    if (c === "monthly" || c === "quarterly" || c === "yearly") setCompounding(c);
    if (a) setAmount(a);
    if (f) setAnnualFee(f);
  }, []);

  const computed = useMemo(() => {
    const tinValue = clampNumber(parseNumber(tin, 0), -50, 80);
    const amountValue = clampNumber(parseNumber(amount, 0), 0, 100_000_000);
    const annualFeeValue = clampNumber(parseNumber(annualFee, 0), 0, 1_000_000);

    const periods = compoundingToPeriods(compounding);
    const ratePerPeriod = tinValue / 100 / periods;
    const tae = (Math.pow(1 + ratePerPeriod, periods) - 1) * 100;

    const grossInterest = amountValue * (tae / 100);
    const netInterest = grossInterest - annualFeeValue;
    const breakEven = tae > 0 ? annualFeeValue / (tae / 100) : undefined;

    return {
      tinValue,
      periods,
      tae,
      amountValue,
      annualFeeValue,
      grossInterest,
      netInterest,
      breakEven,
    };
  }, [amount, annualFee, compounding, tin]);

  const copyShareLink = async () => {
    const shareUrl = buildShareUrl({
      t: tin,
      c: compounding,
      a: amount,
      f: annualFee,
    });
    await navigator.clipboard.writeText(shareUrl);
    setToast(copy.linkCopied);
    window.setTimeout(() => setToast(null), 1800);
  };

  const reset = () => {
    setTin("3.5");
    setCompounding("monthly");
    setAmount("10000");
    setAnnualFee("0");
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
              TAE
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
                <Label htmlFor="tin" className="text-xs text-secondary-foreground/70">
                  TIN (%)
                </Label>
                <Input
                  id="tin"
                  inputMode="decimal"
                  value={tin}
                  onChange={(e) => setTin(e.target.value)}
                  className="h-12 rounded-xl border-2 border-secondary-foreground/12 bg-transparent font-mono text-secondary-foreground placeholder:text-secondary-foreground/40"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground/70">
                  {copy.compounding}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(
                    [
                      { id: "monthly", label: copy.monthly },
                      { id: "quarterly", label: copy.quarterly },
                      { id: "yearly", label: copy.yearly },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCompounding(opt.id)}
                      className={[
                        "rounded-full border-2 px-4 py-2 text-xs font-semibold transition-colors",
                        compounding === opt.id
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
                <Label htmlFor="amount" className="text-xs text-secondary-foreground/70">
                  {copy.principal}
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
                <Label htmlFor="annualFee" className="text-xs text-secondary-foreground/70">
                  {copy.annualFee}
                </Label>
                <Input
                  id="annualFee"
                  inputMode="decimal"
                  value={annualFee}
                  onChange={(e) => setAnnualFee(e.target.value)}
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
            TAE
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground">
            {formatPercent(computed.tae)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.periodsPrefix} {computed.periods} {copy.periodsSuffix}
          </p>
        </Card>

        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.annualInterest}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground">
            {formatCurrency(computed.grossInterest)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.on} {formatCurrency(computed.amountValue)}.
          </p>
        </Card>

        <Card className="p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.net}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground">
            {formatCurrency(computed.netInterest)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {copy.breakEven}:{" "}
            {computed.breakEven !== undefined
              ? formatCurrency(computed.breakEven)
              : "—"}
          </p>
        </Card>
      </div>

      <Card className="p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {copy.noteTitle}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {copy.note}
        </p>
      </Card>
    </div>
  );
}
