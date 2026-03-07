"use client";

// src/app/ebooks/[slug]/EbookDetailClient.tsx

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Star } from "lucide-react";

import Container from "@/components/layout/Container";
import Badge from "@/components/ebooks/Badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Ebook } from "@/lib/ebooks-data";

export default function EbookDetailClient({ ebook }: { ebook: Ebook }) {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-12">
        <Button
          asChild
          variant="outline"
          className="w-fit rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
        >
          <Link href="/ebooks">
            <ArrowLeft className="h-4 w-4" />
            Biblioteca
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Card className="relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-offset-accent md:p-10">
            <div className="pointer-events-none absolute -top-28 -right-28 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />

            <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
              <div className="mx-auto w-full max-w-sm">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-2 border-secondary bg-secondary shadow-soft">
                  <Image
                    src={ebook.image}
                    alt={ebook.title}
                    fill
                    sizes="(min-width: 768px) 420px, 90vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{ebook.format || "Curso online"}</Badge>
                  {ebook.isFree ? <Badge variant="free">Gratis</Badge> : null}
                </div>

                <h1 className="text-balance text-3xl font-black tracking-tight text-accent md:text-5xl">
                  {ebook.title}
                </h1>

                <p className="text-sm leading-relaxed text-secondary-foreground/80 md:text-base">
                  {ebook.description}
                </p>

                {ebook.author ? (
                  <div className="rounded-2xl border-2 border-secondary-foreground/10 bg-secondary-foreground/5 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                      Autor
                    </p>
                    <p className="mt-3 font-semibold">{ebook.author.name}</p>
                    <p className="mt-1 text-sm text-secondary-foreground/75">
                      {ebook.author.bio}
                    </p>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="gap-2 rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
                  >
                    <a
                      href={ebook.hotmartUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Acceder ahora
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-secondary-foreground/20 text-secondary-foreground shadow-none hover:translate-x-0 hover:translate-y-0 hover:border-secondary-foreground/35 hover:bg-secondary-foreground/5"
                  >
                    <Link href="/contacto">¿Dudas? Escríbeme</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {ebook.learnings?.length ? (
            <Card className="space-y-4 p-6">
              <h2 className="text-xl font-black tracking-tight">
                Qué aprenderás
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {ebook.learnings.map((item, i) => (
                  <li key={`${item}-${i}`} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {ebook.targetAudience ? (
            <Card className="space-y-4 p-6">
              <h2 className="text-xl font-black tracking-tight">
                Para quién es
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {ebook.targetAudience}
              </p>
            </Card>
          ) : null}
        </div>

        {ebook.whyInvest ? (
          <Card className="space-y-4 p-6">
            <h2 className="text-xl font-black tracking-tight">
              Por qué invertir / tomar este curso
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {ebook.whyInvest}
            </p>
          </Card>
        ) : null}

        {ebook.reviews ? (
          <Card className="space-y-4 p-6">
            <h2 className="text-xl font-black tracking-tight">Evaluaciones</h2>
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-accent" />
              <span className="font-semibold text-foreground">
                {ebook.reviews.rating}
              </span>
              <span>
                ({ebook.reviews.count.toLocaleString("es-ES")} evaluaciones)
              </span>
            </p>
          </Card>
        ) : null}

        <Card className="relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-8 text-center text-secondary-foreground shadow-soft md:p-10">
          <div className="pointer-events-none absolute -top-28 -right-28 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative space-y-5">
            <h2 className="text-balance text-2xl font-black tracking-tight text-accent md:text-3xl">
              Empieza hoy
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-secondary-foreground/80 md:text-base">
              Accede ahora al curso y transforma tu aprendizaje en resultados
              reales.
            </p>
            <Button
              asChild
              size="lg"
              className="mx-auto w-fit gap-2 rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
            >
              <a
                href={ebook.hotmartUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Acceder al curso
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}

