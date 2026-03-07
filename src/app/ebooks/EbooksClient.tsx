"use client";

// src/app/ebooks/EbooksClient.tsx

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Container from "@/components/layout/Container";
import EbookCard from "@/components/ebooks/EbookCard";
import { Button } from "@/components/ui/button";
import { ebooks } from "@/lib/ebooks-data";

export default function EbooksPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const categories = useMemo(() => {
    return ["Todos", ...Array.from(new Set(ebooks.map((e) => e.category)))];
  }, []);

  const filteredEbooks = useMemo(() => {
    return ebooks.filter(
      (ebook) => activeCategory === "Todos" || ebook.category === activeCategory,
    );
  }, [activeCategory]);

  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-12">
        <header className="mx-auto max-w-3xl space-y-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Biblioteca
          </p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-balance text-4xl font-black tracking-tight md:text-6xl"
          >
            Guías y cursos para tomar{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              mejores decisiones
            </span>
            .
          </motion.h1>

          <p className="text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            Recursos prácticos sobre banca, inversión y vida financiera en
            Europa. Menos teoría, más acción.
          </p>

          <nav className="flex flex-wrap justify-center gap-2 pt-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Button
                  key={cat}
                  type="button"
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setActiveCategory(cat)}
                  className="rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
                >
                  {cat}
                </Button>
              );
            })}
          </nav>
        </header>

        <motion.section
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredEbooks.map((ebook) => (
              <motion.div
                key={ebook.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <EbookCard ebook={ebook} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.section>

        {filteredEbooks.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No se encontraron ebooks en esta categoría.
          </p>
        ) : null}
      </Container>
    </section>
  );
}
