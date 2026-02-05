"use client";

import { useState, useMemo } from "react";
import { ebooks } from "@/lib/ebooks-data";
import EbookCard from "@/components/ebooks/EbookCard";
import { motion, AnimatePresence } from "framer-motion";

export default function EbooksPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  // Extraer categorías únicas dinámicamente
  const categories = useMemo(() => {
    return ["Todos", ...Array.from(new Set(ebooks.map((e) => e.category)))];
  }, []);

  // Filtrado lógico
  const filteredEbooks = ebooks.filter(
    (ebook) => activeCategory === "Todos" || ebook.category === activeCategory
  );

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section con Gradiente */}
      <section className="relative mb-16 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(59,130,246,0.1),transparent)]" />
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
        >
          Biblioteca de <span className="text-blue-600">FinanzasEU</span>
        </motion.h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Domina tu economía con nuestras guías estratégicas. Desde inversión en dividendos 
          hasta optimización fiscal, todo en un solo lugar.
        </p>
      </section>

      {/* Filtros Dinámicos */}
      <nav className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 
              ${activeCategory === cat 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"}`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* Grid con AnimatePresence para transiciones suaves */}
      <motion.section 
        layout
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredEbooks.map((ebook) => (
            <motion.div
              key={ebook.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <EbookCard ebook={ebook} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.section>

      {/* Empty State */}
      {filteredEbooks.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500">No se encontraron ebooks en esta categoría.</p>
        </div>
      )}
    </main>
  );
}