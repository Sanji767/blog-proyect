// src/components/sections/home/HomeHowItWorks.tsx

import Container from "@/components/layout/Container";

const steps = [
  {
    step: "1",
    title: "Elige tu perfil",
    desc: "Remoto, viajero, nómina, autónomo… cada caso tiene requisitos distintos (IBAN, países admitidos, límites).",
  },
  {
    step: "2",
    title: "Compara con criterios claros",
    desc: "Comisiones, IBAN, requisitos y letra pequeña: fichas rápidas para entender pros y contras sin humo.",
  },
  {
    step: "3",
    title: "Decide y pasa a la acción",
    desc: "Lee el análisis completo, valida tu IBAN si lo necesitas y abre la cuenta en la web oficial.",
  },
];

export default function HomeHowItWorks() {
  return (
    <section className="border-t border-border bg-background py-16 md:py-24">
      <Container>
        <header className="mx-auto mb-10 max-w-3xl space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Cómo funciona
          </p>

          <h2 className="text-balance text-3xl font-black tracking-tight md:text-5xl">
            Tres pasos.{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              Cero ruido.
            </span>
          </h2>

          <p className="text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            FinanzasEU no es un banco ni una asesoría cara. Es una guía para
            descartar lo que no te sirve y quedarte con lo que sí.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, idx) => (
            <article
              key={s.step}
              className="group relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-7 text-secondary-foreground shadow-soft transition-shadow hover:shadow-offset-accent"
            >
              <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/12 blur-3xl" />

              <div className="relative inline-flex h-12 w-12 items-center justify-center border-2 border-secondary bg-accent text-accent-foreground shadow-offset-accent">
                <span className="text-lg font-black">{s.step}</span>
              </div>

              <h3 className="relative mt-5 text-xl font-black text-accent">
                {s.title}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-secondary-foreground/80">
                {s.desc}
              </p>

              {idx < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-6 top-7 hidden text-2xl font-black text-secondary-foreground/10 md:block"
                >
                  →
                </span>
              ) : null}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

