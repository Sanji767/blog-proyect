// src/app/comparativa/page.tsx
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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

const tagColors: Record<string, string> = {
  "sin-comisiones":
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
  "tarjeta-fisica":
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
  "tarjeta-virtual":
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100",
  multidivisa:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  crypto:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  "para-freelancers":
    "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
  "para-empresa":
    "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
  "no-residentes":
    "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100",
  espanol:
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
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
      return matchesSearch && matchesType && matchesTag;
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
  }, [search, filterType, filterTag, sortKey, sortOrder]);

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
    <main className="container mx-auto max-w-7xl space-y-10 px-4 py-8 text-slate-900 dark:text-slate-50">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-xl sm:p-8 dark:border-slate-800 dark:bg-slate-950/80"
      >
        {/* Degradado animado */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-70 blur-3xl"
          style={{
            backgroundImage:
              "linear-gradient(120deg, #00C9A7, #00B4D8, #4ADE80)",
            backgroundSize: "220% 220%",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 shadow dark:bg-slate-900/80 dark:text-slate-100">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>Ranking TOP bancario Europa</span>
              <span className="rounded-full bg-[#E6F9F0] px-2 py-0.5 text-[10px] font-semibold text-[#027A48]">
                Metodología clara
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Star className="h-7 w-7 text-amber-400" />
              <h1 className="bg-gradient-to-r from-[#00C9A7] via-[#00B4D8] to-[#4ADE80] bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
                Comparativa de bancos en Europa
              </h1>
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-200">
              Encuentra tu banco ideal en{" "}
              <strong className="text-slate-900 dark:text-white">
                menos de 60 segundos
              </strong>
              . Filtra, ordena, compara y guarda favoritos con criterios claros
              y enlaces oficiales.
            </p>

            <div className="mt-4 grid gap-3 sm:max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 dark:text-slate-100">
                {lastUpdatedLabel ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 shadow-sm dark:bg-slate-900/80">
                    <Info className="h-4 w-4" />
                    Actualizado:{" "}
                    <strong className="font-semibold">{lastUpdatedLabel}</strong>
                  </span>
                ) : null}

                <Link
                  href="/aviso-afiliados"
                  className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 shadow-sm underline underline-offset-2 dark:bg-slate-900/80"
                >
                  Aviso de afiliados
                </Link>
              </div>

              <details className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-xs text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100">
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
              {/* Botón principal con degradado verde-turquesa */}
              <Link href="#comparativa">
                <Button
                  size="lg"
                  className="gap-2 rounded-full bg-gradient-to-r from-[#00C9A7] to-[#00B4D8] px-6 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-transform hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"
                >
                  🏆 Ver ranking TOP 3
                </Button>
              </Link>

              <Link href="/bancos">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-slate-200 bg-white text-xs text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 sm:text-sm"
                >
                  Ver todos los bancos
                </Button>
              </Link>

              <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm dark:bg-slate-900/90 dark:text-slate-100">
                <Heart className="h-4 w-4 text-rose-500" />
                <span>Favoritos</span>
                <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-300">
                  {favoritesCount}
                </span>
              </div>
            </div>
          </div>

          {/* Trofeos a la derecha (desktop) */}
          <div className="hidden min-w-[90px] flex-col items-center gap-2 sm:flex">
            <Trophy className="h-10 w-10 text-amber-400 drop-shadow" />
            <div className="flex flex-col items-center gap-1 text-[11px] text-slate-700 dark:text-slate-200">
              <span>TOP 1-2-3</span>
              <span className="rounded-full bg-white/80 px-2 py-0.5 dark:bg-slate-900/80">
                Auto-ordenados
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* QUIZ GUIADO */}
      <section className="mt-2 md:mt-4">
        <div className="rounded-3xl border border-slate-100 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/90">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Asistente rápido
              </p>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                Encuentra tu banco ideal en 3 clics
              </h2>
            </div>
            {quizMode === "done" && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                Filtros aplicados ✅
              </span>
            )}
          </div>

          <div className="grid gap-3 text-xs sm:text-sm md:grid-cols-3">
            {/* Paso 1 */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase text-slate-500 dark:text-slate-300">
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
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:border-[#00C9A7]/40 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-500/50"
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
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:border-[#00C9A7]/40 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-500/50"
                >
                  🌍 Viajar / varias divisas
                </button>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase text-slate-500 dark:text-slate-300">
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
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:border-[#00C9A7]/40 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-500/50"
                >
                  💸 Cero comisiones
                </button>
                <button
                  type="button"
                  onClick={() => handleQuizApply({ tag: "espanol" })}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:border-[#00C9A7]/40 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-500/50"
                >
                  🇪🇸 App en español
                </button>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase text-slate-500 dark:text-slate-300">
                3 · Tu situación
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuizApply({ tag: "no-residentes" })}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:border-[#00C9A7]/40 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-500/50"
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
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:border-[#00C9A7]/40 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-500/50"
                >
                  🧑‍💻 Freelance / SL
                </button>
              </div>
            </div>
          </div>

          {quizMode === "done" && (
            <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-300">
              Ya he ajustado el ranking según tus respuestas. Puedes seguir
              afinando con los filtros de abajo.
            </p>
          )}
        </div>
      </section>

      {/* FILTROS + ACCIONES */}
      <section id="comparativa">
        <Card className="space-y-4 border-slate-100 bg-white/95 p-4 shadow-lg sm:p-6 dark:border-slate-800 dark:bg-slate-950/90">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Buscador */}
            <div className="group relative">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-[#00A76F]" />
              <Input
                placeholder="🔍 Busca por nombre, ventaja o país..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 rounded-full border-2 border-slate-100 bg-white pl-10 pr-9 text-sm text-slate-900 shadow-sm transition-all hover:border-[#00C9A7]/40 focus:border-[#00C9A7] focus:ring-[#00C9A7]/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-100"
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
                className="h-11 rounded-full border border-slate-100 bg-white text-sm text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                data-radix-select-trigger
              >
                <SelectValue placeholder="Tipo de banco" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border border-slate-100 bg-white/98 p-1 text-sm text-slate-800 shadow-xl dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100">
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
                className="h-11 rounded-full border border-slate-100 bg-white text-sm text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                data-radix-select-trigger
              >
                <SelectValue placeholder="Ventaja clave" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border border-slate-100 bg-white/98 p-1 text-sm text-slate-800 shadow-xl dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100">
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
                  className={`flex items-center gap-2 rounded-full px-3 text-xs sm:text-sm ${
                    isActive
                      ? "border-0 bg-gradient-to-r from-[#00C9A7] to-[#00B4D8] text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-800 hover:border-[#00C9A7]/40 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-500/50"
                  }`}
                >
                  <span>{f.emoji}</span>
                  <span>{f.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Acciones */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <span className="text-slate-500 dark:text-slate-300">
              {filteredAndSorted.length} de {banks.length} bancos
            </span>

            {compareIds.length > 0 && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowCompare(!showCompare)}
                className="gap-2 rounded-full border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <Eye className="h-4 w-4" />
                Comparar {compareIds.length}/2
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={exportToPDF}
              className="ml-auto gap-2 rounded-full border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
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
            <Card className="bg-gradient-to-r from-[#E6F9F0] to-[#E0F2FE] p-5 dark:from-emerald-900/20 dark:to-sky-900/20">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 sm:text-lg dark:text-slate-50">
                  Comparación directa
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCompareIds([])}
                  className="rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {compareBanks.map((bank) => (
                  <div
                    key={bank.slug}
                    className="space-y-3 rounded-2xl bg-white/90 p-4 text-slate-800 shadow-sm dark:bg-slate-950/80 dark:text-slate-50"
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
                        <p className="text-xs text-slate-500 dark:text-slate-300">
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
            <Card className="flex flex-col items-center gap-2 bg-white py-10 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-300">
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
                className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 text-slate-900 shadow-md transition-all will-change-transform hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
              >
                {/* RIBBON TOP */}
                {isTop3 && (
                  <div className="absolute -right-10 -top-10 h-20 w-20 rotate-45 bg-gradient-to-br from-[#D1FAE5] to-[#BBF7D0] shadow-lg" />
                )}
                {isTop3 && (
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#D1FAE5] px-3 py-1 text-[11px] font-semibold text-[#047857] shadow-lg">
                    <Trophy className="h-3.5 w-3.5" />
                    TOP {rank}
                  </div>
                )}

                {/* HEADER CARD */}
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 rounded-2xl bg-slate-50 p-1.5 shadow-inner dark:bg-slate-900">
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
                        <Badge className="flex items-center gap-1 rounded-full bg-[#FFE8A3] text-[10px] font-semibold text-[#3F2A00] shadow-sm">
                          <Star className="h-3 w-3 text-[#E09B00]" />
                          Recomendado
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-500 dark:text-slate-300">
                      {bank.tagline}
                    </p>
                  </div>
                </div>

                {/* INFO PRINCIPAL */}
                <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <p className="text-[11px] text-slate-500 dark:text-slate-300">
                      País / IBAN
                    </p>
                    <p className="text-xs font-semibold">
                      {bank.country}
                      {bank.ibanCountry && (
                        <span className="ml-1 text-[11px] text-slate-500 dark:text-slate-300">
                          · IBAN {bank.ibanCountry}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] text-slate-500 dark:text-slate-300">
                      Cuota mensual
                    </p>
                    {isFreeFee(bank.fees?.monthly) ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#A7F3D0] bg-[#E6F9F0] px-2 py-1 text-[11px] font-semibold text-[#027A48]">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Gratis
                      </span>
                    ) : bank.fees?.monthly ? (
                      <span className="text-[13px] font-semibold text-[#EA580C]">
                        {bank.fees.monthly}
                      </span>
                    ) : (
                      <X className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* TAGS / TARJETA */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {bank.cardType
                    ?.toLowerCase()
                    .includes("física") && (
                    <Badge
                      variant="outline"
                      className="rounded-full text-[10px] text-slate-700 dark:text-slate-100"
                    >
                      🪪 Física
                    </Badge>
                  )}
                  {bank.cardType
                    ?.toLowerCase()
                    .includes("virtual") && (
                    <Badge
                      variant="outline"
                      className="rounded-full text-[10px] text-slate-700 dark:text-slate-100"
                    >
                      📲 Virtual
                    </Badge>
                  )}

                  {bank.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={`rounded-full text-[10px] font-medium ${tagColors[tag] || ""}`}
                    >
                      {tagLabels[tag] || tag}
                    </Badge>
                  ))}
                  {bank.tags.length > 2 && (
                    <span className="text-[10px] text-slate-500 dark:text-slate-300">
                      +{bank.tags.length - 2}
                    </span>
                  )}
                </div>

                {/* ACCIONES */}
                <div className="mt-4 flex items-center gap-2">
                  <Link
                    href={`/programas/${bank.slug}`}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      className="h-9 w-full rounded-full bg-gradient-to-r from-[#00C9A7] to-[#00B4D8] text-[11px] font-semibold text-white shadow-md hover:brightness-110"
                    >
                      Ver detalles
                    </Button>
                  </Link>

                  {bank.affiliateUrl && (
                    <a
                      href={bank.affiliateUrl}
                      data-analytics="affiliate"
                      data-affiliate-partner={bank.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-full rounded-full border-slate-200 bg-white text-[11px] text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                      >
                        Abrir cuenta
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleFavorite(bank)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 shadow-sm transition-all hover:scale-110 hover:text-rose-500 dark:bg-slate-900 dark:text-slate-300"
                    aria-label={
                      isFavorite(bank.slug)
                        ? "Quitar de favoritos"
                        : "Añadir a favoritos"
                    }
                  >
                    <Heart
                      className={`h-4 w-4 transition-all ${
                        isFavorite(bank.slug)
                          ? "scale-110 fill-rose-500 text-rose-500"
                          : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Comparar toggle */}
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-300">
                  <button
                    type="button"
                    onClick={() => toggleCompare(bank.slug)}
                    disabled={
                      compareIds.length >= 2 &&
                      !compareIds.includes(bank.slug)
                    }
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium transition ${
                      compareIds.includes(bank.slug)
                        ? "bg-[#E0F2FE] text-[#0369A1] dark:bg-slate-800 dark:text-sky-300"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
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
      <Card className="hidden overflow-hidden border-slate-100 bg-white/95 shadow-2xl md:block dark:border-slate-800 dark:bg-slate-950/95">
        <div ref={tableRef} className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 dark:from-slate-900 dark:to-slate-900/80 dark:text-slate-200">
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
                      <div className="flex flex-col items-center gap-2 py-10 text-slate-500 dark:text-slate-300">
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
                      className="border-b border-slate-100 bg-white text-slate-900 transition-all will-change-transform hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-gradient-to-r hover:from-[#F0FDFA] hover:to-[#E0F2FE] hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:from-slate-900 dark:hover:to-slate-900"
                    >
                      <Td>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-xl bg-slate-50 p-1.5 shadow-inner dark:bg-slate-900">
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

                              {/* Badge recomendado */}
                              {bank.affiliateUrl && (
                                <Badge className="flex items-center gap-1 rounded-full bg-[#FFE8A3] text-[10px] font-semibold text-[#3F2A00] shadow-sm">
                                  <Star className="h-3 w-3 text-[#E09B00]" />
                                  Recomendado
                                </Badge>
                              )}

                              {/* TOP 1-2-3 */}
                              {isTop3 && (
                                <span className="flex items-center gap-1 rounded-full bg-[#D1FAE5] px-2 py-0.5 text-[10px] font-semibold text-[#047857]">
                                  <Trophy className="h-3 w-3" />
                                  TOP {rank}
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() => toggleFavorite(bank)}
                                className="ml-auto text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400"
                                aria-label={
                                  isFavorite(bank.slug)
                                    ? "Quitar de favoritos"
                                    : "Añadir a favoritos"
                                }
                              >
                                <Heart
                                  className={`h-4 w-4 transition-all ${
                                    isFavorite(bank.slug)
                                      ? "scale-110 fill-rose-500 text-rose-500"
                                      : ""
                                  }`}
                                />
                              </button>
                            </div>
                            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-300">
                              {bank.tagline}
                            </p>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <Badge
                          variant="secondary"
                          className="rounded-full bg-slate-100 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        >
                          {categoryLabels[bank.category]}
                        </Badge>
                      </Td>
                      <Td>
                        <div className="space-y-0.5">
                          <span className="font-medium">
                            {bank.country}
                          </span>
                          {bank.ibanCountry && (
                            <p className="text-xs text-slate-500 dark:text-slate-300">
                              IBAN {bank.ibanCountry}
                            </p>
                          )}
                        </div>
                      </Td>
                      <Td className="font-bold">
                        {isFreeFee(bank.fees?.monthly) ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#A7F3D0] bg-[#E6F9F0] px-2 py-1 text-xs font-semibold text-[#027A48]">
                            <CheckCircle className="h-4 w-4" />
                            Gratis
                          </span>
                        ) : bank.fees?.monthly ? (
                          <span className="text-[#EA580C]">
                            {bank.fees.monthly}
                          </span>
                        ) : (
                          <X className="h-4 w-4 text-slate-400" />
                        )}
                      </Td>
                      <Td>
                        <div className="flex flex-wrap gap-1.5">
                          {bank.cardType
                            ?.toLowerCase()
                            .includes("física") && (
                            <Badge
                              variant="outline"
                              className="rounded-full text-xs text-slate-700 dark:text-slate-100"
                            >
                              Física
                            </Badge>
                          )}
                          {bank.cardType
                            ?.toLowerCase()
                            .includes("virtual") && (
                            <Badge
                              variant="outline"
                              className="rounded-full text-xs text-slate-700 dark:text-slate-100"
                            >
                              Virtual
                            </Badge>
                          )}
                        </div>
                      </Td>
                      <Td className="hidden xl:table-cell">
                        <div className="flex flex-wrap gap-1.5">
                          {bank.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className={`rounded-full text-[10px] font-medium ${tagColors[tag] || ""}`}
                            >
                              {tagLabels[tag] || tag}
                            </Badge>
                          ))}
                          {bank.tags.length > 3 && (
                            <span className="text-xs text-slate-500 dark:text-slate-300">
                              +{bank.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </Td>
                      <Td>
                        <div className="flex flex-col gap-1.5">
                          <Link
                            href={`/programas/${bank.slug}`}
                            className="w-full"
                          >
                            <Button
                              size="sm"
                              className="w-full rounded-full bg-gradient-to-r from-[#00C9A7] to-[#00B4D8] text-[11px] font-semibold text-white shadow-md hover:brightness-110"
                            >
                              Ver detalles
                            </Button>
                          </Link>

                          {bank.affiliateUrl && (
                            <a
                              href={bank.affiliateUrl}
                              data-analytics="affiliate"
                              data-affiliate-partner={bank.slug}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full rounded-full border-slate-200 bg-white text-[11px] text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                              >
                                Abrir cuenta
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </Button>
                            </a>
                          )}

                          <Button
                            size="sm"
                            variant={
                              compareIds.includes(bank.slug)
                                ? "default"
                                : "ghost"
                            }
                            onClick={() => toggleCompare(bank.slug)}
                            className={`w-full rounded-full text-[11px] ${
                              compareIds.includes(bank.slug)
                                ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900"
                                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                            }`}
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
      <Card className="rounded-2xl bg-gradient-to-r from-[#00C9A7] to-[#00B4D8] p-1">
        <div className="space-y-4 rounded-2xl bg-white p-6 text-center text-slate-900 sm:p-8 dark:bg-slate-950 dark:text-slate-50">
          <h3 className="text-xl font-bold sm:text-2xl">
            ¿Listo para elegir tu banco ganador?
          </h3>
          <p className="text-sm text-slate-600 sm:text-base dark:text-slate-200">
            Revisa las fichas detalladas y abre tu cuenta online en{" "}
            <strong>menos de 10 minutos</strong>, sin papeleo ni colas.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/bancos">
              <Button
                size="lg"
                className="gap-2 rounded-full bg-gradient-to-r from-[#00C9A7] to-[#00B4D8] text-sm font-semibold text-white shadow-lg hover:brightness-110 md:text-base"
              >
                Ver todos los bancos
              </Button>
            </Link>
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 rounded-full border-slate-200 bg-slate-50 text-sm text-slate-800 hover:bg-slate-100 md:text-base dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <Heart className="h-5 w-5 text-rose-500" />
              Mis favoritos ({favoritesCount})
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
            className="fixed bottom-4 left-1/2 z-40 w-[95%] max-w-2xl -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-slate-800 shadow-xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-950/95 dark:text-slate-100"
          >
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white md:inline dark:bg-slate-100 dark:text-slate-900">
                Comparando
              </span>

              <div className="flex flex-1 flex-wrap items-center gap-2 text-xs sm:text-sm">
                {compareBanks.map((bank) => (
                  <div
                    key={bank.slug}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="max-w-[120px] truncate">
                      {bank.name}
                    </span>
                  </div>
                ))}

                {compareBanks.length < 2 && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-300">
                    Elige otro banco para una comparación 1 a 1.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-full border-slate-200 text-[11px] text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setCompareIds([])}
                >
                  Limpiar
                </Button>

                <Button
                  size="sm"
                  className="h-8 rounded-full bg-gradient-to-r from-[#00C9A7] to-[#00B4D8] text-[11px] font-semibold text-white shadow-md hover:brightness-110"
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
            ? "cursor-pointer select-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
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
      className={`px-5 py-4 align-top text-xs text-slate-800 md:text-sm dark:text-slate-100 ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}
