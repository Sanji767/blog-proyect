// src/components/sections/home/HomeBanksPreview.tsx

import Link from "next/link";
import Image from "next/image";
import Container from "@/components/layout/Container";
import { banks } from "@/lib/banks";

export default function HomeBanksPreview() {
  // Cojo los 3 primeros o los que más sentido tengan
  const featured = banks.slice(0, 3);

  return (
    <section className="py-12 md:py-16 border-t border-border bg-background">
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
          {featured.map((bank) => (
            <article
              key={bank.slug}
              className="flex flex-col rounded-2xl border border-border bg-background p-5 shadow-card transition-transform hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="relative h-8 w-8">
                  <Image
                    src={bank.logo}
                    alt={bank.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{bank.name}</h3>
                  <p className="text-[11px] text-muted-foreground">
                    {bank.country}
                    {bank.ibanCountry && ` · IBAN ${bank.ibanCountry}`}
                  </p>
                </div>
              </div>

              <p className="mb-3 line-clamp-3 text-xs text-muted-foreground">
                {bank.tagline}
              </p>

              <div className="mt-auto flex flex-col gap-2">
                <Link
                  href={`/programas/${bank.slug}`}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-black hover:brightness-105"
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
