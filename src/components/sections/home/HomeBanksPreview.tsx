// src/components/sections/home/HomeBanksPreview.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { banks } from "@/lib/banks";

export default function HomeBanksPreview() {
  const featured = [...banks]
    .filter((b) => b._status !== "draft")
    .sort((a, b) => (a._priority ?? 999) - (b._priority ?? 999))
    .slice(0, 3);

  return (
    <section className="border-t border-border bg-muted/30 py-16 md:py-24">
      <Container>
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Ranking 2026
            </p>
            <h2 className="text-balance text-3xl font-black tracking-tight md:text-5xl">
              Recomendaciones{" "}
              <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
                Top
              </span>
            </h2>
            <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              Bancos que suelen encajar para abrir cuenta online desde el
              extranjero, viajar o gestionar dinero en varias divisas.
            </p>
          </div>

          <Button asChild variant="outline" className="gap-2 shrink-0">
            <Link href="/bancos">
              Ver todo el directorio
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featured.map((bank, index) => (
            <motion.article
              key={bank.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-7 text-secondary-foreground shadow-soft transition-shadow hover:shadow-offset-accent"
            >
              <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 -right-28 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 rounded-xl border-2 border-secondary-foreground/12 bg-secondary-foreground/5 p-2">
                    <Image
                      src={bank.logo}
                      alt={bank.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                      Top #{index + 1}
                    </p>
                    <h3 className="mt-2 text-2xl font-black leading-tight text-accent">
                      {bank.name}
                    </h3>
                  </div>
                </div>

                <span className="inline-flex items-center rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
                  #{index + 1}
                </span>
              </div>

              <p className="relative mt-5 text-sm leading-relaxed text-secondary-foreground/80 line-clamp-3">
                {bank.tagline}
              </p>

              <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border-2 border-secondary-foreground/10 bg-secondary-foreground/5 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-foreground/70">
                    IBAN
                  </p>
                  <p className="mt-2 font-semibold">
                    {bank.ibanPrefix} ({bank.ibanCountry})
                  </p>
                </div>
                <div className="rounded-xl border-2 border-secondary-foreground/10 bg-secondary-foreground/5 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-foreground/70">
                    Cuota mensual
                  </p>
                  <p className="mt-2 font-semibold">{bank.fees.monthly}</p>
                </div>
              </div>

              <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="sm" className="flex-1">
                  <Link href={`/programas/${bank.slug}`}>Ver análisis</Link>
                </Button>

                {bank.affiliateUrl ? (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="flex-1 border-secondary-foreground/20 text-secondary-foreground hover:border-secondary-foreground/35 hover:bg-secondary-foreground/5"
                  >
                    <a
                      href={bank.affiliateUrl}
                      data-analytics="affiliate"
                      data-affiliate-partner={bank.slug}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Web oficial
                    </a>
                  </Button>
                ) : (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="flex-1 border-secondary-foreground/20 text-secondary-foreground hover:border-secondary-foreground/35 hover:bg-secondary-foreground/5"
                  >
                    <Link href="/bancos">Ver alternativas</Link>
                  </Button>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
