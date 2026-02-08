// src/components/sections/bancos/BanksGrid.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Trophy, Star } from "lucide-react";
import { banks, type Bank } from "@/lib/banks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

/* =========================
 * Helpers de tags / colores
 * ========================= */

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
};

function formatTag(tag: string): string {
  return tagLabels[tag] ?? tag;
}

const categoryColors: Record<string, string> = {
  neobanco:
    "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-100",
  tradicional:
    "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
  "cuenta-multidivisa":
    "bg-purple-50 text-purple-800 dark:bg-purple-900/50 dark:text-purple-100",
  fintech:
    "bg-cyan-50 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-100",
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

/* ==============
 * Componente grid
 * ============== */

export default function BanksGrid() {
  const sorted = [...banks].sort((a, b) => {
    const aAff = a.affiliateUrl ? 1 : 0;
    const bAff = b.affiliateUrl ? 1 : 0;
    if (aAff !== bAff) return bAff - aAff;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sorted.map((bank, index) => (
        <motion.div
          key={bank.slug}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, delay: index * 0.03 }}
        >
          <BankCard bank={bank} index={index} />
        </motion.div>
      ))}
    </div>
  );
}

/* ===============
 * Tarjeta de banco
 * =============== */

function BankCard({ bank, index }: { bank: Bank; index: number }) {
  const detailUrl = `/programas/${bank.slug}`;
  const rank = index + 1;
  const isTop3 = rank <= 3;
  const isRecommended = !!bank.affiliateUrl;

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-background/95 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-1 shadow-inner">
            <Image
              src={bank.logo}
              alt={`${bank.name} logo`}
              fill
              className="object-contain p-1"
              sizes="48px"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-semibold text-foreground">
                {bank.name}
              </h3>

              {isRecommended && (
                <Badge className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-[10px] font-semibold text-amber-800 dark:bg-amber-900/60 dark:text-amber-100">
                  <Star className="h-3 w-3" />
                  Recomendado
                </Badge>
              )}

              {isTop3 && (
                <Badge className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-100">
                  <Trophy className="h-3 w-3" />
                  TOP {rank}
                </Badge>
              )}
            </div>

            <p className="text-[11px] text-muted-foreground">
              {bank.country}
              {bank.ibanCountry && ` · IBAN ${bank.ibanCountry}`}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <CardDescription className="line-clamp-3 text-sm text-muted-foreground">
          {bank.tagline}
        </CardDescription>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {/* Tipo de banco */}
          <Badge
            variant="secondary"
            className={`rounded-full text-[11px] font-medium ${
              categoryColors[bank.category] ??
              "bg-muted text-foreground dark:bg-slate-800 dark:text-slate-100"
            }`}
          >
            {bank.category === "neobanco"
              ? "Neobanco"
              : bank.category === "tradicional"
              ? "Banco tradicional"
              : bank.category === "cuenta-multidivisa"
              ? "Cuenta multidivisa"
              : "Fintech"}
          </Badge>

          {bank.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={`rounded-full text-[10px] font-medium ${
                tagColors[tag] ?? "border-muted text-muted-foreground"
              }`}
            >
              {formatTag(tag)}
            </Badge>
          ))}

          {bank.tags.length > 3 && (
            <Badge
              variant="outline"
              className="rounded-full border-dashed text-[10px] text-muted-foreground"
            >
              +{bank.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Info rápida */}
        <dl className="mt-4 space-y-1.5 text-xs">
          <InfoRow label="Tarjeta" value={bank.cardType ?? "—"} />
          <InfoRow
            label="Acepta no residentes"
            value={
              bank.tags.includes("no-residentes") ? "Sí" : "Depende del país"
            }
          />
        </dl>

        {/* Botones */}
        <div className="mt-auto space-y-2 pt-5">
          {/* Botón principal */}
          <Link href={detailUrl} className="block">
            <Button className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 group-hover:shadow-md">
              Ver ficha completa
            </Button>
          </Link>

          {/* Botón afiliado externo */}
          {bank.affiliateUrl && (
            <a
              href={bank.affiliateUrl}
              data-analytics="affiliate"
              data-affiliate-partner={bank.slug}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="outline"
                size="sm"
                className="flex w-full items-center justify-center gap-1 rounded-full text-[11px]"
              >
                Abrir cuenta en {bank.name}
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ==========
 * InfoRow
 * ========== */

type InfoRowProps = {
  label: string;
  value?: string | number | null;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="text-[11px] font-semibold text-foreground">
        {value ?? "—"}
      </dd>
    </div>
  );
}
