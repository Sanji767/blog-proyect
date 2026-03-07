"use client";

// src/app/iban/IbanClient.tsx

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Clock,
  Copy,
  Download,
  Globe,
  Search,
  ShieldCheck,
  Share2,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";

import Container from "@/components/layout/Container";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { BANK_REGISTRY } from "./BankData";
import { IBAN_MAP } from "./IBANMap";

type SuccessResult = {
  type: "success";
  country: string;
  countryCode: string;
  isSEPA: boolean;
  length: number;
  example: string;
  isValid: boolean;
  cleanValue: string;
  bankInfo?: { name: string; bic: string };
  breakdown: Array<{ label: string; value: string; desc?: string }>;
};

type ErrorResult = { type: "error"; error: string };
type ScanResult = SuccessResult | ErrorResult | null;

type HistoryEntry = {
  id: string;
  iban: string;
  formatted: string;
  result: SuccessResult;
  timestamp: string;
};

type IbanCopy = {
  unknownCountryPrefix: string;
  breakdownCountry: string;
  breakdownCheck: string;
  breakdownBank: string;
  breakdownBranch: string;
  breakdownAccount: string;
};

const COPY: Record<Locale, IbanCopy> = {
  es: {
    unknownCountryPrefix: "Prefijo de país no reconocido",
    breakdownCountry: "País",
    breakdownCheck: "Control",
    breakdownBank: "Entidad",
    breakdownBranch: "Sucursal",
    breakdownAccount: "Cuenta",
  },
  en: {
    unknownCountryPrefix: "Unknown country prefix",
    breakdownCountry: "Country",
    breakdownCheck: "Check digits",
    breakdownBank: "Bank",
    breakdownBranch: "Branch",
    breakdownAccount: "Account",
  },
};

function validateIBAN(input: string, copy: IbanCopy): ScanResult {
  const clean = input.replace(/\s/g, "").toUpperCase();
  if (clean.length < 2) return null;

  const prefix = clean.slice(0, 2);
  const countryData = IBAN_MAP[prefix as keyof typeof IBAN_MAP];
  if (!countryData) {
    return { type: "error", error: copy.unknownCountryPrefix };
  }

  const bankCode = clean.slice(4, 8);
  const bankInfo = BANK_REGISTRY[bankCode as keyof typeof BANK_REGISTRY];

  let isValid = false;
  if (clean.length === countryData.length) {
    const rearranged = clean.slice(4) + clean.slice(0, 4);
    let numStr = "";
    for (const char of rearranged) {
      const code = char.charCodeAt(0);
      numStr += code >= 65 && code <= 90 ? (code - 55).toString() : char;
    }
    try {
      isValid = BigInt(numStr) % BigInt(97) === BigInt(1);
    } catch {
      isValid = false;
    }
  }

  const breakdown = [
    { label: copy.breakdownCountry, value: clean.slice(0, 2), desc: countryData.country },
    { label: copy.breakdownCheck, value: clean.slice(2, 4) },
    { label: copy.breakdownBank, value: clean.slice(4, 8), desc: bankInfo?.name },
    { label: copy.breakdownBranch, value: clean.slice(8, 12) },
    { label: copy.breakdownAccount, value: clean.slice(12) },
  ].filter((p) => p.value.length > 0);

  return {
    type: "success",
    ...countryData,
    countryCode: prefix,
    isValid,
    cleanValue: clean,
    bankInfo,
    breakdown,
  };
}

const UI_COPY = {
  es: {
    badge: "Validación bancaria",
    description:
      "Verifica la validez de una cuenta bancaria internacional y extrae información útil (SEPA, longitud y entidad cuando aplica).",
    single: "Individual",
    bulk: "Masivo",
    clear: "Limpiar",
    bulkPlaceholder: "Introduce un IBAN por línea…",
    sepa: "Zona SEPA (pagos y domiciliaciones)",
    swift: "Internacional (SWIFT)",
    valid: "Válido",
    invalid: "Inválido",
    issuingBank: "Banco emisor",
    bankNotIdentified: "Entidad no identificada",
    bicUnavailable: "BIC no disponible",
    copyIban: "Copiar IBAN",
    printSave: "Imprimir / guardar",
    countryError: "Error país",
    recent: "Recientes",
    clearHistory: "Borrar historial",
    noRecent: "No hay escaneos recientes.",
    educationTag: "Educación financiera",
    educationTitle: "¿Quieres ir más allá del IBAN?",
    educationDesc:
      "Entender cómo se mueve el dinero es el primer paso. Hemos preparado guías y recursos para ayudarte a decidir con criterio.",
    exploreEbooks: "Explorar eBooks",
    standardsTitle: "Estándares",
    standardsAccent: "internacionales",
    length: "Longitud",
    example: "Ejemplo",
    copied: "Copiado al portapapeles",
  },
  en: {
    badge: "Bank validation",
    description:
      "Validate an international account number and extract useful info (SEPA, length and bank when available).",
    single: "Single",
    bulk: "Bulk",
    clear: "Clear",
    bulkPlaceholder: "Paste one IBAN per line…",
    sepa: "SEPA area (payments & direct debits)",
    swift: "International (SWIFT)",
    valid: "Valid",
    invalid: "Invalid",
    issuingBank: "Issuing bank",
    bankNotIdentified: "Bank not identified",
    bicUnavailable: "BIC not available",
    copyIban: "Copy IBAN",
    printSave: "Print / save",
    countryError: "Country error",
    recent: "Recent",
    clearHistory: "Clear history",
    noRecent: "No recent scans.",
    educationTag: "Financial education",
    educationTitle: "Want to go beyond the IBAN?",
    educationDesc:
      "Understanding how money moves is the first step. We prepared guides and resources to help you decide with clarity.",
    exploreEbooks: "Browse ebooks",
    standardsTitle: "International",
    standardsAccent: "standards",
    length: "Length",
    example: "Example",
    copied: "Copied to clipboard",
  },
} as const;

export default function IBANPage() {
  const { locale } = useLocale();
  const copy = UI_COPY[locale];
  const [rawInput, setRawInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const displayInput = useMemo(
    () => rawInput.replace(/[^\dA-Z]/gi, "").replace(/(.{4})/g, "$1 ").trim(),
    [rawInput]
  );

  const result = useMemo(() => validateIBAN(rawInput, COPY[locale]), [rawInput, locale]);

  const bulkResults = useMemo(() => {
    return bulkInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const res = validateIBAN(line, COPY[locale]);
        return res ? { iban: line, result: res } : null;
      })
      .filter(
        (
          item
        ): item is { iban: string; result: SuccessResult | ErrorResult } =>
          item !== null
      );
  }, [bulkInput, locale]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const iban = params.get("iban");
    if (iban) {
      setRawInput(iban);
      setIsBulkMode(false);
    }

    const saved = localStorage.getItem("ibanHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("ibanHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (!result || result.type !== "success" || !result.isValid) return;

    setHistory((prev) => {
      const alreadyExists = prev.some((h) => h.iban === result.cleanValue);
      if (alreadyExists) return prev;

      const entry: HistoryEntry = {
        id: Date.now().toString(),
        iban: result.cleanValue,
        formatted: displayInput,
        result,
        timestamp: new Date().toISOString(),
      };

      return [entry, ...prev].slice(0, 15);
    });
  }, [result, displayInput]);

  const showToast = (msg: string) => {
    setToast({ msg, type: "success" });
    setTimeout(() => setToast(null), 2000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(copy.copied);
  };

  return (
    <div className="min-h-screen bg-background pb-20 text-foreground">
      <Container className="max-w-7xl py-12">
        <header className="mx-auto mb-14 max-w-3xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
            <ShieldCheck className="h-4 w-4" />
            {copy.badge}
          </div>

          <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
            IBAN{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              Scanner
            </span>
          </h1>

          <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {copy.description}
          </p>
        </header>

        <div className="mb-10 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-2xl border-2 border-border bg-card p-1 shadow-soft">
            <button
              type="button"
              onClick={() => setIsBulkMode(false)}
              className={cn(
                "rounded-xl px-6 py-2 text-sm font-semibold transition-colors",
                !isBulkMode
                  ? "border-2 border-secondary bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {copy.single}
            </button>
            <button
              type="button"
              onClick={() => setIsBulkMode(true)}
              className={cn(
                "rounded-xl px-6 py-2 text-sm font-semibold transition-colors",
                isBulkMode
                  ? "border-2 border-secondary bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {copy.bulk}
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <section>
              {!isBulkMode ? (
                <div className="rounded-2xl border-2 border-secondary bg-secondary p-5 text-secondary-foreground shadow-offset-accent">
                  <div className="flex items-center gap-4 rounded-xl border-2 border-secondary-foreground/12 bg-secondary-foreground/5 px-5 py-4">
                    <Search className="h-6 w-6 text-primary" />
                    <input
                      ref={inputRef}
                      value={displayInput}
                      onChange={(e) => setRawInput(e.target.value.toUpperCase())}
                      placeholder="ES21 0000 0000 0000…"
                      className="min-w-0 flex-1 bg-transparent text-2xl font-mono outline-none placeholder:text-secondary-foreground/40 md:text-3xl"
                    />
                    {rawInput ? (
                      <button
                        type="button"
                        onClick={() => setRawInput("")}
                        className="rounded-xl border-2 border-secondary-foreground/12 bg-secondary-foreground/5 p-2 text-secondary-foreground transition-colors hover:bg-secondary-foreground/10"
                        aria-label={copy.clear}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : (
                <Textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value.toUpperCase())}
                  placeholder={copy.bulkPlaceholder}
                  className="min-h-[16rem] rounded-2xl border-2 border-border bg-card p-6 font-mono text-base shadow-soft md:text-lg"
                />
              )}
            </section>

            <AnimatePresence mode="wait">
              {!isBulkMode && result?.type === "error" ? (
                <motion.div
                  key="iban-error"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="rounded-2xl border-2 border-destructive bg-destructive/10 p-6 text-sm text-destructive"
                >
                  {result.error}
                </motion.div>
              ) : null}

              {!isBulkMode && result?.type === "success" ? (
                <motion.div
                  key="iban-success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-soft"
                >
                  <div className="flex flex-wrap items-center gap-8 border-b-2 border-border p-8 md:p-10">
                    <div className="h-16 w-24 overflow-hidden rounded-xl border-2 border-border bg-muted">
                      <ReactCountryFlag
                        countryCode={result.countryCode}
                        svg
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-balance text-3xl font-black tracking-tight md:text-4xl">
                        {result.country}
                      </h2>
                      <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-primary">
                        <Globe className="h-4 w-4" />
                        {result.isSEPA
                          ? copy.sepa
                          : copy.swift}
                      </p>
                    </div>

                    <div
                      className={cn(
                        "flex items-center justify-center rounded-2xl border-2 px-6 py-4 text-center shadow-offset-accent",
                        result.isValid
                          ? "border-secondary bg-accent text-accent-foreground"
                          : "border-secondary bg-destructive text-destructive-foreground"
                      )}
                    >
                      <div className="flex flex-col items-center">
                          {result.isValid ? (
                            <Check className="h-8 w-8" />
                          ) : (
                            <AlertCircle className="h-8 w-8" />
                          )}
                        <span className="mt-1 text-xs font-black uppercase tracking-[0.18em]">
                          {result.isValid ? copy.valid : copy.invalid}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 md:p-10">
                    <div className="mb-10 grid gap-8 md:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                          {copy.issuingBank}
                        </p>
                        <p className="text-2xl font-black tracking-tight">
                          {result.bankInfo?.name || copy.bankNotIdentified}
                        </p>
                        <p className="font-mono text-lg font-semibold text-primary">
                          {result.bankInfo?.bic || copy.bicUnavailable}
                        </p>
                      </div>

                      <div className="flex items-center justify-end">
                        <div className="rounded-xl border-2 border-border bg-secondary-foreground p-2 shadow-soft">
                          <QRCodeSVG
                            value={result.cleanValue}
                            size={96}
                            bgColor="transparent"
                            fgColor="#000000"
                            includeMargin={false}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                      {result.breakdown.map((item) => (
                        <div
                          key={`${item.label}-${item.value}`}
                          className="rounded-2xl border-2 border-border bg-muted p-4"
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            {item.label}
                          </p>
                          <p className="mt-2 break-all font-mono text-lg font-black">
                            {item.value}
                          </p>
                          {item.desc ? (
                            <p className="mt-2 text-[11px] font-medium text-primary">
                              {item.desc}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 flex flex-wrap gap-3">
                      <Button
                        type="button"
                        onClick={() => handleCopy(result.cleanValue)}
                        className="flex-1 gap-2"
                      >
                        <Copy className="h-5 w-5" />
                        {copy.copyIban}
                      </Button>

                      <Button
                        type="button"
                        onClick={() => window.print()}
                        variant="outline"
                        size="icon"
                        aria-label={copy.printSave}
                      >
                        <Download className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {isBulkMode && bulkResults.length > 0 ? (
              <section className="space-y-3">
                {bulkResults.map((item) => (
                  <div
                    key={item.iban}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-border bg-card p-5 shadow-soft"
                  >
                    <div className="flex items-center gap-3">
                      {item.result.type === "success" ? (
                        <ReactCountryFlag countryCode={item.result.countryCode} svg />
                      ) : null}
                      <span className="font-mono text-sm">{item.iban}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.result.type === "success" ? (
                        <span
                          className={cn(
                            "rounded-full border-2 px-3 py-1 text-xs font-black uppercase tracking-[0.18em]",
                            item.result.isValid
                              ? "border-secondary bg-accent text-accent-foreground"
                              : "border-secondary bg-destructive text-destructive-foreground"
                          )}
                        >
                          {item.result.isValid ? copy.valid : copy.invalid}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-destructive">
                          {copy.countryError}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </section>
            ) : null}
          </div>

          <aside className="space-y-8 lg:col-span-4">
            <section className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {copy.recent}
                </p>

                {history.length > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setHistory([])}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label={copy.clearHistory}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>

              <div className="space-y-3">
                {history.length > 0 ? (
                  history.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setRawInput(h.iban)}
                      className="flex w-full items-center gap-3 rounded-xl border-2 border-border bg-muted px-4 py-3 text-left transition-colors hover:border-secondary/35 hover:bg-muted/70"
                    >
                      <ReactCountryFlag countryCode={h.result.countryCode} svg />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-[10px] text-muted-foreground">
                          {h.formatted}
                        </p>
                        <p className="text-sm font-semibold">
                          {h.result.bankInfo?.name || h.result.country}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    {copy.noRecent}
                  </p>
                )}
              </div>
            </section>

            <section className="group relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-offset-accent">
              <Zap className="pointer-events-none absolute -right-6 -bottom-6 h-32 w-32 opacity-20 transition-transform duration-500 group-hover:rotate-12" />

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {copy.educationTag}
              </p>
              <h3 className="mt-4 text-balance text-2xl font-black text-accent">
                {copy.educationTitle}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-secondary-foreground/80">
                {copy.educationDesc}
              </p>

              <div className="mt-6">
                <Button asChild size="sm" className="gap-2">
                  <LocalizedLink href="/ebooks">
                    {copy.exploreEbooks} <Share2 className="h-4 w-4" />
                  </LocalizedLink>
                </Button>
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-20">
          <h2 className="mb-10 text-balance text-3xl font-black tracking-tight md:text-5xl">
            {copy.standardsTitle}{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              {copy.standardsAccent}
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(IBAN_MAP)
              .slice(0, 8)
              .map(([code, data]) => (
                <div
                  key={code}
                  className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <ReactCountryFlag countryCode={code} svg />
                    <span className="font-semibold">{data.country}</span>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        {copy.length}
                      </p>
                      <p className="mt-2 text-3xl font-black text-primary">
                        {data.length}
                      </p>
                    </div>

                      <button
                        type="button"
                        onClick={() => setRawInput(data.example)}
                        className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
                      >
                      {copy.example}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </Container>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-2xl border-2 border-secondary bg-secondary px-6 py-4 text-secondary-foreground shadow-offset-accent"
          >
            <Check className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold">{toast.msg}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
