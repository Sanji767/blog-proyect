// src/components/sections/bancos/BanksComparativa.tsx
"use client";

import { banks, type Bank } from "@/lib/banks";
import { Trophy, Star, CheckCircle2 } from "lucide-react";

// Helpers
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

const categoryLabels: Record<Bank["category"], string> = {
  neobanco: "Neobanco",
  tradicional: "Banco tradicional",
  "cuenta-multidivisa": "Cuenta multidivisa",
  fintech: "Fintech",
};

function parseMonthlyFee(fee?: string): number {
  if (!fee) return 999;
  if (/gratis/i.test(fee) || /0\s*€/.test(fee)) return 0;
  const num = parseFloat(fee.replace(/[^\d.,]/g, "").replace(",", "."));
  return isNaN(num) ? 999 : num;
}

export default function BanksComparativa() {
  // Ordenamos por afiliación primero y luego por cuota
  const sortedBanks: Bank[] = [...banks].sort((a, b) => {
    const aAff = a.affiliateUrl ? 1 : 0;
    const bAff = b.affiliateUrl ? 1 : 0;
    if (aAff !== bAff) return bAff - aAff;

    return parseMonthlyFee(a.fees?.monthly) - parseMonthlyFee(b.fees?.monthly);
  });

  return (
    <section
      id="comparativa"
      className="mt-16 space-y-5 scroll-mt-24"
    >
      <header className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Comparativa rápida de bancos
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Mira de un vistazo país, IBAN, tipo de tarjeta, comisiones y ventajas
          clave. Perfecto para hacer una primera criba antes de ver cada ficha
          en detalle.
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Tip: los bancos con “Recomendado” suelen convertir mejor para la
            mayoría de usuarios.
          </span>
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-background/70 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border/80">
                <Th className="w-56">Banco</Th>
                <Th>País / IBAN</Th>
                <Th>Tipo</Th>
                <Th>Cuota mensual</Th>
                <Th>Tarjeta</Th>
                <Th>Ventajas clave</Th>
              </tr>
            </thead>

            <tbody>
              {sortedBanks.map((bank, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;
                const isFree =
                  !!bank.fees?.monthly &&
                  (parseMonthlyFee(bank.fees?.monthly) === 0 ||
                    /gratis/i.test(bank.fees.monthly));

                return (
                  <tr
                    key={bank.slug}
                    className="border-b border-border/60 bg-background/60 text-sm transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 last:border-0"
                  >
                    {/* Banco */}
                    <Td>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {bank.name}
                          </span>

                          {bank.affiliateUrl && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-900/60 dark:text-amber-100">
                              <Star className="h-3 w-3" />
                              Recomendado
                            </span>
                          )}

                          {isTop3 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-100">
                              <Trophy className="h-3 w-3" />
                              TOP {rank}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {bank.tagline}
                        </p>
                      </div>
                    </Td>

                    {/* País / IBAN */}
                    <Td>
                      <div className="space-y-0.5 text-xs">
                        <p className="font-medium text-foreground">
                          {bank.country}
                        </p>
                        <p className="text-muted-foreground">
                          {bank.ibanCountry
                            ? `IBAN ${bank.ibanCountry}`
                            : "Sin IBAN propio"}
                        </p>
                      </div>
                    </Td>

                    {/* Tipo */}
                    <Td className="text-xs">
                      <span className="inline-flex rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                        {categoryLabels[bank.category]}
                      </span>
                    </Td>

                    {/* Cuota */}
                    <Td className="text-xs">
                      {bank.fees?.monthly ? (
                        isFree ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Gratis
                          </span>
                        ) : (
                          <span className="font-semibold text-orange-600 dark:text-orange-300">
                            {bank.fees.monthly}
                          </span>
                        )
                      ) : (
                        <span className="text-muted-foreground">–</span>
                      )}
                    </Td>

                    {/* Tarjeta */}
                    <Td className="text-xs">
                      {bank.cardType ? (
                        <span>{bank.cardType}</span>
                      ) : (
                        <span className="text-muted-foreground">–</span>
                      )}
                    </Td>

                    {/* Ventajas */}
                    <Td>
                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        {bank.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                          >
                            {tagLabels[tag] ?? tag}
                          </span>
                        ))}
                        {bank.tags.length > 4 && (
                          <span className="text-[11px] text-muted-foreground">
                            +{bank.tags.length - 4} más
                          </span>
                        )}
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border/60 bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
          <p>
            Esta tabla es un resumen. Para ver condiciones completas, límites y
            países aceptados, entra en la ficha de cada banco desde la sección
            principal.
          </p>
        </div>
      </div>
    </section>
  );
}

/* Pequeños helpers para celdas */

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={
        "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground " +
        className
      }
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={"px-4 py-3 align-top " + className}>
      {children}
    </td>
  );
}
