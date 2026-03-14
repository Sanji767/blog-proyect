// src/components/sections/home/HomeFaqPreview.tsx

import Link from "next/link";
import { HelpCircle } from "lucide-react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { withLocale, type Locale } from "@/lib/i18n";

const COPY = {
  es: {
    kicker: "Preguntas típicas antes de abrir cuenta",
    title: "Dudas frecuentes sobre bancos digitales",
    desc: "Muchas personas repiten las mismas preguntas. Aquí tienes respuestas rápidas y, si quieres, el resto en la página de FAQ.",
    cta: "Ver todas las preguntas frecuentes →",
    show: "Ver respuesta",
    hide: "Ocultar",
    faqs: [
      {
        question: "¿Puedo abrir cuenta si no vivo en Europa?",
        answer:
          "Depende del banco. Algunos aceptan no residentes, otros solo residentes en la UE. En cada ficha lo indicamos y te damos alternativas.",
      },
      {
        question: "¿Es seguro usar bancos digitales en vez de uno tradicional?",
        answer:
          "Los bancos que mencionamos están regulados y muchos tienen garantía de depósitos. Aun así, explicamos riesgos y buenas prácticas para que decidas con calma.",
      },
      {
        question: "¿Ganas dinero si abro cuenta con tus enlaces?",
        answer:
          "En algunos casos sí, pero eso no cambia lo que recomendamos. Si un banco no compensa, lo decimos igual de claro.",
      },
    ],
  },
  en: {
    kicker: "Common questions before opening an account",
    title: "FAQ about digital banks",
    desc: "Many people ask the same things. Here are quick answers — and the rest is on the FAQ page.",
    cta: "See all FAQs →",
    show: "Show answer",
    hide: "Hide",
    faqs: [
      {
        question: "Can I open an account if I don’t live in Europe?",
        answer:
          "It depends on the bank. Some accept non‑residents, others only EU residents. We point it out on each bank page and suggest alternatives.",
      },
      {
        question: "Is it safe to use digital banks instead of a traditional one?",
        answer:
          "The banks we cover are regulated and many come with deposit protection. Still, we explain risks and good practices so you can decide calmly.",
      },
      {
        question: "Do you earn money if I open an account through your links?",
        answer:
          "Sometimes yes — but it doesn’t change what we recommend. If a bank isn’t worth it, we’ll say it clearly.",
      },
    ],
  },
} as const;

export default function HomeFaqPreview({ locale = "es" }: { locale?: Locale }) {
  const copy = COPY[locale];

  return (
    <section className="border-t border-border bg-hero-background/60 py-16 md:py-20">
      <Container className="space-y-8">
        <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
              <HelpCircle className="h-3.5 w-3.5" />
              {copy.kicker}
            </div>

            <h2 className="text-balance text-2xl font-black tracking-tight md:text-3xl">
              {copy.title}
            </h2>

            <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              {copy.desc}
            </p>
          </div>

          <Button asChild variant="outline" className="shrink-0">
            <Link href={withLocale("/faq", locale)}>{copy.cta}</Link>
          </Button>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {copy.faqs.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border-2 border-border bg-card p-5 text-sm shadow-soft"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold">
                <span>{item.question}</span>
                <span className="text-[11px] text-muted-foreground group-open:hidden">
                  {copy.show}
                </span>
                <span className="hidden text-[11px] text-muted-foreground group-open:inline">
                  {copy.hide}
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
