// src/components/sections/home/HomeFaqPreview.tsx

import Link from "next/link";
import { HelpCircle } from "lucide-react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

const faqs = [
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
];

export default function HomeFaqPreview() {
  return (
    <section className="border-t border-border bg-hero-background/60 py-16 md:py-20">
      <Container className="space-y-8">
        <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
              <HelpCircle className="h-3.5 w-3.5" />
              Preguntas típicas antes de abrir cuenta
            </div>

            <h2 className="text-balance text-2xl font-black tracking-tight md:text-3xl">
              Dudas frecuentes sobre bancos digitales
            </h2>

            <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              Muchas personas repiten las mismas preguntas. Aquí tienes respuestas
              rápidas y, si quieres, el resto en la página de FAQ.
            </p>
          </div>

          <Button asChild variant="outline" className="shrink-0">
            <Link href="/faq">Ver todas las preguntas frecuentes →</Link>
          </Button>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border-2 border-border bg-card p-5 text-sm shadow-soft"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold">
                <span>{item.question}</span>
                <span className="text-[11px] text-muted-foreground group-open:hidden">
                  Ver respuesta
                </span>
                <span className="hidden text-[11px] text-muted-foreground group-open:inline">
                  Ocultar
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

