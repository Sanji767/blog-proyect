// src/components/sections/bancos/BanksFilters.tsx
"use client";

import { useMemo, useState } from "react";
import { Search, XCircle, Globe2, Filter } from "lucide-react";
import {
  banks,
  type Bank,
  type BankFeatureTag,
} from "@/lib/banks";
import BankCard from "@/components/bancos/BankCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type CategoryFilter = Bank["category"] | "all";

// Ahora usamos BankFeatureTag, no string
type QuickFilter = {
  label: string;
  value: BankFeatureTag;
};

const quickFilters: QuickFilter[] = [
  { label: "Sin comisiones", value: "sin-comisiones" },
  { label: "Multidivisa", value: "multidivisa" },
  { label: "Para freelancers", value: "para-freelancers" },
  { label: "Acepta no residentes", value: "no-residentes" },
];

export default function BanksFilters() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [nonResidentsOnly, setNonResidentsOnly] = useState(false);

  // Aquí también tipamos como BankFeatureTag | null
  const [tagFilter, setTagFilter] = useState<BankFeatureTag | null>(
    null,
  );

  const filteredBanks = useMemo(() => {
    const query = search.toLowerCase().trim();

    const list = [...banks].sort((a, b) => {
      const aAff = a.affiliateUrl ? 1 : 0;
      const bAff = b.affiliateUrl ? 1 : 0;
      if (aAff !== bAff) return bAff - aAff;
      return a.name.localeCompare(b.name);
    });

    return list.filter((bank) => {
      const matchesSearch =
        !query ||
        bank.name.toLowerCase().includes(query) ||
        bank.tagline.toLowerCase().includes(query) ||
        bank.country.toLowerCase().includes(query);

      const matchesCategory =
        category === "all" ? true : bank.category === category;

      const matchesNonResidents = !nonResidentsOnly
        ? true
        : bank.tags.includes("no-residentes");

      const matchesTag = tagFilter
        ? bank.tags.includes(tagFilter) // aquí ya no hay error
        : true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesNonResidents &&
        matchesTag
      );
    });
  }, [search, category, nonResidentsOnly, tagFilter]);

  const total = banks.length;
  const current = filteredBanks.length;

  const handleClear = () => {
    setSearch("");
    setCategory("all");
    setNonResidentsOnly(false);
    setTagFilter(null);
  };

  return (
    <section className="space-y-6">
      {/* Controles */}
      <div className="space-y-4 rounded-3xl border border-border bg-background/90 p-4 shadow-sm md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Filter className="h-4 w-4 text-emerald-500" />
            <span>Filtra bancos según lo que buscas</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge
              variant="outline"
              className="rounded-full border-emerald-500/30 bg-emerald-500/5 text-[11px] text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-200"
            >
              {current} de {total} bancos
            </Badge>
            {tagFilter && (
              <span className="hidden text-[11px] text-muted-foreground sm:inline">
                Filtro rápido activo: {quickFilters.find(q => q.value === tagFilter)?.label}
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1.3fr,1fr,1.1fr]">
          {/* Buscador */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Buscar banco
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Revolut, N26, Wise, país..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 rounded-full border-border bg-background pl-9 pr-8 text-sm"
              />
              {search && (
                <button
                  type="button"
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearch("")}
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Tipo de banco */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Tipo de banco
            </label>
            <Select
              value={category}
              onValueChange={(value) =>
                setCategory(value as CategoryFilter)
              }
            >
              <SelectTrigger className="h-10 rounded-full border-border bg-background text-sm">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="neobanco">Neobancos</SelectItem>
                <SelectItem value="cuenta-multidivisa">
                  Cuentas multidivisa
                </SelectItem>
                <SelectItem value="tradicional">
                  Bancos tradicionales
                </SelectItem>
                <SelectItem value="fintech">Fintech</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* No residentes + reset */}
          <div className="flex flex-col justify-between gap-2 text-xs">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Opciones avanzadas
              </label>
              <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={nonResidentsOnly}
                  onChange={(e) =>
                    setNonResidentsOnly(e.target.checked)
                  }
                  className="h-4 w-4 rounded border-border text-emerald-600 focus:ring-emerald-500"
                />
                <span className="flex items-center gap-1">
                  <Globe2 className="h-3.5 w-3.5 text-emerald-500" />
                  Mostrar solo bancos que acepten no residentes
                </span>
              </label>
            </div>
            <div className="flex items-center justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-full px-3 text-[11px] text-muted-foreground hover:text-foreground"
                onClick={handleClear}
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Quick filters chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {quickFilters.map((f) => {
            const active = tagFilter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() =>
                  setTagFilter((prev) =>
                    prev === f.value ? null : f.value,
                  )
                }
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resultado */}
      {filteredBanks.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          No he encontrado bancos que encajen con esos filtros. Prueba a
          quitar alguno (por ejemplo, el de no residentes) o buscar por
          un nombre más general.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBanks.map((bank) => (
            <BankCard key={bank.slug} bank={bank} />
          ))}
        </div>
      )}
    </section>
  );
}
