"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ArrowRightLeft, TrendingDown, Landmark } from "lucide-react";
import Container from "@/components/layout/Container";

// Datos simulados basados en las comparativas de tu sitio
const COMPARISON_DATA = [
  {
    name: "Banca Tradicional (Media)",
    feePercent: 3.5,
    fixedFee: 5.0,
    isBank: true,
    logo: <Landmark className="h-5 w-5" />,
  },
  {
    name: "Revolut (Plan Standard)",
    feePercent: 0.5,
    fixedFee: 0,
    isBank: false,
    color: "bg-blue-600",
  },
  {
    name: "Wise",
    feePercent: 0.41,
    fixedFee: 0,
    isBank: false,
    color: "bg-emerald-500",
  },
];

export default function CurrencyComparison() {
  const [amount, setAmount] = useState(1000);

  const calculateTotal = (val: number, feeP: number, fixed: number) => {
    return val - (val * (feeP / 100) + fixed);
  };

  return (
    <section className="py-20 bg-muted/20">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Columna Izquierda: Controladores */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
              <ArrowRightLeft className="h-3 w-3" />
              Calculadora de Ahorro Real
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              No dejes que las comisiones <br />
              <span className="text-emerald-500">se coman tu dinero.</span>
            </h2>
            <p className="text-muted-foreground">
              Mueve el selector para ver cuánto dinero llega realmente al destino 
              cuando envías dinero al extranjero o pagas en otra divisa.
            </p>

            <div className="p-6 bg-background rounded-3xl border border-border shadow-sm space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold">Cantidad a enviar</label>
                  <span className="text-3xl font-black text-emerald-500">
                    {amount.toLocaleString()} €
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase">
                  <span>100 €</span>
                  <span>5.000 €</span>
                  <span>10.000 €</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Visualización de Resultados */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {COMPARISON_DATA.map((item) => {
                const total = calculateTotal(amount, item.feePercent, item.fixedFee);
                const lost = amount - total;
                const isWinner = !item.isBank && item.feePercent < 1;

                return (
                  <motion.div
                    layout
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`relative p-5 rounded-2xl border transition-all ${
                      isWinner 
                        ? "border-emerald-500/30 bg-emerald-500/[0.02] shadow-md" 
                        : "border-border bg-background"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${item.color || "bg-muted"} text-white font-bold`}>
                          {item.logo || item.name[0]}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold">{item.name}</h3>
                          <p className="text-[10px] text-muted-foreground">
                            Comisión estimada: {item.feePercent}% {item.fixedFee > 0 && `+ ${item.fixedFee}€`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-lg font-black tracking-tighter">
                          {total.toLocaleString(undefined, { minimumFractionDigits: 2 })} €
                        </span>
                        <span className="text-[10px] font-medium text-red-500">
                          -{lost.toLocaleString()} € de comisión
                        </span>
                      </div>
                    </div>
                    
                    {isWinner && (
                      <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                        <TrendingDown className="h-2 w-2" />
                        MEJOR OPCIÓN
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
              <Info className="h-5 w-5 text-blue-500 shrink-0" />
              <p className="text-[11px] text-blue-700/80 leading-relaxed">
                Los datos son estimaciones basadas en las tarifas estándar de 2026. 
                Los bancos tradicionales suelen aplicar además un sobrecoste oculto 
                en el tipo de cambio del 2% al 5%.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
