// src/components/sections/home/HomeHowItWorks.tsx

import Container from "@/components/layout/Container";

const steps = [
  {
    step: "1",
    title: "Me cuentas tu situación",
    desc: "Vives en un país, cobras desde otro, trabajas en remoto, viajas mucho… Cada caso es distinto y eso importa.",
  },
  {
    step: "2",
    title: "Filtramos bancos que no encajan",
    desc: "Quitamos de la lista bancos que no aceptan tu país, tienen comisiones absurdas o no ofrecen lo que necesitas.",
  },
  {
    step: "3",
    title: "Te quedas con 1–3 opciones claras",
    desc: "Te explico en lenguaje normal pros y contras de cada opción para que tú decidas con la cabeza fría.",
  },
];

export default function HomeHowItWorks() {
  return (
    <section className="py-12 md:py-16 border-t border-border bg-background">
      <Container>
        <div className="mb-8 space-y-2 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            ¿Cómo te ayuda <span className="text-primary">Finanzas Eu</span>?
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
            No soy un banco, ni una asesoría cara. Soy una guía que te ayuda a
            descartar lo que no te sirve y quedarte con lo que sí.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-sm font-bold text-black shadow-soft">
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
