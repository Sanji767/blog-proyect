// src/app/comparativa/page.tsx
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { banks, type Bank } from "@/lib/banks";
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
  Search, ArrowUpDown, ExternalLink, Check, X, Heart, Download,
  XCircle, CheckCircle, Star, Trash2, Eye
} from "lucide-react";

// === TIPOS ===
// Tipo de categoría del banco
type BankCategory = "neobanco" | "tradicional" | "cuenta-multidivisa";
// Tipo de tag del banco
type BankTag = Bank["tags"][number];
// Tipo para filtros
type FilterType = "all" | BankCategory;
type FilterTag = "all" | BankTag;

// === HOOK useLocalStorage (sin react-use) ===
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
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
      const valueToStore = value instanceof Function ? value(storedValue) : value;
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
const tagLabels = {
  "sin-comisiones": "Sin comisiones",
  "tarjeta-fisica": "Tarjeta física",
  "tarjeta-virtual": "Tarjeta virtual",
  multidivisa: "Multidivisa",
  crypto: "Cripto",
  "para-freelancers": "Para freelancers",
  "para-empresa": "Para empresa",
  "no-residentes": "Acepta no residentes",
  espanol: "Español",
} as const;

const categoryLabels = {
  neobanco: "Neobanco",
  tradicional: "Banco tradicional",
  "cuenta-multidivisa": "Cuenta multidivisa",
} as const;

const tagColors = {
  "sin-comisiones": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  "tarjeta-fisica": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  "tarjeta-virtual": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  multidivisa: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  crypto: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  "para-freelancers": "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  "para-empresa": "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  "no-residentes": "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  espanol: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
} as const;

// === COMPONENTE PRINCIPAL ===
export default function ComparativaPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterTag, setFilterTag] = useState<FilterTag>("all");
  const [sortKey, setSortKey] = useState<"name" | "monthlyFee" | "cardType" | "country" | "rating">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [favorites, setFavorites] = useLocalStorage<Array<Bank & { addedAt: string }>>("bank-favorites", []);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null);

  // Todos los tags disponibles
  const allTags = useMemo((): BankTag[] => {
    const tags = new Set<BankTag>();
    banks.forEach((b) => b.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  const isFavorite = (slug: string) => favorites.some(f => f.slug === slug);

  const toggleFavorite = (bank: Bank) => {
    if (isFavorite(bank.slug)) {
      setFavorites(favorites.filter(f => f.slug !== bank.slug));
    } else {
      setFavorites([...favorites, { ...bank, addedAt: new Date().toISOString() }]);
    }
  };

  const toggleCompare = (slug: string) => {
    setCompareIds(prev =>
      prev.includes(slug)
        ? prev.filter(id => id !== slug)
        : prev.length < 2 ? [...prev, slug] : prev
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
    let filtered = banks.filter((bank) => {
      const query = search.toLowerCase();
      const matchesSearch =
        bank.name.toLowerCase().includes(query) ||
        bank.tagline.toLowerCase().includes(query) ||
        bank.tags.some(t => tagLabels[t]?.toLowerCase().includes(query));
      const matchesType = filterType === "all" || bank.category === filterType;
      const matchesTag = filterTag === "all" || bank.tags.includes(filterTag);
      return matchesSearch && matchesType && matchesTag;
    });

    const parseFee = (fee?: string): number => {
      if (fee === "0€" || fee === "Gratis") return 0;
      if (!fee) return 999;
      const num = parseFloat(fee.replace(/[^\d.,]/g, "").replace(",", "."));
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
          comparison = (a.cardType ?? "").localeCompare(b.cardType ?? "");
          break;
        case "monthlyFee":
          comparison = parseFee(a.monthlyFee) - parseFee(b.monthlyFee);
          break;
        case "rating":
          comparison = (b.rating || 0) - (a.rating || 0);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [search, filterType, filterTag, sortKey, sortOrder]);

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const compareBanks = compareIds
    .map(id => banks.find(b => b.slug === id))
    .filter((b): b is Bank => !!b);

  return (
    <main className="container mx-auto max-w-7xl px-4 py-10 space-y-12">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center space-y-5"
      >
        <div className="flex items-center justify-center gap-2">
          <Star className="h-8 w-8 text-yellow-500" />
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Comparativa Épica de Bancos
          </h1>
          <Star className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="max-w-4xl mx-auto text-lg text-muted-foreground leading-relaxed">
          Encuentra tu banco ideal en <strong className="text-foreground">menos de 60 segundos</strong>. 
          Filtra, ordena, compara y guarda favoritos. 
          <span className="block mt-2 text-primary font-semibold">
            +10.000 usuarios ya eligieron su cuenta perfecta
          </span>
        </p>
      </motion.section>

      {/* Filtros + Acciones */}
      <Card className="p-5 md:p-7 shadow-lg">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Busca por nombre, ventaja o país..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10 h-12 text-base border-2 focus:border-primary transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>

          <Select value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Tipo de banco" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="neobanco">Neobanco</SelectItem>
              <SelectItem value="tradicional">Banco tradicional</SelectItem>
              <SelectItem value="cuenta-multidivisa">Multidivisa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterTag} onValueChange={(v) => setFilterTag(v as FilterTag)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Ventaja clave" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ventajas</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  <span className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${tagColors[tag]?.split(" ")[0] || "bg-gray-400"}`} />
                    {tagLabels[tag] || tag}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-5">
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
          <Button size="sm" variant="outline" onClick={exportToPDF} className="gap-2 ml-auto">
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
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Comparación directa</h3>
                <Button size="sm" variant="ghost" onClick={() => setCompareIds([])}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {compareBanks.map((bank) => (
                  <div key={bank.slug} className="space-y-3 p-4 rounded-xl bg-background/50">
                    <div className="flex items-center gap-3">
                      <Image src={bank.logo} alt={bank.name} width={40} height={40} className="rounded-lg" />
                      <div>
                        <p className="font-bold">{bank.name}</p>
                        <p className="text-xs text-muted-foreground">{bank.tagline}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><strong>Cuota:</strong> {bank.monthlyFee || "—"}</div>
                      <div><strong>Tarjeta:</strong> {bank.cardType || "—"}</div>
                      <div><strong>IBAN:</strong> {bank.ibanCountry || bank.country}</div>
                      <div><strong>App ES:</strong> {bank.tags.includes("espanol") ? "Sí" : "No"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabla Épica */}
      <Card className="overflow-hidden shadow-2xl" ref={tableRef}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gradient-to-r from-muted/80 to-muted/50 sticky top-0 z-10">
              <tr>
                <Th onClick={() => handleSort("name")} sortable className="w-64">
                  Banco
                  {sortKey === "name" && <ArrowUpDown className="ml-1 h-3 w-3" />}
                </Th>
                <Th>Tipo</Th>
                <Th>País / IBAN</Th>
                <Th onClick={() => handleSort("monthlyFee")} sortable>
                  Cuota
                  {sortKey === "monthlyFee" && <ArrowUpDown className="ml-1 h-3 w-3" />}
                </Th>
                <Th>Tarjeta</Th>
                <Th className="hidden xl:table-cell">Ventajas</Th>
                <Th className="w-32">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filteredAndSorted.map((bank, i) => (
                  <motion.tr
                    key={bank.slug}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: i * 0.03, type: "spring", stiffness: 300 }}
                    className="border-b hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all"
                  >
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-1.5 shadow-inner">
                          <Image
                            src={bank.logo}
                            alt={bank.name}
                            fill
                            className="object-contain rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{bank.name}</span>
                            {bank.affiliateUrl && (
                              <Badge className="h-5 text-[10px] bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                                Recomendado
                              </Badge>
                            )}
                            <button
                              onClick={() => toggleFavorite(bank)}
                              className="ml-auto"
                            >
                              <Heart
                                className={`h-4 w-4 transition-all ${
                                  isFavorite(bank.slug)
                                    ? "fill-red-500 text-red-500 scale-110"
                                    : "text-muted-foreground hover:text-red-500"
                                }`}
                              />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {bank.tagline}
                          </p>
                        </div>
                      </div>
                    </Td>

                    <Td>
                      <Badge variant="secondary" className="font-medium">
                        {categoryLabels[bank.category]}
                      </Badge>
                    </Td>

                    <Td>
                      <div className="space-y-0.5">
                        <span className="font-medium">{bank.country}</span>
                        {bank.ibanCountry && (
                          <p className="text-xs text-muted-foreground">IBAN {bank.ibanCountry}</p>
                        )}
                      </div>
                    </Td>

                    <Td className="font-bold">
                      {bank.monthlyFee === "0€" || bank.monthlyFee === "Gratis" ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4" />
                          Gratis
                        </span>
                      ) : bank.monthlyFee ? (
                        <span className="text-orange-600">{bank.monthlyFee}</span>
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Td>

                    <Td>
                      <div className="flex gap-1.5 flex-wrap">
                        {bank.cardType?.includes("Física") && (
                          <Badge variant="outline" className="text-xs">Física</Badge>
                        )}
                        {bank.cardType?.includes("Virtual") && (
                          <Badge variant="outline" className="text-xs">Virtual</Badge>
                        )}
                      </div>
                    </Td>

                    <Td className="hidden xl:table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        {bank.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={`text-[10px] font-medium ${tagColors[tag] || ""}`}
                          >
                            {tagLabels[tag] || tag}
                          </Badge>
                        ))}
                        {bank.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{bank.tags.length - 3}</span>
                        )}
                      </div>
                    </Td>

                    <Td>
                      <div className="flex flex-col gap-1.5">
                        <Button asChild size="sm" className="w-full text-xs">
                          <Link href={`/programas/${bank.slug}`}>
                            Detalles
                          </Link>
                        </Button>
                        {bank.affiliateUrl && (
                          <Button asChild variant="outline" size="sm" className="w-full text-xs">
                            <a href={bank.affiliateUrl} target="_blank" rel="noopener noreferrer">
                              Ir al banco <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant={compareIds.includes(bank.slug) ? "default" : "ghost"}
                          onClick={() => toggleCompare(bank.slug)}
                          className="w-full text-xs"
                          disabled={compareIds.length >= 2 && !compareIds.includes(bank.slug)}
                        >
                          {compareIds.includes(bank.slug) ? "En comparación" : "Comparar"}
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

      {/* CTA Final */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 p-1 rounded-2xl">
        <div className="bg-background rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold">¿Listo para abrir tu cuenta?</h3>
          <p className="text-muted-foreground">
            Elige el banco ganador y abre tu cuenta en <strong>menos de 10 minutos</strong>
          </p>
          <div className="flex justify-center gap-3">
            <Button size="lg" className="gap-2">
              Ver todos los bancos
            </Button>
            <Button size="lg" variant="secondary" className="gap-2">
              <Heart className="h-5 w-5" />
              Mis favoritos ({favorites.length})
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
}

// === COMPONENTES DE TABLA ===
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
        px-5 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider
        ${sortable ? "cursor-pointer hover:bg-muted/70 transition-colors select-none" : ""}
        ${className}
      `}
      onClick={sortable ? onClick : undefined}
      tabIndex={sortable ? 0 : undefined}
      onKeyDown={(e) => sortable && (e.key === "Enter" || e.key === " ") && onClick?.()}
    >
      <div className="flex items-center gap-1.5">{children}</div>
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-5 py-4 align-top ${className}`}>
      {children}
    </td>
  );
}