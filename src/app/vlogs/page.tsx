// src/app/vlogs/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { vlogs } from "@/lib/vlogs";
import Container from "@/components/layout/Container";
import VlogCard from "@/components/vlogs/VlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FILTER_CHIPS = [
  { label: "Todos", value: "all" },
  { label: "Comisiones", value: "comisiones" },
  { label: "Multidivisa", value: "multidivisa" },
  { label: "Freelance", value: "freelance" },
  { label: "Vivir en Europa", value: "europa" },
];

// Partimos del tipo real que exporta "@/lib/vlogs"
type VlogBase = (typeof vlogs)[number];

// Le añadimos, de forma opcional, los campos que usamos aquí
type Vlog = VlogBase & {
  description?: string;
  tags?: string[];
  featured?: boolean;
};

export default function VlogsPage() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string>("all");

  // Trabajamos siempre con una versión tipada
  const typedVlogs = vlogs as Vlog[];

  // Featured: si tienes campo featured en el objeto, úsalo; si no, primeros 3
  const featuredVlogs = useMemo(() => {
    const withFeaturedFlag = typedVlogs.filter((v) => v.featured);
    if (withFeaturedFlag.length > 0) return withFeaturedFlag;
    return typedVlogs.slice(0, 3);
  }, [typedVlogs]);

  const otherVlogs = useMemo(
    () => typedVlogs.filter((v) => !featuredVlogs.includes(v)),
    [typedVlogs, featuredVlogs],
  );

  const filteredVlogs = useMemo(() => {
    const query = search.toLowerCase().trim();

    const matchesFilter = (title: string, description?: string) => {
      if (!query) return true;
      const haystack = `${title} ${description ?? ""}`.toLowerCase();
      return haystack.includes(query);
    };

    const matchesChip = (vlogTags: string[] = []) => {
      if (activeTag === "all") return true;

      switch (activeTag) {
        case "comisiones":
          return vlogTags.some((t) =>
            ["comisiones", "sin-comisiones"].includes(t),
          );
        case "multidivisa":
          return vlogTags.some((t) =>
            ["multidivisa", "viajes"].includes(t),
          );
        case "freelance":
          return vlogTags.some((t) =>
            ["freelance", "autónomo", "empresa"].includes(t),
          );
        case "europa":
          return vlogTags.some((t) =>
            ["europa", "moverse", "mudanza", "expatriado"].includes(t),
          );
        default:
          return true;
      }
    };

    const applyFilters = (list: Vlog[]) =>
      list.filter(
        (v) =>
          matchesFilter(v.title as string, v.description) &&
          matchesChip(v.tags ?? []),
      );

    return {
      featured: applyFilters(featuredVlogs),
      others: applyFilters(otherVlogs),
    };
  }, [search, activeTag, featuredVlogs, otherVlogs]);

  const totalCount =
    filteredVlogs.featured.length + filteredVlogs.others.length;

  return (
    <Container className="max-w-5xl pb-16">
      {/* HERO */}
      <section className="mb-10 rounded-3xl border border-emerald-500/10 bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-emerald-500/10 p-6 shadow-sm md:p-10">
        <div className="space-y-5">
          <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 shadow-sm dark:bg-black/70 dark:text-emerald-200">
            Blog &amp; vlogs financieros
          </span>
          <div className="space-y-3">
            <h1 className="text-balance bg-gradient-to-r from-emerald-700 via-slate-900 to-cyan-700 bg-clip-text text-3xl font-black leading-tight text-transparent md:text-4xl">
              Aprende a elegir banco como si fueras experto, sin serlo.
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              Guías sinceras para gente normal, no para banqueros. Te enseño cómo
              ahorrar comisiones, mover tu dinero por Europa y no meter la pata
              al elegir cuenta.
            </p>
          </div>

          {/* Buscador + chips */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Busca por banco, tema o país..."
                className="h-10 rounded-full border border-emerald-500/20 bg-white pl-9 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500/30 dark:bg-black"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {FILTER_CHIPS.map((chip) => {
                const isActive = activeTag === chip.value;
                return (
                  <Button
                    key={chip.value}
                    type="button"
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    onClick={() => setActiveTag(chip.value)}
                    className={`rounded-full px-3 text-xs md:text-sm ${
                      isActive
                        ? "border-0 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-sm"
                        : "border-emerald-500/20 bg-white text-emerald-800 hover:border-emerald-500/40 dark:bg-black dark:text-emerald-100"
                    }`}
                  >
                    {chip.label}
                  </Button>
                );
              })}

              <span className="ml-auto text-xs text-muted-foreground">
                {totalCount} artículo{totalCount !== 1 ? "s" : ""} para ayudarte
                a decidir.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* DESTACADOS */}
      {filteredVlogs.featured.length > 0 && (
        <section className="mb-10 rounded-3xl border border-border/40 bg-background/60 p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold md:text-xl">
                Artículos destacados
              </h2>
              <p className="text-xs text-muted-foreground md:text-sm">
                Empieza por aquí si aún no tienes claro qué banco usar como
                principal.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-6 md:gap-8">
            {filteredVlogs.featured.map((vlog) => (
              <VlogCard key={vlog.slug} vlog={vlog} variant="featured" />
            ))}
          </div>
        </section>
      )}

      {/* RESTO DE ARTÍCULOS */}
      <section className="space-y-4 rounded-3xl border border-border/40 bg-background/60 p-4 shadow-sm md:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold md:text-xl">
            Todos los artículos
          </h2>
          <p className="text-xs text-muted-foreground md:text-sm">
            Historias reales, comparativas sinceras y guías paso a paso.
          </p>
        </div>

        {filteredVlogs.others.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-sm text-muted-foreground">
            <span>No hay artículos que coincidan con tu búsqueda.</span>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveTag("all");
              }}
              className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-300"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {filteredVlogs.others.map((vlog) => (
            <VlogCard key={vlog.slug} vlog={vlog} />
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mt-10 grid gap-4 md:grid-cols-[2fr,1.5fr]">
        <div className="rounded-3xl border border-emerald-500/20 bg-white p-5 shadow-sm dark:bg-black">
          <h3 className="text-base font-semibold md:text-lg">
            ¿Bloqueado con tu banco actual?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Si después de leer prefieres que alguien te lo resuma, escríbeme y te
            digo qué 2–3 opciones miraría yo en tu lugar.
          </p>
          <div className="mt-4">
            <a
              href="/contacto"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
            >
              Hablar conmigo
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-border/40 bg-background p-5 shadow-sm">
          <h3 className="text-base font-semibold md:text-lg">
            ¿Quieres pasar ya a la acción?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Mira el ranking completo de bancos y elige tu cuenta ideal en menos
            de 60 segundos.
          </p>
          <div className="mt-4">
            <a
              href="/comparativa"
              className="inline-flex items-center rounded-full border border-emerald-500/40 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-emerald-900/40"
            >
              Ir a la comparativa
            </a>
          </div>
        </div>
      </section>
    </Container>
  );
}
