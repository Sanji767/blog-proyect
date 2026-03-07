"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, ArrowRight, Sparkles } from "lucide-react";

import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { stripLocaleFromPathname } from "@/lib/i18n";

const COPY = {
  es: {
    close: "Cerrar",
    badge: "Recurso gratuito",
    titleTop: "Guía 2026:",
    titleAccent: "Mejores bancos digitales",
    desc:
      "Comparativa con criterios claros (IBAN, comisiones y requisitos) para elegir con calma.",
    cta: "Ver la guía",
    footnote: "Sin registro. Lectura rápida y directa.",
  },
  en: {
    close: "Close",
    badge: "Free resource",
    titleTop: "2026 Guide:",
    titleAccent: "Best digital banks",
    desc:
      "A comparison with clear criteria (IBAN, fees, and requirements) to choose calmly.",
    cta: "Read the guide",
    footnote: "No signup. Quick, direct read.",
  },
} as const;

export default function StickyPromo() {
  const { locale } = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const normalizedPathname = stripLocaleFromPathname(pathname ?? "/");
  const copy = COPY[locale];

  useEffect(() => {
    if (normalizedPathname !== "/") {
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

  if (normalizedPathname !== "/") return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          className="fixed bottom-6 left-6 right-6 z-50 md:left-auto md:right-8 md:bottom-8 md:w-[380px]"
        >
          <div className="relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary shadow-offset-accent">
            {/* Glow sutil */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            
            <div className="relative p-6 text-secondary-foreground">
              {/* Botón Cerrar */}
              <button
                onClick={closePromo}
                aria-label={copy.close}
                className="absolute right-4 top-4 rounded-full p-1 text-secondary-foreground/60 transition-colors hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-secondary-foreground/15 bg-accent shadow-offset-accent">
                  <Gift className="h-6 w-6 text-accent-foreground" />
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                      <Sparkles className="h-3 w-3" />
                      {copy.badge}
                    </div>
                    <h4 className="text-lg font-bold leading-tight">
                      {copy.titleTop} <br />
                      <span className="text-accent">{copy.titleAccent}</span>
                    </h4>
                    <p className="text-xs text-secondary-foreground/75 leading-relaxed">
                      {copy.desc}
                    </p>
                  </div>

                  <LocalizedLink
                    href="/blog/los-mejores-bancos-digitales-en-europa-en-2026"
                    onClick={closePromo}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-secondary bg-accent py-3 text-xs font-black uppercase tracking-widest text-accent-foreground transition-transform hover:-translate-x-1 hover:-translate-y-1 active:translate-y-px shadow-offset-accent"
                  >
                    {copy.cta}
                    <ArrowRight className="h-3 w-3" />
                  </LocalizedLink>
                  
                  <p className="text-[9px] text-center text-secondary-foreground/40 italic">
                    {copy.footnote}
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
