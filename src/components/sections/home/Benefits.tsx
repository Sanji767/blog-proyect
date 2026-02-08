// src/components/sections/home/Benefits.tsx
"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock3, Globe2, CreditCard } from "lucide-react";
import Container from "@/components/layout/Container";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Seguridad Bancaria",
    description:
      "Fichas técnicas con licencia, supervisión y garantía de depósitos (según el país de la entidad).",
    color: "emerald"
  },
  {
    icon: Globe2,
    title: "Nómada Digital",
    description: "Soluciones multidivisa con IBAN locales para cobrar y pagar como un residente en cualquier país.",
    color: "cyan"
  },
  {
    icon: CreditCard,
    title: "Transparencia Total",
    description: "Desglosamos comisiones ocultas en tipos de cambio y mantenimiento de tarjetas.",
    color: "blue"
  },
  {
    icon: Clock3,
    title: "Ahorro Estratégico",
    description: "Eliminamos el ruido publicitario. Solo las mejores cuentas neobancarias en un vistazo.",
    color: "purple"
  }
];

export default function Benefits() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black"
          >
            Tu dinero, sin fronteras <br /> 
            <span className="text-muted-foreground">y sin complicaciones.</span>
          </motion.h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative p-8 rounded-[2rem] border border-border bg-card/50 hover:bg-card transition-colors group overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
              
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <item.icon className="h-7 w-7" />
              </div>
              
              <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
