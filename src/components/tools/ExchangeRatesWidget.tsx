"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, TrendingUp } from "lucide-react";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type RatesOk = {
  ok: true;
  provider: string;
  base: string;
  date: string | null;
  rates: Record<string, number>;
};

type RatesError = {
  ok: false;
  error?: string;
};

type RatesResponse = RatesOk | RatesError;

const DEFAULT_SYMBOLS = ["USD", "GBP", "CHF", "PLN"] as const;

const COPY = {
  es: {
    kicker: "Mercado",
    title: "Tipo de cambio en vivo",
    desc: "Consulta rapida de divisas para comparar costes y evitar sorpresas.",
    amountLabel: "Cantidad (base)",
    ratesLabel: "Conversion",
    loading: "Cargando...",
    refresh: "Actualizar",
    unavailable: "No disponible ahora. Intentalo de nuevo.",
    updatedPrefix: "Actualizado",
    sourcePrefix: "Fuente",
    oneUnit: "1",
  },
  en: {
    kicker: "Market",
    title: "Live exchange rates",
    desc: "Quick FX snapshot to compare costs and avoid surprises.",
    amountLabel: "Amount (base)",
    ratesLabel: "Conversion",
    loading: "Loading...",
    refresh: "Refresh",
    unavailable: "Unavailable right now. Please try again.",
    updatedPrefix: "Updated",
    sourcePrefix: "Source",
    oneUnit: "1",
  },
} as const;

function safeNumber(value: string): number {
  const normalized = value.replace(",", ".").trim();
  const n = Number.parseFloat(normalized);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

function formatDateLabel(date: string | null, locale: "es" | "en"): string | null {
  if (!date) return null;
  const ms = Date.parse(date);
  if (Number.isNaN(ms)) return date;
  return new Date(ms).toLocaleDateString(locale === "en" ? "en-US" : "es-ES", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

type Props = {
  base?: string;
  symbols?: readonly string[];
  className?: string;
};

export default function ExchangeRatesWidget({
  base = "EUR",
  symbols = DEFAULT_SYMBOLS,
  className,
}: Props) {
  const { locale } = useLocale();
  const copy = COPY[locale];
  const numberLocale = locale === "en" ? "en-US" : "es-ES";

  const [amount, setAmount] = useState("100");
  const amountNumber = useMemo(() => safeNumber(amount), [amount]);

  const [data, setData] = useState<RatesOk | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("base", base);
      params.set("symbols", symbols.join(","));

      const response = await fetch(`/api/rates?${params.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      const json = (await response.json().catch(() => null)) as RatesResponse | null;

      if (!response.ok || !json || json.ok !== true) {
        setData(null);
        setError(copy.unavailable);
        return;
      }

      setData(json);
    } catch {
      setData(null);
      setError(copy.unavailable);
    } finally {
      setLoading(false);
    }
  }, [base, symbols, copy.unavailable]);

  useEffect(() => {
    void fetchRates();
  }, [fetchRates]);

  const updatedLabel = useMemo(
    () => formatDateLabel(data?.date ?? null, locale),
    [data?.date, locale],
  );

  const rows = useMemo(() => {
    const rates = data?.rates ?? {};
    return symbols.map((code) => {
      const rate = typeof rates[code] === "number" ? rates[code] : null;
      const converted = rate ? amountNumber * rate : null;
      return { code, rate, converted };
    });
  }, [data?.rates, symbols, amountNumber]);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border-2 border-border bg-card p-6 shadow-soft md:p-8",
        className,
      )}
      aria-label={locale === "en" ? "Exchange rates" : "Tipo de cambio"}
    >
      <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
            <TrendingUp className="h-3.5 w-3.5" />
            {copy.kicker}
          </div>
          <h2 className="text-balance text-2xl font-black tracking-tight md:text-3xl">
            {copy.title}{" "}
            <span className="inline-flex items-center rounded-full border-2 border-border bg-background px-3 py-1 font-mono text-sm font-semibold">
              {base.toUpperCase()}
            </span>
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {copy.desc}
          </p>
          {updatedLabel ? (
            <p className="text-xs text-muted-foreground">
              {copy.updatedPrefix}: {updatedLabel}
            </p>
          ) : null}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fetchRates}
          disabled={loading}
          className="shrink-0 gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          {loading ? copy.loading : copy.refresh}
        </Button>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-12">
        <div className="rounded-2xl border-2 border-border bg-background/50 p-5 shadow-soft lg:col-span-4">
          <label
            htmlFor="fx-amount"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground"
          >
            {copy.amountLabel}
          </label>
          <div className="mt-3 flex items-center gap-3">
            <Input
              id="fx-amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="font-mono"
              aria-label={copy.amountLabel}
            />
            <span className="rounded-xl border-2 border-border bg-card px-3 py-2 text-sm font-black">
              {base.toUpperCase()}
            </span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {copy.oneUnit} {base.toUpperCase()} {"->"} {symbols.join(", ")}
          </p>
        </div>

        <div className="rounded-2xl border-2 border-border bg-background/50 p-5 shadow-soft lg:col-span-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.ratesLabel}
          </p>

          {error ? (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          ) : null}

          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {rows.map((row) => {
              const rateLabel =
                row.rate === null
                  ? "-"
                  : new Intl.NumberFormat(numberLocale, {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 6,
                    }).format(row.rate);

              const convertedLabel =
                row.converted === null
                  ? "-"
                  : new Intl.NumberFormat(numberLocale, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(row.converted);

              return (
                <li
                  key={row.code}
                  className="flex items-center justify-between gap-4 rounded-2xl border-2 border-border bg-card px-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-black tracking-tight text-foreground">
                      {row.code}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      1 {base.toUpperCase()} = {rateLabel} {row.code}
                    </p>
                  </div>

                  <p className="shrink-0 font-mono text-sm font-semibold text-foreground">
                    {convertedLabel} {row.code}
                  </p>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 text-xs text-muted-foreground">
            {copy.sourcePrefix}: {data?.provider ?? "-"}
          </p>
        </div>
      </div>
    </section>
  );
}
