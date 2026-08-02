"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, ArrowRight, RotateCcw, Star, ShieldCheck, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { banks, type Bank } from "@/lib/banks";
import type { Locale } from "@/lib/i18n";

type QuestionStep = 1 | 2 | 3 | 4;

type Answers = {
  goal: string;
  iban: string;
  fee: string;
};

const UI_COPY: Record<Locale, {
  badge: string;
  title: string;
  subtitle: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  next: string;
  restart: string;
  resultTitle: string;
  resultSubtitle: string;
  matchScore: string;
  openAccount: string;
  viewAnalysis: string;
  goals: Record<string, string>;
  ibans: Record<string, string>;
  fees: Record<string, string>;
}> = {
  es: {
    badge: "Recomendador Inteligente",
    title: "Encuentra tu Banco Ideal en 30 Segundos",
    subtitle: "Responde 3 preguntas sencillas y nuestro algoritmo elegirá la mejor cuenta para ti.",
    step1Title: "1. ¿Cuál es tu objetivo principal?",
    step2Title: "2. ¿Qué IBAN prefieres para tu cuenta?",
    step3Title: "3. ¿Aceptas cuota mensual a cambio de ventajas?",
    next: "Siguiente paso →",
    restart: "Repetir test",
    resultTitle: "¡Tu Banco Ideal Encontrado!",
    resultSubtitle: "Según tus preferencias, esta es la cuenta que mejor se adapta a tus necesidades:",
    matchScore: "100% Coincidencia",
    openAccount: "Abrir cuenta ahora",
    viewAnalysis: "Ver análisis completo",
    goals: {
      travel: "✈️ Viajar y compras sin comisiones",
      salary: "💼 Cobrar nómina y recibos diarios",
      invest: "📈 Ahorro e inversión (intereses)",
      freelance: "👨‍💻 Freelancer o Autónomo",
    },
    ibans: {
      es: "🇪🇸 IBAN Español (ES)",
      de: "🇩🇪 IBAN Alemán (DE)",
      lt: "🇱🇹 IBAN Lituano (LT)",
      any: "🌍 Cualquier IBAN europeo",
    },
    fees: {
      free: "🆓 100% Gratis sin comisiones (0 €)",
      premium: "⭐ Acepto cuota mensual si incluye cashback o seguros",
    },
  },
  en: {
    badge: "Smart Recommender",
    title: "Find Your Ideal Bank in 30 Seconds",
    subtitle: "Answer 3 quick questions and our algorithm will pick the best account for your needs.",
    step1Title: "1. What is your main financial goal?",
    step2Title: "2. Which IBAN prefix do you prefer?",
    step3Title: "3. Are you open to a monthly fee for extra perks?",
    next: "Next Step →",
    restart: "Restart Quiz",
    resultTitle: "Your Perfect Bank Match!",
    resultSubtitle: "Based on your criteria, this is the top recommended account for you:",
    matchScore: "100% Match",
    openAccount: "Open account now",
    viewAnalysis: "View full review",
    goals: {
      travel: "✈️ Travelling & zero FX fees",
      salary: "💼 Salary direct deposit & bill payments",
      invest: "📈 High-yield savings & investing",
      freelance: "👨‍💻 Freelancer or Small Business",
    },
    ibans: {
      es: "🇪🇸 Spanish IBAN (ES)",
      de: "🇩🇪 German IBAN (DE)",
      lt: "🇱🇹 Lithuanian IBAN (LT)",
      any: "🌍 Any European IBAN",
    },
    fees: {
      free: "🆓 100% Free with zero monthly fees ($0)",
      premium: "⭐ Open to monthly fee if perks/cashback included",
    },
  },
};

export default function BankQuiz() {
  const { locale } = useLocale();
  const copy = UI_COPY[locale];

  const [step, setStep] = useState<QuestionStep>(1);
  const [answers, setAnswers] = useState<Answers>({
    goal: "travel",
    iban: "any",
    fee: "free",
  });

  const getMatchedBank = (): Bank => {
    // Scoring system over published banks
    const candidates = banks.filter((b) => b._status === "published");

    const scored = candidates.map((b) => {
      let score = 0;

      // Goal matching
      if (answers.goal === "travel" && (b.tags.includes("multidivisa") || b.slug === "revolut" || b.slug === "wise")) score += 40;
      if (answers.goal === "salary" && (b.ibanPrefix === "ES" || b.ibanPrefix === "DE" || b.slug === "n26" || b.slug === "bbva")) score += 40;
      if (answers.goal === "invest" && (b.slug === "trade-republic" || b.slug === "myinvestor" || b.category === "fintech")) score += 40;
      if (answers.goal === "freelance" && (b.tags.includes("para-freelancers") || b.slug === "bunq" || b.slug === "qonto")) score += 40;

      // IBAN matching
      if (answers.iban !== "any") {
        if (b.ibanPrefix?.toLowerCase() === answers.iban) score += 30;
      } else {
        score += 15;
      }

      // Fee matching
      const isFree = /gratis|0\s*(€|\u20ac)/i.test(b.fees.monthly);
      if (answers.fee === "free" && isFree) score += 30;
      if (answers.fee === "premium" && b.affiliateUrl) score += 20;

      // Priority boost
      score += (b._priority ? 30 - b._priority : 0);

      return { bank: b, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.bank ?? candidates[0];
  };

  const matchedBank = getMatchedBank();

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-secondary bg-secondary/90 p-6 md:p-10 text-secondary-foreground shadow-soft">
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

      <header className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-bold text-accent uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span>{copy.badge}</span>
        </div>
        <h2 className="mt-3 text-2xl font-black md:text-3xl tracking-tight text-accent">
          {copy.title}
        </h2>
        <p className="mt-2 text-sm text-secondary-foreground/80 leading-relaxed">
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
                ? "w-8 bg-accent"
                : step > i
                ? "w-2 bg-accent/60"
                : "w-2 bg-secondary-foreground/20"
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
              <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-foreground/80 text-center">
                {copy.step1Title}
              </h3>
              <div className="grid gap-3">
                {Object.entries(copy.goals).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, goal: key }));
                      setStep(2);
                    }}
                    className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left font-bold text-sm transition-all ${
                      answers.goal === key
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-secondary-foreground/10 bg-background/80 hover:border-secondary-foreground/30"
                    }`}
                  >
                    <span>{label}</span>
                    {answers.goal === key && <Check className="h-5 w-5 text-accent" />}
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
              <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-foreground/80 text-center">
                {copy.step2Title}
              </h3>
              <div className="grid gap-3">
                {Object.entries(copy.ibans).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, iban: key }));
                      setStep(3);
                    }}
                    className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left font-bold text-sm transition-all ${
                      answers.iban === key
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-secondary-foreground/10 bg-background/80 hover:border-secondary-foreground/30"
                    }`}
                  >
                    <span>{label}</span>
                    {answers.iban === key && <Check className="h-5 w-5 text-accent" />}
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
              <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-foreground/80 text-center">
                {copy.step3Title}
              </h3>
              <div className="grid gap-3">
                {Object.entries(copy.fees).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, fee: key }));
                      setStep(4);
                    }}
                    className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left font-bold text-sm transition-all ${
                      answers.fee === key
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-secondary-foreground/10 bg-background/80 hover:border-secondary-foreground/30"
                    }`}
                  >
                    <span>{label}</span>
                    {answers.fee === key && <Check className="h-5 w-5 text-accent" />}
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
              className="rounded-3xl border-2 border-accent bg-background p-6 shadow-xl text-center space-y-5"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>{copy.matchScore}</span>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="relative h-16 w-16 shrink-0 rounded-2xl border-2 border-secondary-foreground/15 bg-secondary-foreground/5 p-2">
                  <Image
                    src={matchedBank.logo}
                    alt={matchedBank.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div className="text-left min-w-0">
                  <h3 className="text-2xl font-black tracking-tight text-accent truncate">
                    {matchedBank.name}
                  </h3>
                  <p className="text-xs text-secondary-foreground/70">
                    {matchedBank.country} · IBAN {matchedBank.ibanPrefix}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-secondary-foreground/80 max-w-md mx-auto">
                {matchedBank.tagline}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {matchedBank.affiliateUrl ? (
                  <Button asChild size="lg" className="flex-1 font-bold gap-2">
                    <a href={matchedBank.affiliateUrl} target="_blank" rel="noreferrer noopener sponsored">
                      {copy.openAccount}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ) : null}

                <Button asChild variant="outline" size="lg" className="flex-1 font-bold">
                  <LocalizedLink href={`/programas/${matchedBank.slug}`}>
                    {copy.viewAnalysis}
                  </LocalizedLink>
                </Button>
              </div>

              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-foreground/60 hover:text-accent pt-2"
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
