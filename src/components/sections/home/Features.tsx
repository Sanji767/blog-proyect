// src/components/sections/home/Features.tsx
import { CheckCircle2, ListFilter, MessageCircleMore } from "lucide-react";
import Container from "@/components/layout/Container";

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const features: Feature[] = [
  {
    title: "Selección de bancos verificada",
    description:
      "No listamos todo lo que existe, solo los bancos y cuentas que realmente tienen sentido para viajeros, remotos y no residentes.",
    icon: <ListFilter className="h-5 w-5" />,
  },
  {
    title: "Información clara y directa",
    description:
      "Comisiones, límites, países admitidos, IBAN y requisitos. Sin textos comerciales vacíos ni banners por todas partes.",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    title: "Pensado para tu situación real",
    description:
      "Tanto si trabajas en Suiza, vives en España o cobras en varias divisas, te indico qué encaja mejor contigo y por qué.",
    icon: <MessageCircleMore className="h-5 w-5" />,
  },
];

export default function Features() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="mb-8 space-y-2 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            ¿Qué hace diferente a{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              FinanzasEU
            </span>
            ?
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
            No somos un banco ni una agencia. Somos una guía para que tú tomes
            mejores decisiones con tu dinero en Europa, sin venderte humo.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((item) => (
            <article
              key={item.title}
              className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-background/80 p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-soft"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold md:text-lg">
                  {item.title}
                </h3>
              </div>
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
