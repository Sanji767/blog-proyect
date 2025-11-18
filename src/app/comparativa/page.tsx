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
  ExternalLink,
  X,
  Heart,
  Download,
  XCircle,
  CheckCircle,
  Trash2,
  Eye,
  Star,
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
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  "tarjeta-fisica":
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  "tarjeta-virtual":
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  multidivisa:
    "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  crypto:
    "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  "para-freelancers":
    "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  "para-empresa":
    "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  "no-residentes":
    "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  espanol: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
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

  const tableRef = useRef<HTMLDivElement | null>(null);

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
    // 🔧 aquí estaba el problema: antes era `let filtered`
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

  return (
    <main className="container mx-auto max-w-7xl space-y-12 px-4 py-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-5 text-center"
      >
        <div className="flex items-center justify-center gap-2">
          <Star className="h-8 w-8 text-yellow-500" />
          <h1 className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-5xl font-black tracking-tighter text-transparent md:text-6xl">
            Comparativa Épica de Bancos
          </h1>
          <Star className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="mx-auto max-w-4xl text-lg leading-relaxed text-muted-foreground">
          Encuentra tu banco ideal en{" "}
          <strong className="text-foreground">
            menos de 60 segundos
          </strong>
          . Filtra, ordena, compara y guarda favoritos.
          <span className="mt-2 block font-semibold text-primary">
            +10.000 usuarios ya eligieron su cuenta perfecta
          </span>
        </p>
      </motion.section>

      {/* Filtros + Acciones */}
      <Card className="p-5 shadow-lg md:p-7">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="group relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Busca por nombre, ventaja o país..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 border-2 pl-10 pr-10 text-base transition-all focus:border-primary"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>

          <Select
            value={filterType}
            onValueChange={(v) => setFilterType(v as FilterType)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Tipo de banco" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="neobanco">Neobanco</SelectItem>
              <SelectItem value="tradicional">
                Banco tradicional
              </SelectItem>
              <SelectItem value="cuenta-multidivisa">
                Multidivisa
              </SelectItem>
              <SelectItem value="fintech">Fintech</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterTag}
            onValueChange={(v) => setFilterTag(v as FilterTag)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Ventaja clave" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ventajas</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tagLabels[tag] || tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {filteredAndSorted.length} de {banks.length} bancos
          </span>
          {compareIds.length > 0 && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowCompare(!showCompare)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Comparar {compareIds.length}/2
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={exportToPDF}
            className="ml-auto gap-2"
          >
            <Download className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </Card>

      {/* Comparador Rápido */}
      <AnimatePresence>
        {showCompare && compareBanks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">
                  Comparación directa
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCompareIds([])}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {compareBanks.map((bank) => (
                  <div
                    key={bank.slug}
                    className="space-y-3 rounded-xl bg-background/50 p-4"
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
                        <p className="text-xs text-muted-foreground">
                          {bank.tagline}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
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
                        {bank.tags.includes("espanol")
                          ? "Sí"
                          : "No"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabla principal */}
      <Card className="overflow-hidden shadow-2xl">
        <div ref={tableRef} className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-muted/80 to-muted/50">
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
                <Th className="w-32">Acciones</Th>
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
                {filteredAndSorted.map((bank, i) => (
                  <motion.tr
                    key={bank.slug}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      delay: i * 0.03,
                      type: "spring",
                      stiffness: 300,
                    }}
                    className="border-b transition-all hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5"
                  >
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-1.5 shadow-inner">
                          <Image
                            src={bank.logo}
                            alt={bank.name}
                            fill
                            className="rounded-lg object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">
                              {bank.name}
                            </span>
                            {bank.affiliateUrl && (
                              <Badge className="h-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-[10px] text-white">
                                Recomendado
                              </Badge>
                            )}
                            <button
                              type="button"
                              onClick={() => toggleFavorite(bank)}
                              className="ml-auto"
                              aria-label={
                                isFavorite(bank.slug)
                                  ? "Quitar de favoritos"
                                  : "Añadir a favoritos"
                              }
                            >
                              <Heart
                                className={`h-4 w-4 transition-all ${
                                  isFavorite(bank.slug)
                                    ? "scale-110 fill-red-500 text-red-500"
                                    : "text-muted-foreground hover:text-red-500"
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
                      <Badge
                        variant="secondary"
                        className="font-medium"
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
                          <p className="text-xs text-muted-foreground">
                            IBAN {bank.ibanCountry}
                          </p>
                        )}
                      </div>
                    </Td>
                    <Td className="font-bold">
                      {isFreeFee(bank.fees?.monthly) ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle className="h-4 w-4" />
                          Gratis
                        </span>
                      ) : bank.fees?.monthly ? (
                        <span className="text-orange-600">
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
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            Física
                          </Badge>
                        )}
                        {bank.cardType
                          ?.toLowerCase()
                          .includes("virtual") && (
                          <Badge
                            variant="outline"
                            className="text-xs"
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
                            className={`text-[10px] font-medium ${
                              tagColors[tag] || ""
                            }`}
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
                        <Link
                          href={`/programas/${bank.slug}`}
                          className="w-full"
                        >
                          <Button
                            size="sm"
                            className="w-full text-[11px]"
                          >
                            Ver detalles
                          </Button>
                        </Link>

                        {bank.affiliateUrl && (
                          <a
                            href={bank.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-[11px]"
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
                          className="w-full text-[11px]"
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
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      {/* CTA FINAL */}
      <Card className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-1">
        <div className="space-y-4 rounded-2xl bg-background p-8 text-center">
          <h3 className="text-2xl font-bold">
            ¿Listo para elegir tu banco ganador?
          </h3>
          <p className="text-sm text-muted-foreground md:text-base">
            Revisa las fichas detalladas y abre tu cuenta online en{" "}
            <strong>menos de 10 minutos</strong>, sin papeleo ni colas.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/bancos">
              <Button size="lg" className="gap-2 text-sm md:text-base">
                Ver todos los bancos
              </Button>
            </Link>
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 text-sm md:text-base"
            >
              <Heart className="h-5 w-5" />
              Mis favoritos ({favorites.length})
            </Button>
          </div>
        </div>
      </Card>
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
        px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-foreground/80
        ${
          sortable
            ? "cursor-pointer select-none transition-colors hover:bg-muted/70"
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
      className={`px-5 py-4 align-top text-xs md:text-sm ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}
