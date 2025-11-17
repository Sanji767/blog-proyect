// src/components/sections/bancos/BanksComparativa.tsx
"use client";

import { banks, type Bank } from "@/lib/banks";

export default function BanksComparativa() {
  // si quieres, aquí puedes ordenar por algo (opcional)
  const sortedBanks: Bank[] = [...banks].sort((a, b) => {
    const aAff = a.affiliateUrl ? 1 : 0;
    const bAff = b.affiliateUrl ? 1 : 0;
    return bAff - aAff;
  });

  return (
    <section
      id="comparativa"
      className="mt-16 space-y-4 scroll-mt-24"
    >
      <header className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Comparativa de bancos
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Compara de un vistazo las cuotas, tipos de tarjeta y características
          clave de cada banco para elegir la opción que mejor encaja contigo.
        </p>
      </header>

      <div className="overflow-x-auto rounded-xl border bg-background/50">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/60">
            <tr className="border-b">
              <Th>Banco</Th>
              <Th>País</Th>
              <Th>IBAN</Th>
              <Th>Cuota mensual</Th>
              <Th>Tarjeta</Th>
              <Th>Principales ventajas</Th>
            </tr>
          </thead>
          <tbody>
            {sortedBanks.map((bank) => (
              <tr
                key={bank.slug}
                className="border-b last:border-0 hover:bg-muted/40 transition-colors"
              >
                <Td className="font-medium">{bank.name}</Td>
                <Td>{bank.country}</Td>
                <Td>{bank.ibanCountry ?? "-"}</Td>
                <Td>{bank.monthlyFee ?? "-"}</Td>
                <Td>{bank.cardType ?? "-"}</Td>
                <Td className="max-w-xs">
                  <ul className="list-disc pl-4 space-y-0.5 text-xs text-muted-foreground">
                    {bank.tags.slice(0, 3).map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                    {bank.tags.length > 3 && (
                      <li>+{bank.tags.length - 3} características más</li>
                    )}
                  </ul>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
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
        "px-4 py-3 text-left text-xs font-semibold text-muted-foreground " +
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
