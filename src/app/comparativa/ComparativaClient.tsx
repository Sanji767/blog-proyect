// src/app/comparativa/ComparativaClient.tsx
"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  banks,
  type Bank,
  type BankCategory,
  type BankFeatureTag,
} from "@/lib/banks";
import { formatIsoYmdToEsDate } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import Container from "@/components/layout/Container";
import {
  Search,
  ArrowUpDown,
  Info,
  ExternalLink,
  X,
  Heart,
  Download,
  XCircle,
  CheckCircle,
  Trash2,
  Eye,
  Star,
  Trophy,
} from "lucide-react";

// === TIPOS ===
type BankTag = BankFeatureTag;
type FilterType = "all" | BankCategory;
type FilterTag = "all" | BankTag;
type SortKey = "name" | "monthlyFee" | "cardType" | "country";

// === HOOK useLocalStorage ===
function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// === CONSTANTES ===
const tagLabels: Record<string, string> = {
  "sin-comisiones": "Sin comisiones",
  "tarjeta-fisica": "Tarjeta física",
  "tarjeta-virtual": "Tarjeta virtual",
  multidivisa: "Multidivisa",
  crypto: "Cripto",
  "para-freelancers": "Para freelancers",
  "para-empresa": "Para empresa",
  "no-residentes": "Acepta no residentes",
  espanol: "Español",
  "iban-es": "IBAN ES",
  "iban-nl": "IBAN NL",
  "iban-de": "IBAN DE",
  "seguro-depositos": "Seguro depósitos",
  "soporte-24-7": "Soporte 24/7",
};

const categoryLabels: Record<BankCategory, string> = {
  neobanco: "Neobanco",
  tradicional: "Banco tradicional",
  "cuenta-multidivisa": "Cuenta multidivisa",
  fintech: "Fintech",
};

// === COMPONENTE PRINCIPAL ===
export default function ComparativaPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterTag, setFilterTag] = useState<FilterTag>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [favorites, setFavorites] = useLocalStorage<
    Array<Bank & { addedAt: string }>
  >("bank-favorites", []);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [quizMode, setQuizMode] = useState<"idle" | "done">("idle");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const tableRef = useRef<HTMLDivElement | null>(null);
  const favoritesCount = favorites.length;

  const lastUpdatedLabel = useMemo(() => {
    const latest = banks
      .map((b) => b._lastUpdated)
      .filter(Boolean)
      .sort()
      .at(-1);
    return formatIsoYmdToEsDate(latest);
  }, []);

  const allTags = useMemo((): BankTag[] => {
    const tags = new Set<BankTag>();
    banks.forEach((b) => b.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  const isFavorite = (slug: string) =>
    favorites.some((f) => f.slug === slug);

  const toggleFavorite = (bank: Bank) => {
    if (isFavorite(bank.slug)) {
      setFavorites(favorites.filter((f) => f.slug !== bank.slug));
    } else {
      setFavorites([
        ...favorites,
        { ...bank, addedAt: new Date().toISOString() },
      ]);
    }
  };

  const toggleCompare = (slug: string) => {
    setCompareIds((prev) =>
      prev.includes(slug)
        ? prev.filter((id) => id !== slug)
        : prev.length < 2
        ? [...prev, slug]
        : prev,
    );
  };

  const exportToPDF = async () => {
    if (!tableRef.current) return;
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
    const canvas = await html2canvas(tableRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("comparativa-bancos-europa.pdf");
  };

  const filteredAndSorted = useMemo(() => {
    const filtered = banks.filter((bank) => {
      const query = search.toLowerCase();
      const matchesSearch =
        bank.name.toLowerCase().includes(query) ||
        bank.tagline.toLowerCase().includes(query) ||
        bank.tags.some((t) =>
          (tagLabels[t] || t).toLowerCase().includes(query),
        );
      const matchesType =
        filterType === "all" || bank.category === filterType;
      const matchesTag =
        filterTag === "all" || bank.tags.includes(filterTag);
      const matchesFavorites =
        !favoritesOnly || favorites.some((f) => f.slug === bank.slug);
      return matchesSearch && matchesType && matchesTag && matchesFavorites;
    });

    const parseFee = (fee?: string): number => {
      if (!fee) return 999;
      if (/gratis/i.test(fee) || /0\s*€/.test(fee)) return 0;
      const num = parseFloat(
        fee.replace(/[^\d.,]/g, "").replace(",", "."),
      );
      return isNaN(num) ? 999 : num;
    };

    filtered.sort((a, b) => {
      const aAff = a.affiliateUrl ? 1 : 0;
      const bAff = b.affiliateUrl ? 1 : 0;
      if (aAff !== bAff) return bAff - aAff;

      let comparison = 0;
      switch (sortKey) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "country":
          comparison = a.country.localeCompare(b.country);
          break;
        case "cardType":
          comparison = (a.cardType ?? "").localeCompare(
            b.cardType ?? "",
          );
          break;
        case "monthlyFee":
          comparison =
            parseFee(a.fees?.monthly) - parseFee(b.fees?.monthly);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [search, filterType, filterTag, sortKey, sortOrder, favoritesOnly, favorites]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const compareBanks = compareIds
    .map((id) => banks.find((b) => b.slug === id))
    .filter((b): b is Bank => !!b);

  const isFreeFee = (fee?: string) =>
    !!fee && (/gratis/i.test(fee) || /0\s*€/.test(fee));

  const quickFilters: {
    label: string;
    emoji: string;
    tag?: BankTag;
    type?: FilterType;
  }[] = [
    { label: "Sin comisiones", emoji: "💸", tag: "sin-comisiones" },
    { label: "Multidivisa", emoji: "🌍", tag: "multidivisa" },
    { label: "Para freelancers", emoji: "🧑‍💻", tag: "para-freelancers" },
    { label: "Neobancos TOP", emoji: "⚡", type: "neobanco" },
  ];

  const handleQuizApply = (opts: {
    type?: FilterType;
    tag?: FilterTag;
    sortKey?: SortKey;
  }) => {
    if (opts.type) setFilterType(opts.type);
    if (opts.tag) setFilterTag(opts.tag);
    if (opts.sortKey) {
      setSortKey(opts.sortKey);
      setSortOrder("asc");
    }
    setQuizMode("done");
  };

  return (
    <main className="py-10">
      <Container className="space-y-10">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-offset-accent sm:p-10"
      >
        <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
              <Trophy className="h-4 w-4" />
              <span>Ranking TOP bancario Europa</span>
              <span className="rounded-full border-2 border-secondary bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                Metodología clara
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Star className="h-7 w-7 text-accent" />
              <h1 className="text-balance text-4xl font-black tracking-tight text-accent sm:text-5xl">
                Comparativa de bancos en Europa
              </h1>
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-secondary-foreground/80 sm:text-base">
              Encuentra tu banco ideal en{" "}
              <strong className="text-secondary-foreground">
                menos de 60 segundos
              </strong>
              . Filtra, ordena, compara y guarda favoritos con criterios claros
              y enlaces oficiales.
            </p>

            <div className="mt-4 grid gap-3 sm:max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-secondary-foreground/80">
                {lastUpdatedLabel ? (
                  <span className="inline-flex items-center gap-1 rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-3 py-1">
                    <Info className="h-4 w-4" />
                    Actualizado:{" "}
                    <strong className="font-semibold">{lastUpdatedLabel}</strong>
                  </span>
                ) : null}

                <Link
                  href="/aviso-afiliados"
                  className="inline-flex items-center gap-1 rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-3 py-1 underline underline-offset-4"
                >
                  Aviso de afiliados
                </Link>
              </div>

              <details className="rounded-2xl border-2 border-secondary-foreground/10 bg-secondary-foreground/5 p-5 text-xs text-secondary-foreground/80">
                <summary className="cursor-pointer font-semibold">
                  Metodología y fuentes oficiales
                </summary>
                <div className="mt-3 space-y-3 leading-relaxed">
                  <p>
                    Ordenamos el ranking principalmente por utilidad real para
                    el usuario (costes, IBAN y requisitos), y siempre dejamos
                    enlaces oficiales para verificar condiciones.
                  </p>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Cuota, cajeros, cambio de divisa y comisiones.</li>
                    <li>IBAN/SEPA y operativa (nómina, pagos, domiciliaciones).</li>
                    <li>Requisitos, países admitidos y proceso de alta.</li>
                    <li>Licencia, supervisión y garantía de depósitos (según entidad).</li>
                  </ul>

                  <div>
                    <p className="font-semibold">Fuentes oficiales:</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {banks.map((bank) => (
                        <li key={bank.slug}>
                          <a
                            href={bank.website}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="underline underline-offset-2"
                          >
                            {bank.name}: web oficial <ExternalLink className="inline h-3 w-3" />
                          </a>
                          {bank.appStoreUrl ? (
                            <>
                              {" · "}
                              <a
                                href={bank.appStoreUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="underline underline-offset-2"
                              >
                                App Store
                              </a>
                            </>
                          ) : null}
                          {bank.googlePlayUrl ? (
                            <>
                              {" · "}
                              <a
                                href={bank.googlePlayUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="underline underline-offset-2"
                              >
                                Google Play
                              </a>
                            </>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="#comparativa">🏆 Ver ranking TOP 3</Link>
              </Button>

              <Button asChild size="sm" variant="outline" className="rounded-full">
                <Link href="/bancos">Ver todos los bancos</Link>
              </Button>

              <div className="flex items-center gap-2 rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-4 py-2 text-xs font-semibold text-secondary-foreground/80">
                <Heart className="h-4 w-4 text-accent" />
                <span>Favoritos</span>
                <span className="rounded-full border-2 border-secondary bg-accent px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
                  {favoritesCount}
                </span>
              </div>
            </div>
          </div>

          {/* Trofeos a la derecha (desktop) */}
          <div className="hidden min-w-[90px] flex-col items-center gap-2 sm:flex">
            <Trophy className="h-10 w-10 text-accent drop-shadow" />
            <div className="flex flex-col items-center gap-1 text-[11px] text-secondary-foreground/80">
              <span>TOP 1-2-3</span>
              <span className="rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-2 py-0.5">
                Auto-ordenados
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* QUIZ GUIADO */}
      <section className="mt-2 md:mt-4">
        <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Asistente rápido
              </p>
              <h2 className="text-sm font-black tracking-tight text-foreground">
                Encuentra tu banco ideal en 3 clics
              </h2>
            </div>
            {quizMode === "done" && (
              <span className="rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
                Filtros aplicados ✅
              </span>
            )}
          </div>

          <div className="grid gap-3 text-xs sm:text-sm md:grid-cols-3">
            {/* Paso 1 */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase text-muted-foreground">
                1 · ¿Para qué lo quieres?
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleQuizApply({
                      type: "neobanco",
                      tag: "sin-comisiones",
                    })
                  }
                  className="rounded-full border-2 border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-secondary/35 hover:bg-muted"
                >
                  💰 Cobrar nómina
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuizApply({
                      type: "cuenta-multidivisa",
                      tag: "multidivisa",
                    })
                  }
                  className="rounded-full border-2 border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-secondary/35 hover:bg-muted"
                >
                  🌍 Viajar / varias divisas
                </button>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase text-muted-foreground">
                2 · Prioridad principal
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleQuizApply({
                      tag: "sin-comisiones",
                      sortKey: "monthlyFee",
                    })
                  }
                  className="rounded-full border-2 border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-secondary/35 hover:bg-muted"
                >
                  💸 Cero comisiones
                </button>
                <button
                  type="button"
                  onClick={() => handleQuizApply({ tag: "espanol" })}
                  className="rounded-full border-2 border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-secondary/35 hover:bg-muted"
                >
                  🇪🇸 App en español
                </button>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase text-muted-foreground">
                3 · Tu situación
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuizApply({ tag: "no-residentes" })}
                  className="rounded-full border-2 border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-secondary/35 hover:bg-muted"
                >
                  ✈️ Vivo fuera de España
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuizApply({
                      type: "fintech",
                      tag: "para-freelancers",
                    })
                  }
                  className="rounded-full border-2 border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-secondary/35 hover:bg-muted"
                >
                  🧑‍💻 Freelance / SL
                </button>
              </div>
            </div>
          </div>

          {quizMode === "done" && (
            <p className="mt-3 text-[11px] text-muted-foreground">
              Ya he ajustado el ranking según tus respuestas. Puedes seguir
              afinando con los filtros de abajo.
            </p>
          )}
        </div>
      </section>

      {/* FILTROS + ACCIONES */}
      <section id="comparativa">
        <Card className="space-y-4 p-4 sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Buscador */}
            <div className="group relative">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="🔍 Busca por nombre, ventaja o país..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 rounded-xl pl-10 pr-9"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Select tipo banco */}
            <Select
              value={filterType}
              onValueChange={(v) => setFilterType(v as FilterType)}
            >
              <SelectTrigger
                className=""
                data-radix-select-trigger
              >
                <SelectValue placeholder="Tipo de banco" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem value="all">🏦 Todos los bancos</SelectItem>
                <SelectItem value="neobanco">⚡ Neobancos</SelectItem>
                <SelectItem value="tradicional">
                  🏛️ Banco tradicional
                </SelectItem>
                <SelectItem value="cuenta-multidivisa">
                  🌍 Cuenta multidivisa
                </SelectItem>
                <SelectItem value="fintech">💳 Fintech</SelectItem>
              </SelectContent>
            </Select>

            {/* Select tags */}
            <Select
              value={filterTag}
              onValueChange={(v) => setFilterTag(v as FilterTag)}
            >
              <SelectTrigger
                className=""
                data-radix-select-trigger
              >
                <SelectValue placeholder="Ventaja clave" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem value="all">✨ Todas las ventajas</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag === "sin-comisiones" && "💸 "}
                    {tag === "multidivisa" && "🌍 "}
                    {tag === "para-freelancers" && "🧑‍💻 "}
                    {tag === "para-empresa" && "🏢 "}
                    {tag === "crypto" && "₿ "}
                    {tagLabels[tag] || tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtros rápidos con emojis y botones grandes */}
          <div className="flex flex-wrap gap-2 pt-1">
            {quickFilters.map((f) => {
              const isActive =
                (f.tag && filterTag === f.tag) ||
                (f.type && filterType === f.type);
              return (
                <Button
                  key={f.label}
                  type="button"
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  onClick={() => {
                    if (f.tag) setFilterTag(f.tag);
                    if (f.type) setFilterType(f.type);
                  }}
                  className="flex items-center gap-2 rounded-full px-3 text-xs shadow-none hover:translate-x-0 hover:translate-y-0 sm:text-sm"
                >
                  <span>{f.emoji}</span>
                  <span>{f.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Acciones */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <span className="text-muted-foreground">
              {filteredAndSorted.length} de {banks.length} bancos
            </span>

            {compareIds.length > 0 && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowCompare(!showCompare)}
                className="gap-2 rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
              >
                <Eye className="h-4 w-4" />
                Comparar {compareIds.length}/2
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={exportToPDF}
              className="ml-auto gap-2 rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </Card>
      </section>

      {/* COMPARADOR RÁPIDO */}
      <AnimatePresence>
        {showCompare && compareBanks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="rounded-2xl border-2 border-secondary bg-secondary p-6 text-secondary-foreground shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-black tracking-tight text-accent sm:text-lg">
                  Comparación directa
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCompareIds([])}
                  className="rounded-full text-secondary-foreground/70 hover:bg-secondary-foreground/5 hover:text-secondary-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {compareBanks.map((bank) => (
                  <div
                    key={bank.slug}
                    className="space-y-3 rounded-2xl border-2 border-secondary-foreground/10 bg-secondary-foreground/5 p-4 text-secondary-foreground"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={bank.logo}
                        alt={bank.name}
                        width={40}
                        height={40}
                        className="rounded-lg"
                      />
                      <div>
                        <p className="font-bold">{bank.name}</p>
                        <p className="text-xs text-secondary-foreground/70">
                          {bank.tagline}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div>
                        <strong>Cuota:</strong>{" "}
                        {bank.fees?.monthly || "—"}
                      </div>
                      <div>
                        <strong>Tarjeta:</strong>{" "}
                        {bank.cardType || "—"}
                      </div>
                      <div>
                        <strong>IBAN:</strong>{" "}
                        {bank.ibanCountry || bank.country}
                      </div>
                      <div>
                        <strong>App ES:</strong>{" "}
                        {bank.tags.includes("espanol") ? "Sí" : "No"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VISTA MOBILE: TARJETAS ESTILO APPLE CARD */}
      <div className="space-y-4 md:hidden">
        <AnimatePresence initial={false}>
          {filteredAndSorted.length === 0 && (
            <Card className="flex flex-col items-center gap-2 py-10 text-sm text-muted-foreground">
              <X className="h-6 w-6" />
              <span>
                No hemos encontrado bancos con esos filtros. Prueba a
                quitar alguno.
              </span>
            </Card>
          )}

          {filteredAndSorted.map((bank, i) => {
            const rank = i + 1;
            const isTop3 = rank <= 3;

            return (
              <motion.div
                key={bank.slug}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{
                  delay: i * 0.02,
                  type: "spring",
                  stiffness: 220,
                  damping: 22,
                }}
                className="relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-6 text-secondary-foreground shadow-soft transition-shadow will-change-transform hover:shadow-offset-accent"
              >
                {isTop3 ? (
                  <div className="absolute right-4 top-4">
                    <span className="inline-flex items-center gap-2 rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
                      <Trophy className="h-3.5 w-3.5" />
                      TOP {rank}
                    </span>
                  </div>
                ) : null}

                {/* HEADER CARD */}
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 rounded-2xl border-2 border-secondary-foreground/10 bg-secondary-foreground/5 p-1.5">
                    <Image
                      src={bank.logo}
                      alt={bank.name}
                      fill
                      className="rounded-xl object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        {bank.name}
                      </span>
                      {bank.affiliateUrl && (
                        <Badge variant="secondary" className="flex items-center gap-1 px-2.5 py-1 text-[10px]">
                          <Star className="h-3 w-3" />
                          Recomendado
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-secondary-foreground/70">
                      {bank.tagline}
                    </p>
                  </div>
                </div>

                {/* INFO PRINCIPAL */}
                <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-foreground/60">
                      País / IBAN
                    </p>
                    <p className="text-xs font-semibold">
                      {bank.country}
                      {bank.ibanCountry && (
                        <span className="ml-1 text-[11px] text-secondary-foreground/60">
                          · IBAN {bank.ibanCountry}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-foreground/60">
                      Cuota mensual
                    </p>
                    {isFreeFee(bank.fees?.monthly) ? (
                      <span className="inline-flex items-center gap-1 rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-2.5 py-1 text-[11px] font-semibold text-primary">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Gratis
                      </span>
                    ) : bank.fees?.monthly ? (
                      <span className="text-[13px] font-semibold text-accent">
                        {bank.fees.monthly}
                      </span>
                    ) : (
                      <X className="h-4 w-4 text-secondary-foreground/40" />
                    )}
                  </div>
                </div>

                {/* TAGS / TARJETA */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {bank.cardType
                    ?.toLowerCase()
                    .includes("física") && (
                    <span className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-2.5 py-1 text-[10px] font-semibold text-secondary-foreground/80">
                      Física
                    </span>
                  )}
                  {bank.cardType
                    ?.toLowerCase()
                    .includes("virtual") && (
                    <span className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-2.5 py-1 text-[10px] font-semibold text-secondary-foreground/80">
                      Virtual
                    </span>
                  )}

                  {bank.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-2.5 py-1 text-[10px] font-semibold text-secondary-foreground/80"
                    >
                      {tagLabels[tag] || tag}
                    </span>
                  ))}
                  {bank.tags.length > 2 && (
                    <span className="text-[10px] font-semibold text-secondary-foreground/60">
                      +{bank.tags.length - 2}
                    </span>
                  )}
                </div>

                {/* ACCIONES */}
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    asChild
                    size="sm"
                    className="h-9 flex-1 rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
                  >
                    <Link href={`/programas/${bank.slug}`}>Ver detalles</Link>
                  </Button>

                  {bank.affiliateUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-9 flex-1 rounded-full border-secondary-foreground/15 text-secondary-foreground shadow-none hover:translate-x-0 hover:translate-y-0 hover:border-secondary-foreground/25 hover:bg-secondary-foreground/5"
                    >
                      <a
                        href={bank.affiliateUrl}
                        data-analytics="affiliate"
                        data-affiliate-partner={bank.slug}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Abrir cuenta
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleFavorite(bank)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 text-secondary-foreground/70 transition-colors hover:border-secondary-foreground/20 hover:text-destructive"
                    aria-label={
                      isFavorite(bank.slug)
                        ? "Quitar de favoritos"
                        : "Añadir a favoritos"
                    }
                  >
                    <Heart
                      className={`h-4 w-4 transition-all ${
                        isFavorite(bank.slug)
                          ? "scale-110 fill-destructive text-destructive"
                          : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Comparar toggle */}
                <div className="mt-2 flex items-center justify-between text-[11px] text-secondary-foreground/70">
                  <button
                    type="button"
                    onClick={() => toggleCompare(bank.slug)}
                    disabled={
                      compareIds.length >= 2 &&
                      !compareIds.includes(bank.slug)
                    }
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium transition ${
                      compareIds.includes(bank.slug)
                        ? "border-2 border-secondary bg-primary/15 px-3 text-primary"
                        : "border-2 border-transparent text-secondary-foreground/70 hover:bg-secondary-foreground/5 hover:text-secondary-foreground"
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    {compareIds.includes(bank.slug)
                      ? "En comparación"
                      : "Comparar"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* TABLA PRINCIPAL (SOLO DESKTOP) */}
      <Card className="hidden overflow-hidden md:block">
        <div ref={tableRef} className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="sticky top-0 z-10 bg-muted text-muted-foreground">
              <tr>
                <Th
                  onClick={() => handleSort("name")}
                  sortable
                  className="w-64"
                >
                  Banco
                  {sortKey === "name" && (
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  )}
                </Th>
                <Th>Tipo</Th>
                <Th>País / IBAN</Th>
                <Th
                  onClick={() => handleSort("monthlyFee")}
                  sortable
                >
                  Cuota
                  {sortKey === "monthlyFee" && (
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  )}
                </Th>
                <Th>Tarjeta</Th>
                <Th className="hidden xl:table-cell">Ventajas</Th>
                <Th className="w-40">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filteredAndSorted.length === 0 && (
                  <tr>
                    <Td colSpan={7} className="text-center text-sm">
                      <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
                        <X className="h-6 w-6" />
                        <span>
                          No hemos encontrado bancos con esos filtros.
                          Prueba a quitar alguno.
                        </span>
                      </div>
                    </Td>
                  </tr>
                )}
                {filteredAndSorted.map((bank, i) => {
                  const rank = i + 1;
                  const isTop3 = rank <= 3;

                  return (
                    <motion.tr
                      key={bank.slug}
                      layout
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -18 }}
                      transition={{
                        delay: i * 0.015,
                        type: "spring",
                        stiffness: 230,
                        damping: 24,
                      }}
                      className="border-b border-border bg-card text-foreground transition-colors hover:bg-muted/40"
                    >
                      <Td>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-xl border-2 border-border bg-muted/40 p-1.5">
                            <Image
                              src={bank.logo}
                              alt={bank.name}
                              fill
                              className="rounded-lg object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">
                                {bank.name}
                              </span>

                              {bank._status === "draft" ? (
                                <Badge
                                  variant="outline"
                                  className="px-2.5 py-1 text-[10px]"
                                >
                                  En revisión
                                </Badge>
                              ) : null}

                              {/* Badge recomendado */}
                              {bank.affiliateUrl && (
                                <Badge variant="secondary" className="flex items-center gap-1 px-2.5 py-1 text-[10px]">
                                  <Star className="h-3 w-3" />
                                  Recomendado
                                </Badge>
                              )}

                              {/* TOP 1-2-3 */}
                              {isTop3 && (
                                <span className="flex items-center gap-1 rounded-full border-2 border-border bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground">
                                  <Trophy className="h-3 w-3" />
                                  TOP {rank}
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() => toggleFavorite(bank)}
                                className="ml-auto text-muted-foreground hover:text-destructive"
                                aria-label={
                                  isFavorite(bank.slug)
                                    ? "Quitar de favoritos"
                                    : "Añadir a favoritos"
                                }
                              >
                                <Heart
                                  className={`h-4 w-4 transition-all ${
                                    isFavorite(bank.slug)
                                      ? "scale-110 fill-destructive text-destructive"
                                      : ""
                                  }`}
                                />
                              </button>
                            </div>
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                              {bank.tagline}
                            </p>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <span className="inline-flex items-center rounded-full border-2 border-border bg-muted px-3 py-1 text-[11px] font-semibold text-foreground">
                          {categoryLabels[bank.category]}
                        </span>
                      </Td>
                      <Td>
                        <div className="space-y-0.5">
                          <span className="font-medium">
                            {bank.country}
                          </span>
                          {bank.ibanCountry && (
                            <p className="text-xs text-muted-foreground">
                              IBAN {bank.ibanCountry}
                            </p>
                          )}
                        </div>
                      </Td>
                      <Td className="font-bold">
                        {isFreeFee(bank.fees?.monthly) ? (
                          <span className="inline-flex items-center gap-1 rounded-full border-2 border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                            <CheckCircle className="h-4 w-4" />
                            Gratis
                          </span>
                        ) : bank.fees?.monthly ? (
                          <span className="text-foreground">
                            {bank.fees.monthly}
                          </span>
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Td>
                      <Td>
                        <div className="flex flex-wrap gap-1.5">
                          {bank.cardType
                            ?.toLowerCase()
                            .includes("física") && (
                            <span className="inline-flex items-center rounded-full border-2 border-border bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                              Física
                            </span>
                          )}
                          {bank.cardType
                            ?.toLowerCase()
                            .includes("virtual") && (
                            <span className="inline-flex items-center rounded-full border-2 border-border bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                              Virtual
                            </span>
                          )}
                        </div>
                      </Td>
                      <Td className="hidden xl:table-cell">
                        <div className="flex flex-wrap gap-1.5">
                          {bank.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="rounded-full border-2 border-border bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground"
                            >
                              {tagLabels[tag] || tag}
                            </Badge>
                          ))}
                          {bank.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{bank.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </Td>
                      <Td>
                        <div className="flex flex-col gap-1.5">
                          <Button
                            asChild
                            size="sm"
                            className="w-full rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
                          >
                            <Link href={`/programas/${bank.slug}`}>
                              Ver detalles
                            </Link>
                          </Button>

                          {bank.affiliateUrl && (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-full rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
                            >
                              <a
                                href={bank.affiliateUrl}
                                data-analytics="affiliate"
                                data-affiliate-partner={bank.slug}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Abrir cuenta
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant={compareIds.includes(bank.slug) ? "default" : "outline"}
                            onClick={() => toggleCompare(bank.slug)}
                            className="w-full rounded-full text-[11px] shadow-none hover:translate-x-0 hover:translate-y-0"
                            disabled={
                              compareIds.length >= 2 &&
                              !compareIds.includes(bank.slug)
                            }
                          >
                            {compareIds.includes(bank.slug)
                              ? "En comparación"
                              : "Comparar"}
                          </Button>
                        </div>
                      </Td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      {/* CTA FINAL */}
      <Card className="relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-8 text-center text-secondary-foreground shadow-offset-accent sm:p-10">
        <div className="pointer-events-none absolute -top-28 -right-28 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative space-y-4">
          <h3 className="text-balance text-2xl font-black tracking-tight text-accent sm:text-3xl">
            ¿Listo para elegir tu banco ganador?
          </h3>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-secondary-foreground/80 sm:text-base">
            Revisa las fichas detalladas y abre tu cuenta online en{" "}
            <strong className="font-semibold text-secondary-foreground">
              menos de 10 minutos
            </strong>
            , sin papeleo ni colas.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="gap-2 rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
            >
              <Link href="/bancos">Ver todos los bancos</Link>
            </Button>

            <Button
              type="button"
              size="lg"
              variant="outline"
              disabled={favoritesCount === 0}
              onClick={() => {
                setFavoritesOnly((prev) => !prev);
                document
                  .getElementById("comparativa")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`gap-2 rounded-full border-secondary-foreground/20 text-secondary-foreground shadow-none hover:translate-x-0 hover:translate-y-0 hover:border-secondary-foreground/35 hover:bg-secondary-foreground/5 ${
                favoritesOnly ? "border-accent text-accent" : ""
              }`}
            >
              <Heart
                className={`h-5 w-5 ${
                  favoritesOnly
                    ? "fill-destructive text-destructive"
                    : "text-secondary-foreground/80"
                }`}
              />
              {favoritesOnly ? "Favoritos" : "Mis favoritos"} ({favoritesCount})
            </Button>
          </div>
        </div>
      </Card>

      {/* BARRA STICKY DE COMPARACIÓN */}
      <AnimatePresence>
        {compareBanks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-4 left-1/2 z-40 w-[95%] max-w-2xl -translate-x-1/2 rounded-2xl border-2 border-secondary bg-secondary px-4 py-3 text-secondary-foreground shadow-offset-accent"
          >
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-accent-foreground md:inline">
                Comparando
              </span>

              <div className="flex flex-1 flex-wrap items-center gap-2 text-xs sm:text-sm">
                {compareBanks.map((bank) => (
                  <div
                    key={bank.slug}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-3 py-1 text-xs font-semibold text-secondary-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="max-w-[120px] truncate">
                      {bank.name}
                    </span>
                  </div>
                ))}

                {compareBanks.length < 2 && (
                  <span className="text-[11px] text-secondary-foreground/70">
                    Elige otro banco para una comparación 1 a 1.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-full border-secondary-foreground/20 text-[11px] text-secondary-foreground shadow-none hover:translate-x-0 hover:translate-y-0 hover:border-secondary-foreground/35 hover:bg-secondary-foreground/5"
                  onClick={() => setCompareIds([])}
                  aria-label="Limpiar bancos en comparación"
                >
                  Limpiar
                </Button>

                <Button
                  size="sm"
                  className="h-8 rounded-full text-[11px] shadow-none hover:translate-x-0 hover:translate-y-0"
                  onClick={() => setShowCompare(true)}
                  disabled={compareBanks.length < 2}
                >
                  Ver comparación
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </Container>
    </main>
  );
}

// === COMPONENTES DE TABLA / AUX ===
function Th({
  children,
  onClick,
  sortable = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  sortable?: boolean;
  className?: string;
}) {
  return (
    <th
      className={`
        px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide
        ${
          sortable
            ? "cursor-pointer select-none transition-colors hover:bg-muted"
            : ""
        }
        ${className}
      `}
      onClick={sortable ? onClick : undefined}
      tabIndex={sortable ? 0 : undefined}
      onKeyDown={(e) =>
        sortable &&
        (e.key === "Enter" || e.key === " ") &&
        onClick?.()
      }
    >
      <div className="flex items-center gap-1.5">{children}</div>
    </th>
  );
}

function Td({
  children,
  className = "",
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td
      className={`px-5 py-4 align-top text-xs text-foreground md:text-sm ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}
