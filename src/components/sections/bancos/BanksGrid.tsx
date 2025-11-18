// src/components/sections/bancos/BanksGrid.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { banks, type Bank } from "@/lib/banks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

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
};

function formatTag(tag: string): string {
  return tagLabels[tag] ?? tag;
}

const categoryColors: Record<string, string> = {
  neobanco: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  tradicional: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  "cuenta-multidivisa":
    "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
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
  crypto: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  "para-freelancers":
    "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  "para-empresa":
    "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  "no-residentes":
    "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  espanol: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

/* ==============
 * Componente grid
 * ============== */

export default function BanksGrid() {
  const sorted = [...banks].sort((a, b) => {
    const aAff = a.affiliateUrl ? 1 : 0;
    const bAff = b.affiliateUrl ? 1 : 0;
    return bAff - aAff;
  });

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sorted.map((bank, index) => (
        <motion.div
          key={bank.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <BankCard bank={bank} />
        </motion.div>
      ))}
    </div>
  );
}

/* ===============
 * Tarjeta de banco
 * =============== */

function BankCard({ bank }: { bank: Bank }) {
  const detailUrl = `/programas/${bank.slug}`;

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-background/95 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-1 shadow-inner">
            <Image
              src={bank.logo}
              alt={`${bank.name} logo`}
              fill
              className="object-contain p-1"
              sizes="48px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold text-foreground">
              {bank.name}
            </h3>
            <p className="text-xs text-muted-foreground">
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

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className={`font-medium ${
              categoryColors[bank.category] ?? "bg-muted text-foreground"
            }`}
          >
            {bank.category === "neobanco"
              ? "Neobanco"
              : bank.category === "tradicional"
              ? "Banco tradicional"
              : "Cuenta multidivisa"}
          </Badge>

          {bank.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={`text-[10px] font-medium ${
                tagColors[tag] ?? "border-muted text-muted-foreground"
              }`}
            >
              {formatTag(tag)}
            </Badge>
          ))}

          {bank.tags.length > 3 && (
            <Badge
              variant="outline"
              className="border-dashed text-[10px] text-muted-foreground"
            >
              +{bank.tags.length - 3}
            </Badge>
          )}
        </div>

        <dl className="mt-4 space-y-1.5 text-xs">
          {/* Solo usamos campos que existen en Bank */}
          <InfoRow label="Tarjeta" value={bank.cardType} />
          <InfoRow label="IBAN" value={bank.ibanCountry} />
        </dl>

        <div className="mt-auto space-y-2 pt-5">
          {/* Botón principal */}
          <Link href={detailUrl} className="block">
            <Button className="w-full rounded-full shadow-sm transition-all group-hover:shadow-md">
              Ver detalles y cómo abrirla
            </Button>
          </Link>

          {/* Botón afiliado externo */}
          {bank.affiliateUrl && (
            <a
              href={bank.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="outline"
                size="sm"
                className="flex w-full items-center justify-center gap-1 rounded-full text-xs"
              >
                Ir a {bank.name}
                <span className="text-xs">External link</span>
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
      <dd className="font-medium text-foreground">
        {value ?? "-"}
      </dd>
    </div>
  );
}
