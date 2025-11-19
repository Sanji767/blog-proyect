// src/components/sections/home/HomeBanksPreview.tsx

import Link from "next/link";
import Image from "next/image";
import { Trophy } from "lucide-react";
import Container from "@/components/layout/Container";
import { banks } from "@/lib/banks";

export default function HomeBanksPreview() {
  // Priorizamos bancos con affiliateUrl y cogemos los 3 primeros
  const featured = [...banks]
    .sort((a, b) => {
      const aAff = a.affiliateUrl ? 1 : 0;
      const bAff = b.affiliateUrl ? 1 : 0;
      return bAff - aAff;
    })
    .slice(0, 3);

  return (
    <section className="border-t border-border bg-background py-12 md:py-16">
      <Container className="space-y-8">
        <header className="space-y-2 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Bancos que suelen funcionar muy bien
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
            Una selección rápida de bancos digitales y cuentas multidivisa que
            suelen encajar con la mayoría de personas que viajan, trabajan en
            remoto o viven entre países.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((bank, index) => (
            <article
              key={bank.slug}
              className="flex flex-col rounded-3xl border border-border bg-background/90 p-5 shadow-card transition-all hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-soft"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="relative h-9 w-9 rounded-xl bg-muted p-1">
                  <Image
                    src={bank.logo}
                    alt={bank.name}
                    fill
                    className="rounded-lg object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{bank.name}</h3>
                  <p className="text-[11px] text-muted-foreground">
                    {bank.country}
                    {bank.ibanCountry && ` · IBAN ${bank.ibanCountry}`}
                  </p>
                </div>

                {/* Badge TOP */}
                <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                  <Trophy className="h-3.5 w-3.5" />
                  TOP {index + 1}
                </div>
              </div>

              <p className="mb-3 line-clamp-3 text-xs text-muted-foreground">
                {bank.tagline}
              </p>

              <div className="mt-auto flex flex-col gap-2">
                <Link
                  href={`/programas/${bank.slug}`}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-110"
                >
                  Ver detalles →
                </Link>
                {bank.affiliateUrl && (
                  <a
                    href={bank.affiliateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-[11px] font-medium text-muted-foreground hover:bg-background/60"
                  >
                    Ir directamente a {bank.name}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/bancos"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-background/70"
          >
            Ver todos los bancos →
          </Link>
        </div>
      </Container>
    </section>
  );
}
