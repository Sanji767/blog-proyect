// src/components/sections/home/Benefits.tsx
"use client";

import { motion } from "framer-motion";
import { Clock3, CreditCard, Globe2, ShieldCheck } from "lucide-react";

import Container from "@/components/layout/Container";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Seguridad y supervisión",
    description:
      "Fichas con licencia, supervisión y garantías (según país) para saber qué estás abriendo.",
  },
  {
    icon: Globe2,
    title: "Multidivisa, de verdad",
    description:
      "Opciones para cobrar y pagar en varias divisas con IBAN y operativa real para el día a día.",
  },
  {
    icon: CreditCard,
    title: "Comisiones al descubierto",
    description:
      "Costes reales (cambio de divisa, cajeros, tarjeta) sin letra pequeña disfrazada.",
  },
  {
    icon: Clock3,
    title: "Ahorra tiempo (y dudas)",
    description:
      "Menos ruido: una selección editorial para decidir rápido con criterios claros y comparables.",
  },
];

export default function Benefits() {
  return (
    <section className="border-t border-border bg-background py-16 md:py-24">
      <Container>
        <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Por qué importa
          </p>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-balance text-3xl font-black leading-tight md:text-5xl"
          >
            Menos comisiones.{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              Más control.
            </span>
          </motion.h2>

          <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Una experiencia premium no es “más diseño”: es quitar fricción y
            dejar solo lo que te ayuda a decidir mejor.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((item, idx) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-7 text-secondary-foreground shadow-soft transition-shadow hover:shadow-offset-accent"
            >
              <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl transition-colors group-hover:bg-accent/15" />

              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 border-secondary-foreground/12 bg-secondary-foreground/5 text-accent transition-transform group-hover:scale-110 group-hover:rotate-2">
                <item.icon className="h-6 w-6" />
              </div>

              <h3 className="mb-3 text-xl font-black text-accent">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-secondary-foreground/80">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

