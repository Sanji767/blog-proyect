// src/components/sections/home/UseCases.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Plane, Home, Users, ArrowRight, Star } from "lucide-react";
import Container from "@/components/layout/Container";
import Image from "next/image";
import Link from "next/link";
import { banks } from "@/lib/banks"; 

const CASES = [
  { 
    id: 'remoto', 
    label: 'Trabajo Remoto', 
    icon: Briefcase, 
    text: 'IBAN para cobrar en varias divisas y gestionar cobros internacionales.',
    recommendedBank: 'wise' // Coincide con tu slug "wise"
  },
  { 
    id: 'viajero', 
    label: 'Viajero Pro', 
    icon: Plane, 
    text: 'Tarjetas con el mejor tipo de cambio y gestión multidivisa top.',
    recommendedBank: 'revolut' // Coincide con tu slug "revolut"
  },
  { 
    id: 'ahorro', 
    label: 'Cuenta Nómina', 
    icon: Home, 
    text: 'Seguridad alemana con IBAN DE para domiciliar todo sin problemas.',
    recommendedBank: 'n26' // Coincide con tu slug "n26"
  },
  { 
    id: 'negocios', 
    label: 'Autónomos / Pymes', 
    icon: Users, 
    text: 'Gestión por subcuentas con IBAN propio para organizar tus impuestos.',
    recommendedBank: 'bunq' // Coincide con tu slug "bunq"
  },
];

export default function UseCases() {
  const [active, setActive] = useState('remoto');

  const currentCase = CASES.find(c => c.id === active);
  // Buscamos en tu array de bancos el objeto que coincida con el slug recomendado
  const recommended = banks.find(b => b.slug === currentCase?.recommendedBank);

  return (
    <section className="py-20">
      <Container>
        <div className="bg-card border border-border rounded-[3rem] p-8 md:p-12 shadow-sm">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Selector de Perfiles */}
            <div className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                Dime quién eres, <br />
                <span className="text-emerald-500">te diré qué banco necesitas.</span>
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {CASES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActive(c.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                      active === c.id 
                        ? "bg-emerald-500 text-white border-emerald-600 shadow-lg scale-[1.02]" 
                        : "bg-background hover:border-emerald-500/50"
                    }`}
                  >
                    <c.icon className={`h-6 w-6 ${active === c.id ? "text-white" : "text-emerald-500"}`} />
                    <span className="font-bold">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Visualización de la Recomendación */}
            <div className="flex flex-col justify-center bg-muted/30 rounded-[2rem] p-8 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 relative z-10"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded">
                      Nuestra Recomendación
                    </span>
                    <p className="text-2xl font-bold leading-tight">
                      “{currentCase?.text}”
                    </p>
                  </div>

                  {recommended ? (
                    <div className="bg-background rounded-3xl p-6 border border-border shadow-xl">
                      <div className="flex items-center gap-5 mb-6">
                        <div className="h-16 w-16 relative bg-muted rounded-2xl p-2 shrink-0 flex items-center justify-center">
                          <Image 
                            src={recommended.logo} 
                            alt={recommended.name} 
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="font-black text-xl">{recommended.name}</h4>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-[10px] font-bold uppercase">Top para {currentCase?.label}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-[11px]">
                          <span className="text-muted-foreground block">IBAN</span>
                          <span className="font-bold">{recommended.ibanPrefix} ({recommended.ibanCountry})</span>
                        </div>
                        <div className="text-[11px]">
                          <span className="text-muted-foreground block">Cuota mensual</span>
                          <span className="font-bold text-emerald-600">{recommended.fees.monthly}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link 
                          href={`/programas/${recommended.slug}`}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background py-3 text-xs font-bold hover:bg-foreground/90 transition-colors"
                        >
                          Ver análisis completo <ArrowRight className="h-3 w-3" />
                        </Link>
                        {recommended.affiliateUrl && (
                          <a 
                            href={recommended.affiliateUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-center text-[11px] font-bold text-muted-foreground hover:text-emerald-500 py-1"
                          >
                            Ir a la web oficial
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hemos encontrado datos para este banco.</p>
                  )}
                </motion.div>
              </AnimatePresence>
              
              <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-emerald-500/5 rounded-full blur-3xl" />
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}
