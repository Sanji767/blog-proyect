// src/components/sections/home/HomeBanksPreview.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Trophy, ArrowUpRight } from "lucide-react";
import Container from "@/components/layout/Container";
import { banks } from "@/lib/banks";

export default function HomeBanksPreview() {
  const featured = [...banks].slice(0, 3);

  return (
    <section className="py-24 bg-muted/30">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black">Recomendaciones Top</h2>
            <p className="text-muted-foreground max-w-lg">
              Los bancos que mejor funcionan para abrir cuenta online desde el extranjero o para uso multidivisa.
            </p>
          </div>
          <Link href="/bancos" className="text-sm font-bold flex items-center gap-1 group">
            Ver todo el directorio 
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((bank, index) => (
            <motion.article
              key={bank.slug}
              whileHover={{ scale: 1.02 }}
              className="relative flex flex-col rounded-[2.5rem] border border-border bg-background p-6 shadow-sm overflow-hidden"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="h-16 w-16 relative bg-muted rounded-[1.25rem] p-3 overflow-hidden">
                  <Image src={bank.logo} alt={bank.name} fill className="object-contain p-2" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Trophy className="h-3 w-3" />
                  # {index + 1}
                </div>
              </div>

              <div className="space-y-2 mb-8 flex-1">
                <h3 className="text-2xl font-bold tracking-tight">{bank.name}</h3>
                <div className="flex gap-2 text-[10px] font-semibold text-muted-foreground">
                  <span className="bg-muted px-2 py-0.5 rounded">IBAN {bank.ibanCountry}</span>
                  <span className="bg-muted px-2 py-0.5 rounded">{bank.country}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                  {bank.tagline}
                </p>
              </div>

              <div className="grid gap-3">
                <Link
                  href={`/programas/${bank.slug}`}
                  className="w-full inline-flex items-center justify-center rounded-2xl bg-muted py-3.5 text-sm font-bold transition-colors hover:bg-emerald-500 hover:text-white"
                >
                  Análisis Detallado
                </Link>
                {bank.affiliateUrl && (
                  <a
                    href={bank.affiliateUrl}
                    data-analytics="affiliate"
                    data-affiliate-partner={bank.slug}
                    target="_blank"
                    className="w-full inline-flex items-center justify-center rounded-2xl border border-border py-3.5 text-sm font-bold text-muted-foreground hover:border-emerald-500/50 transition-colors"
                  >
                    Abrir cuenta oficial
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
