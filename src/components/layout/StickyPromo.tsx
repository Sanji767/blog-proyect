"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, ArrowRight, Sparkles } from "lucide-react";

export default function StickyPromo() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      setIsVisible(false);
      return;
    }

    // Esperamos 5 segundos antes de mostrar la promo para no agobiar al usuario
    const timer = setTimeout(() => {
      // Solo lo mostramos si el usuario no lo ha cerrado ya en esta sesión
      const isClosed = sessionStorage.getItem("promo-closed");
      if (!isClosed) {
        setIsVisible(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const closePromo = () => {
    setIsVisible(false);
    sessionStorage.setItem("promo-closed", "true");
  };

  if (pathname !== "/") return null;

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
                      Guía 2026: <br />
                      <span className="text-emerald-400">Mejores bancos digitales</span>
                    </h4>
                    <p className="text-xs text-background/60 leading-relaxed">
                      Comparativa con criterios claros (IBAN, comisiones y requisitos) para elegir con calma.
                    </p>
                  </div>

                  <Link
                    href="/blog/los-mejores-bancos-digitales-en-europa-en-2026"
                    onClick={closePromo}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/20"
                  >
                    Ver la guía
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  
                  <p className="text-[9px] text-center text-background/30 italic">
                    Sin registro. Lectura rápida y directa.
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
