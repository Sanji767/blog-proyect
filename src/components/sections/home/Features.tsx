// src/components/sections/home/Features.tsx
import Container from "@/components/layout/Container";

type Feature = {
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    title: "Selección de bancos verificada",
    description:
      "No listamos todo lo que existe, solo los bancos y cuentas que realmente tienen sentido para viajeros, remotos y no residentes.",
  },
  {
    title: "Información clara y directa",
    description:
      "Comisiones, límites, países admitidos, IBAN y requisitos. Sin textos comerciales vacíos.",
  },
  {
    title: "Pensado para tu situación real",
    description:
      "Tanto si trabajas en Suiza, vives en España o cobras en varias divisas, te indicamos qué encaja mejor contigo.",
  },
];

export default function Features() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="mb-8 space-y-2 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            ¿Qué hace diferente a <span className="text-primary">Finanzas Eu</span>?
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
            No somos un banco ni una agencia. Somos una guía para que tú tomes
            mejores decisiones con tu dinero en Europa.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((item) => (
            <article
              key={item.title}
              className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-background p-5 shadow-card"
            >
              <h3 className="text-base font-semibold md:text-lg">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
