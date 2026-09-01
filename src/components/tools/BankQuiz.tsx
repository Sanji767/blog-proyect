"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, RotateCcw, ExternalLink, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { banks, Bank } from "@/lib/banks";
import type { Locale } from "@/lib/i18n";

type Answers = {
  goal?: string;
  iban?: string;
  fee?: string;
};

const QUIZ_COPY: Record<Locale, {
  badge: string;
  title: string;
  subtitle: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  goals: Record<string, string>;
  ibans: Record<string, string>;
  fees: Record<string, string>;
  matchScore: string;
  openAccount: string;
  viewAnalysis: string;
  restart: string;
}> = {
  es: {
    badge: "Recomendador Inteligente",
    title: "¿Qué banco europeo se adapta a ti?",
    subtitle: "Responde 3 preguntas rápidas y te diremos la mejor opción sin comisiones según tus necesidades.",
    step1Title: "1. ¿Cuál es tu objetivo principal?",
    step2Title: "2. ¿Qué tipo de IBAN prefieres?",
    step3Title: "3. ¿Qué buscas en comisiones?",
    goals: {
      travel: "Viajar y pagar en el extranjero sin comisiones",
      saving: "Hacer crecer mis ahorros (Cuenta remunerada)",
      business: "Cobrar como autónomo / empresa",
      daily: "Mi cuenta del día a día (nómina y recibos)",
    },
    ibans: {
      es: "IBAN Español (ES) exclusivamente",
      eu: "Me da igual mientras sea Europeo (LT, DE, NL...)",
      multi: "Múltiples divisas e IBANs internacionales",
    },
    fees: {
      zero: "100% gratis siempre, sin condiciones",
      flexible: "Gratis si cumplo condiciones / pago si hay ventajas",
    },
    matchScore: "99% Coincidencia Recomendada",
    openAccount: "Abrir cuenta gratis",
    viewAnalysis: "Ver análisis completo",
    restart: "Repetir test",
  },
  en: {
    badge: "Smart Match Tool",
    title: "Which European bank is right for you?",
    subtitle: "Answer 3 quick questions to discover your best fee-free match based on your goals.",
    step1Title: "1. What is your primary objective?",
    step2Title: "2. What type of IBAN do you prefer?",
    step3Title: "3. What fee model do you prefer?",
    goals: {
      travel: "Travel & spending abroad with 0% FX fees",
      saving: "Grow my savings with high-yield interest",
      business: "Get paid as a freelancer / business",
      daily: "Daily spending, direct debits & salary",
    },
    ibans: {
      es: "Local Spanish (ES) IBAN only",
      eu: "Any European IBAN (LT, DE, NL, etc.)",
      multi: "Multi-currency accounts & international IBANs",
    },
    fees: {
      zero: "100% free forever, no strings attached",
      flexible: "Free with conditions / happy to pay for premium perks",
    },
    matchScore: "99% Match Recommendation",
    openAccount: "Open free account",
    viewAnalysis: "Read in-depth review",
    restart: "Retake quiz",
  },
};

export default function BankQuiz() {
  const { locale } = useLocale();
  const copy = QUIZ_COPY[locale];

  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Answers>({});

  const getMatchedBank = (): Bank => {
    const candidates = banks.filter((b) => b._status !== "draft");

    // Algorithm scoring based on answers
    const scored = candidates.map((b) => {
      let score = 0;

      // Goal match
      if (answers.goal === "travel" && (b.tags.includes("multidivisa") || b.slug === "revolut" || b.slug === "wise")) score += 40;
      if (answers.goal === "saving" && (b.tags.includes("sin-comisiones") || b.slug === "trade-republic" || b.slug === "n26")) score += 40;
      if (answers.goal === "business" && (b.tags.includes("para-freelancers") || b.tags.includes("para-empresa") || b.slug === "qonto" || b.slug === "revolut")) score += 40;
      if (answers.goal === "daily" && (b.tags.includes("iban-es") || b.tags.includes("espanol"))) score += 40;

      // IBAN match
      if (answers.iban === "es" && b.ibanPrefix === "ES") score += 30;
      if (answers.iban === "eu" && b.ibanPrefix !== "ES") score += 20;
      if (answers.iban === "multi" && (b.currencies?.length > 3 || b.tags.includes("multidivisa"))) score += 30;

      // Fee match
      if (answers.fee === "zero" && (b.fees.monthly.includes("0") || b.tags.includes("sin-comisiones"))) score += 20;

      // Base priority boost
      score += (b._priority ? 30 - b._priority : 0);

      return { bank: b, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.bank ?? candidates[0];
  };

  const matchedBank = getMatchedBank();

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-border bg-card p-6 md:p-10 text-card-foreground shadow-soft transition-colors">
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <header className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>{copy.badge}</span>
        </div>
        <h2 className="mt-3 text-2xl font-black md:text-3xl tracking-tight text-foreground">
          {copy.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {copy.subtitle}
        </p>
      </header>

      {/* Progress Dots */}
      <div className="mt-6 flex justify-center items-center gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              step === i
                ? "w-8 bg-primary"
                : step > i
                ? "w-2 bg-primary/60"
                : "w-2 bg-muted-foreground/20"
            }`}
          />
        ))}
      </div>

      <div className="mt-8 max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
                {copy.step1Title}
              </h3>
              <div className="grid gap-3">
                {Object.entries(copy.goals).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, goal: key }));
                      setStep(2);
                    }}
                    className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left font-bold text-sm transition-all ${
                      answers.goal === key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/30 text-foreground hover:border-primary/50 hover:bg-muted/60"
                    }`}
                  >
                    <span>{label}</span>
                    {answers.goal === key && <Check className="h-5 w-5 text-primary" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
                {copy.step2Title}
              </h3>
              <div className="grid gap-3">
                {Object.entries(copy.ibans).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, iban: key }));
                      setStep(3);
                    }}
                    className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left font-bold text-sm transition-all ${
                      answers.iban === key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/30 text-foreground hover:border-primary/50 hover:bg-muted/60"
                    }`}
                  >
                    <span>{label}</span>
                    {answers.iban === key && <Check className="h-5 w-5 text-primary" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
                {copy.step3Title}
              </h3>
              <div className="grid gap-3">
                {Object.entries(copy.fees).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, fee: key }));
                      setStep(4);
                    }}
                    className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left font-bold text-sm transition-all ${
                      answers.fee === key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/30 text-foreground hover:border-primary/50 hover:bg-muted/60"
                    }`}
                  >
                    <span>{label}</span>
                    {answers.fee === key && <Check className="h-5 w-5 text-primary" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border-2 border-primary/40 bg-muted/20 p-6 md:p-8 shadow-xl text-center space-y-5"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 px-3.5 py-1 text-xs font-black text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                <span>{copy.matchScore}</span>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="relative h-16 w-16 shrink-0 rounded-2xl border-2 border-border bg-card p-2 shadow-sm">
                  <Image
                    src={matchedBank.logo}
                    alt={matchedBank.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div className="text-left min-w-0">
                  <h3 className="text-2xl font-black tracking-tight text-foreground truncate">
                    {matchedBank.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {matchedBank.country} · IBAN {matchedBank.ibanPrefix}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground max-w-md mx-auto">
                {matchedBank.tagline}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button asChild size="lg" className="flex-1 font-bold gap-2">
                  <a
                    href={matchedBank.affiliateUrl || matchedBank.website}
                    data-analytics="affiliate"
                    data-affiliate-partner={matchedBank.slug}
                    target="_blank"
                    rel="noreferrer noopener sponsored"
                  >
                    {copy.openAccount}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>

                <Button asChild variant="outline" size="lg" className="flex-1 font-bold border-2">
                  <LocalizedLink href={`/programas/${matchedBank.slug}`}>
                    {copy.viewAnalysis}
                  </LocalizedLink>
                </Button>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground pt-2 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{copy.restart}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
