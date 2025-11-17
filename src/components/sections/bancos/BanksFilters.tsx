// src/components/sections/bancos/BanksFilters.tsx
"use client";

import { useMemo, useState } from "react";
import { banks, type Bank } from "@/lib/banks";
import BankCard from "@/components/bancos/BankCard";

type CategoryFilter = Bank["category"] | "all";

export default function BanksFilters() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [nonResidentsOnly, setNonResidentsOnly] = useState(false);

  const filteredBanks = useMemo(() => {
    return banks.filter((bank) => {
      const matchesSearch =
        search.trim().length === 0 ||
        bank.name.toLowerCase().includes(search.toLowerCase()) ||
        bank.tagline.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "all" ? true : bank.category === category;

      const matchesNonResidents = !nonResidentsOnly
        ? true
        : bank.tags.includes("no-residentes");

      return matchesSearch && matchesCategory && matchesNonResidents;
    });
  }, [search, category, nonResidentsOnly]);

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 md:flex-row md:items-center md:justify-between md:gap-4">
        {/* Buscador */}
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Buscar banco
          </label>
          <input
            type="text"
            placeholder="Revolut, N26, Wise…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filtro por tipo */}
        <div className="flex flex-1 flex-col gap-1">
          <label className="block text-xs font-medium text-muted-foreground">
            Tipo de banco
          </label>
          <select
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryFilter)}
          >
            <option value="all">Todos</option>
            <option value="neobanco">Neobancos</option>
            <option value="cuenta-multidivisa">Cuentas multidivisa</option>
            <option value="tradicional">Bancos tradicionales</option>
          </select>
        </div>

        {/* Filtro no residentes */}
        <div className="flex flex-col gap-2 md:w-[220px]">
          <label className="block text-xs font-medium text-muted-foreground">
            Opciones avanzadas
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={nonResidentsOnly}
              onChange={(e) => setNonResidentsOnly(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            Mostrar solo bancos que acepten no residentes
          </label>
        </div>
      </div>

      {/* Resultado */}
      {filteredBanks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No he encontrado bancos que encajen con esos filtros. Prueba a quitar
          alguno (por ejemplo, el de no residentes) o buscar por un nombre más
          general.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBanks.map((bank) => (
            <BankCard key={bank.slug} bank={bank} />
          ))}
        </div>
      )}
    </div>
  );
}
