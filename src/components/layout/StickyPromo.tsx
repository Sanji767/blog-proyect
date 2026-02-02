"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, ArrowRight, Sparkles } from "lucide-react";

export default function StickyPromo() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Esperamos 5 segundos antes de mostrar la promo para no agobiar al usuario
    const timer = setTimeout(() => {
      // Solo lo mostramos si el usuario no lo ha cerrado ya en esta sesión
      const isClosed = sessionStorage.getItem("promo-closed");
      if (!isClosed) {
        setIsVisible(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const closePromo = () => {
    setIsVisible(false);
    sessionStorage.setItem("promo-closed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          className="fixed bottom-6 left-6 right-6 z-50 md:left-auto md:right-8 md:bottom-8 md:w-[380px]"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] bg-foreground p-1 shadow-2xl">
            {/* Efecto de brillo de fondo */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
            
            <div className="relative rounded-[2.3rem] bg-foreground p-6 text-background">
              {/* Botón Cerrar */}
              <button
                onClick={closePromo}
                className="absolute right-4 top-4 rounded-full p-1 text-background/40 transition-colors hover:bg-white/10 hover:text-background"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/30">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                      <Sparkles className="h-3 w-3" />
                      Recurso Gratuito
                    </div>
                    <h4 className="text-lg font-bold leading-tight">
                      Guía de Supervivencia: <br />
                      <span className="text-emerald-400">Finanzas para Expats</span>
                    </h4>
                    <p className="text-xs text-background/60 leading-relaxed">
                      Descarga nuestra guía en PDF con los 5 errores que más dinero te hacen perder al mudarte a Europa.
                    </p>
                  </div>

                  <form 
                    onSubmit={(e) => e.preventDefault()} 
                    className="flex flex-col gap-2 pt-1"
                  >
                    <input 
                      type="email" 
                      placeholder="Tu mejor email..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-background outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                    />
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/20">
                      Enviar Guía
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </form>
                  
                  <p className="text-[9px] text-center text-background/30 italic">
                    Cero spam. Solo consejos financieros reales cada semana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}