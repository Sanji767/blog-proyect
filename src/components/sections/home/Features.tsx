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
    title: "Selección verificada",
    description:
      "No listamos todo lo que existe: solo bancos y cuentas que tienen sentido para viajeros, remotos y no residentes.",
    icon: <ListFilter className="h-5 w-5" />,
  },
  {
    title: "Datos claros",
    description:
      "Comisiones, límites, países admitidos, IBAN y requisitos. Sin banners ni textos comerciales vacíos.",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    title: "Pensado para casos reales",
    description:
      "Nómina, freelance, multidivisa o mudanza: te decimos qué encaja contigo y por qué, sin humo.",
    icon: <MessageCircleMore className="h-5 w-5" />,
  },
];

export default function Features() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <header className="mx-auto mb-10 max-w-3xl space-y-4 text-center">
          <h2 className="text-balance text-3xl font-black leading-tight md:text-4xl">
            Qué hace diferente a{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              FinanzasEU
            </span>
          </h2>
          <p className="text-pretty text-base leading-relaxed text-muted-foreground">
            No somos un banco ni una agencia. Somos una guía editorial para que
            tomes mejores decisiones con tu dinero en Europa.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border-2 border-secondary bg-secondary p-7 text-secondary-foreground shadow-soft"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Guía
              </p>

              <div className="mt-5 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-secondary-foreground/12 bg-secondary-foreground/5 text-accent">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-balance text-xl font-black leading-snug text-accent">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-secondary-foreground/80">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

