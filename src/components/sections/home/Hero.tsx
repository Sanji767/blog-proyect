// src/components/sections/home/Hero.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ScanLine, ShieldCheck, Sparkles } from "lucide-react";

import Container from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" },
};

export default function Hero() {
  return (
    <section className="py-16 md:py-24">
      <Container className="grid gap-12 lg:grid-cols-12 lg:items-start">
        <motion.div
          initial="initial"
          animate="animate"
          className="space-y-8 lg:col-span-7"
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline">Guía 2026 · Europa</Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-balance text-4xl font-black leading-[1.02] tracking-tight md:text-6xl"
          >
            Elige tu banco en Europa con{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              criterio
            </span>
            .
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            Comparativas claras de bancos digitales (Revolut, N26, Wise…). Datos,
            fuentes y recomendaciones directas para decidir sin prisa.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/comparativa">
                Ver ranking
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/bancos">Ver bancos</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="border-t-2 border-border pt-6 text-sm text-muted-foreground"
          >
            IBAN Scanner, guías y comparativas sin humo.
          </motion.div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="lg:col-span-5"
        >
          <div className="rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-offset-accent">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              En 3 minutos
            </p>
            <h2 className="mt-4 text-balance text-2xl font-black leading-tight md:text-3xl">
              Qué hace FinanzasEU (y por qué te ahorra tiempo)
            </h2>

            <ul className="mt-6 space-y-4 text-sm text-secondary-foreground/85">
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-accent" />
                Licencia, IBAN y comisiones explicadas en lenguaje humano.
              </li>
              <li className="flex items-start gap-3">
                <ScanLine className="mt-0.5 h-4 w-4 text-accent" />
                Validador de IBAN SEPA para comprobar datos antes de enviar dinero.
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 text-accent" />
                Recomendaciones directas según tu caso (viajar, freelance, nómina).
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="sm" className="w-full flex-1 gap-2">
                <Link href="/iban">
                  IBAN Scanner
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="w-full flex-1">
                <Link href="/blog">Ver artículos</Link>
              </Button>
            </div>
          </div>
        </motion.aside>
      </Container>
    </section>
  );
}

