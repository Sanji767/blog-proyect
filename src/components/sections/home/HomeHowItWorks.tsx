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
    desc: "Comisiones, IBAN, requisitos y letra pequeña: en fichas rápidas para entender pros y contras sin humo.",
  },
  {
    step: "3",
    title: "Decide y pasa a la acción",
    desc: "Lee el análisis completo, valida tu IBAN si lo necesitas y abre la cuenta en la web oficial.",
  },
];

export default function HomeHowItWorks() {
  return (
    <section className="border-t border-border bg-background py-12 md:py-16">
      <Container>
        <div className="mb-8 space-y-2 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            ¿Cómo te ayuda{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Finanzas Eu
            </span>
            ?
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
            No somos un banco ni una asesoría cara. Somos una guía para
            descartar lo que no te sirve y quedarte con lo que sí.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s, idx) => (
            <div key={s.step} className="relative text-center">
              {/* Línea de conexión (solo desktop) */}
              {idx < steps.length - 1 && (
                <div className="pointer-events-none absolute top-7 left-1/2 hidden h-px w-full translate-x-1/2 bg-border md:block" />
              )}

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-sm font-bold text-white shadow-soft">
                {s.step}
              </div>
              <h3 className="mb-2 text-base font-semibold md:text-lg">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
