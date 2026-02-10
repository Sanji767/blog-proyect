// src/components/sections/home/Hero.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Globe2 } from "lucide-react";
import Container from "@/components/layout/Container";

export default function Hero() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const quickTokens = ["IBAN", "TOP", "BLOG", "FAQ"];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background py-20 md:py-32">
      {/* Background Decoración Avanzada */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-96 w-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-cyan-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div 
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <Sparkles className="h-4 w-4" />
            FinanzasEU · Guía independiente
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-4xl font-black tracking-tight sm:text-6xl text-balance">
            Abre tu cuenta en Europa <br />
            <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400 bg-clip-text text-transparent">
              sin fronteras mentales
            </span>.
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Analizamos bancos digitales como <strong>Revolut, N26 o Wise</strong>. Filtrado por humanos para humanos, sin letra pequeña ni banners engañosos.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
            <Link href="/comparativa" className="group relative inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-sm font-bold text-background transition-all hover:scale-105 active:scale-95">
              Explorar Ranking
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/bancos" className="inline-flex items-center justify-center rounded-full border border-border bg-background/50 backdrop-blur-sm px-8 py-4 text-sm font-bold transition-all hover:bg-muted">
              Listado Completo
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex items-center gap-6 pt-4 border-t border-border/50">
            <div className="flex -space-x-3">
              {quickTokens.map((token) => (
                <div
                  key={token}
                  className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[9px] font-bold uppercase"
                >
                  {token}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Comparativas, IBAN Scanner y guías <br /> para elegir con criterio.
            </p>
          </motion.div>
        </motion.div>

        {/* Columna Derecha: Tarjeta Interactiva Framer */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000" />
          <div className="relative rounded-[2rem] border border-border bg-background/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold tracking-tight">Análisis Rápido</h3>
                <span className="text-[10px] font-mono bg-muted px-2 py-1 rounded tracking-tighter uppercase">Actualizado</span>
              </div>
              
              <div className="space-y-4">
                <MetricRow label="Bancos comparados" value="25+" progress={80} />
                <MetricRow label="Costo del servicio" value="0.00€" progress={100} />
                <MetricRow label="Fiabilidad" value="Alta (UE)" progress={95} />
              </div>

              <div className="pt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-emerald-500/5 p-3 border border-emerald-500/10">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 mb-2" />
                  <p className="text-[11px] font-bold">Seguridad UE</p>
                </div>
                <div className="rounded-2xl bg-cyan-500/5 p-3 border border-cyan-500/10">
                  <Globe2 className="h-5 w-5 text-cyan-500 mb-2" />
                  <p className="text-[11px] font-bold">Multidivisa</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function MetricRow({ label, value, progress }: { label: string; value: string; progress: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-muted-foreground">{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${progress}%` }} 
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" 
        />
      </div>
    </div>
  );
}
