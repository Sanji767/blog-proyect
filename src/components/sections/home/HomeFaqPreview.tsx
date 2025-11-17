// src/components/sections/home/HomeFaqPreview.tsx

import Link from "next/link";
import Container from "@/components/layout/Container";

const faqs = [
  {
    question: "¿Puedo abrir cuenta si no vivo en Europa?",
    answer:
      "Depende del banco. Algunos aceptan no residentes, otros solo residentes en la UE. En cada ficha lo indico y te doy alternativas.",
  },
  {
    question: "¿Es seguro usar bancos digitales en vez de uno tradicional?",
    answer:
      "Los bancos que menciono están regulados y muchos tienen fondo de garantía. Aun así, explico riesgos y buenas prácticas.",
  },
  {
    question: "¿Ganas dinero si abro cuenta con tus enlaces?",
    answer:
      "En algunos casos sí, pero eso no cambia lo que recomiendo. Si un banco no compensa, lo digo igual.",
  },
];

export default function HomeFaqPreview() {
  return (
    <section className="py-12 md:py-16 border-t border-border bg-hero-background/60">
      <Container className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              Dudas típicas antes de abrir cuenta
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              Muchas personas me escriben con las mismas preguntas. Aquí tienes
              algunas respuestas rápidas y, si quieres, puedes ver el resto en
              la página de FAQ.
            </p>
          </div>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-xs font-semibold text-foreground hover:bg-background/70"
          >
            Ver todas las preguntas frecuentes →
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-border bg-background p-4 text-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium">
                <span>{item.question}</span>
                <span className="text-[11px] text-muted-foreground group-open:hidden">
                  Ver respuesta
                </span>
                <span className="hidden text-[11px] text-muted-foreground group-open:inline">
                  Ocultar
                </span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
