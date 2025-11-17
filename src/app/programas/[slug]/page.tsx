// src/app/programas/[slug]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { banks } from "@/lib/banks";
import type { Bank } from "@/lib/banks";
import Container from "@/components/layout/Container";

/* -----------------------------------------
   1) Rutas estáticas: /programas/revolut, etc.
------------------------------------------ */
export function generateStaticParams() {
  return banks.map((bank) => ({
    slug: bank.slug,
  }));
}

/* -----------------------------------------
   2) Metadata dinámica por banco
------------------------------------------ */
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const bank = banks.find((b) => b.slug === params.slug);

  if (!bank) {
    return {
      title: "Programa no encontrado | Finanzas Eu",
      description:
        "No hemos encontrado el banco o programa que estabas buscando.",
    };
  }

  return {
    title: `${bank.name} – Opinión, detalles y cómo abrir tu cuenta | Finanzas Eu`,
    description: bank.tagline,
  };
}

/* -----------------------------------------
   3) Página principal
------------------------------------------ */
export default function ProgramaPage({ params }: { params: { slug: string } }) {
  const bank = banks.find((b) => b.slug === params.slug);

  if (!bank) return notFound();

  const {
    name,
    tagline,
    description,
    logo,
    heroImage,
    country,
    ibanCountry,
    currencies,
    keyPros,
    keyCons,
    idealFor,
    requirements,
    affiliateUrl,
    website,
    tags,
    faq,
    fees,
    cardType,
    support,
  } = bank as Bank;

  // Adaptamos a la estructura nueva:
  const monthlyFee = fees.monthly;
  const atmWithdrawals = `${fees.atmEU} / Intl: ${fees.atmInternational}`;
  const languages = support?.languages ?? [];
  const channels = support?.channels ?? [];

  const primaryCtaUrl = affiliateUrl ?? website;
  const hasAffiliate = Boolean(affiliateUrl);

  const relatedBanks = getRelatedBanks(bank);

  const logoSrc =
    typeof logo === "string" ? logo : (logo as any);

  const heroSrc =
    heroImage && typeof heroImage === "string"
      ? heroImage
      : (heroImage as any);

  return (
    <section className="py-10 md:py-14">
      <Container className="space-y-10">
        {/* BREADCRUMB */}
        <nav
          aria-label="Ruta de navegación"
          className="text-xs text-muted-foreground"
        >
          <div className="mb-2 flex flex-wrap items-center gap-1">
            <Link
              href="/bancos"
              className="hover:text-primary hover:underline"
            >
              Bancos
            </Link>
            <span>/</span>
            <span className="text-foreground">{name}</span>
          </div>
        </nav>

        {/* HERO */}
        <header className="grid items-start gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
              <span>Programa bancario analizado por Finanzas Eu</span>
              {hasAffiliate && (
                <span className="rounded-full bg-primary text-black px-2 py-0.5 text-[10px]">
                  Enlace recomendado
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative h-10 w-10 md:h-12 md:w-12">
                <Image
                  src={logoSrc}
                  alt={name}
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold md:text-4xl">{name}</h1>
                <p className="text-xs text-muted-foreground">
                  {country}
                  {ibanCountry ? ` · IBAN ${ibanCountry}` : ""}
                </p>
              </div>
            </div>

            <p className="text-base text-muted-foreground md:text-lg">
              {tagline}
            </p>

            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {formatTag(tag)}
                </span>
              ))}
            </div>

            {/* CTA principal */}
            <div className="flex flex-wrap gap-3 pt-4">
              <a
                href={primaryCtaUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-black shadow-soft transition hover:brightness-105"
              >
                Abrir cuenta en {name} →
              </a>
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-sm font-medium hover:bg-background/60"
              >
                Ver web oficial
              </a>
            </div>

            {/* Barra de stats rápidos */}
            <div className="mt-4 grid gap-2 rounded-2xl border border-border bg-background p-3 text-xs md:grid-cols-4">
              <StatPill label="Cuota mensual" value={monthlyFee} />
              <StatPill label="Tarjeta" value={cardType} />
              <StatPill label="Cajeros" value={atmWithdrawals} />
              <StatPill
                label="Divisas"
                value={
                  currencies.length > 3
                    ? `${currencies.slice(0, 3).join(" · ")} +${
                        currencies.length - 3
                      }`
                    : currencies.join(" · ")
                }
              />
            </div>
          </div>

          {/* Imagen / tarjeta lateral */}
          <aside className="rounded-3xl border border-border bg-hero-background/60 p-5 shadow-card">
            {heroSrc ? (
              <div className="relative mb-4 h-40 w-full overflow-hidden rounded-2xl">
                <Image
                  src={heroSrc}
                  alt={`Vista previa de ${name}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 320px, 100vw"
                />
              </div>
            ) : (
              <div className="mb-4 h-40 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-accent/30" />
            )}

            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
              Resumen rápido
            </h2>
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <InfoRow label="Cuota mensual" value={monthlyFee} />
              <InfoRow label="Tipo de tarjeta" value={cardType} />
              <InfoRow label="Cajeros" value={atmWithdrawals} />
              <InfoRow
                label="País / IBAN"
                value={`${country}${
                  ibanCountry ? ` · IBAN ${ibanCountry}` : ""
                }`}
              />
              <InfoRow
                label="Idiomas"
                value={
                  languages.length
                    ? languages.join(" · ")
                    : "No disponible"
                }
              />
            </dl>
          </aside>
        </header>

        {/* DETALLES PRINCIPALES */}
        <section className="grid items-start gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)]">
          {/* Columna izquierda: pros/cons */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-background p-5 shadow-card">
              <h2 className="mb-3 text-xl font-semibold">
                Lo mejor de {name}
              </h2>
              <ul className="space-y-2 text-sm md:text-base">
                {keyPros.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 text-green-500">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {keyCons.length > 0 && (
              <div className="rounded-3xl border border-border bg-background p-5 shadow-card">
                <h2 className="mb-3 text-xl font-semibold">
                  Cosas a tener en cuenta
                </h2>
                <ul className="space-y-2 text-sm md:text-base">
                  {keyCons.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 text-red-500">●</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Columna derecha: características + requisitos */}
          <aside className="space-y-5">
            <div className="rounded-3xl border border-border bg-background p-5 shadow-card">
              <h2 className="mb-3 text-lg font-semibold">
                Características principales
              </h2>
              <dl className="grid grid-cols-1 gap-3 text-sm">
                <InfoRow
                  label="Divisas disponibles"
                  value={currencies.join(" · ")}
                />
                <InfoRow
                  label="Idiomas de la app/soporte"
                  value={
                    languages.length
                      ? languages.join(" · ")
                      : "No disponible"
                  }
                />
                <InfoRow
                  label="Ideal para"
                  value={idealFor}
                />
              </dl>
            </div>

            <div className="rounded-3xl border border-border bg-background p-5">
              <h2 className="mb-3 text-lg font-semibold">
                Requisitos para abrir la cuenta
              </h2>
              <ul className="space-y-2 text-sm">
                {requirements.map((req) => (
                  <li key={req} className="flex gap-2">
                    <span className="mt-1 text-primary">●</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>

        {/* FAQ específica del banco */}
        {faq && faq.length > 0 && (
          <section className="border-t border-border pt-8">
            <h2 className="mb-4 text-xl font-semibold">
              Preguntas frecuentes sobre {name}
            </h2>
            <div className="space-y-3">
              {faq.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-border bg-background p-4 text-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium">
                    <span>{item.question}</span>
                    <span className="text-xs text-muted-foreground group-open:hidden">
                      Ver respuesta
                    </span>
                    <span className="hidden text-xs text-muted-foreground group-open:inline">
                      Ocultar
                    </span>
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Bancos relacionados */}
        {relatedBanks.length > 0 && (
          <section className="border-t border-border pt-8">
            <h2 className="mb-3 text-xl font-semibold">
              Otros bancos que también te pueden encajar
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Estos bancos son similares por tipo o por cómo funcionan. Pueden
              ser una alternativa interesante si quieres comparar antes de
              decidirte.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedBanks.map((related) => {
                const relatedLogo =
                  typeof related.logo === "string"
                    ? related.logo
                    : (related.logo as any);

                return (
                  <article
                    key={related.slug}
                    className="flex flex-col rounded-2xl border border-border bg-background p-4 shadow-card"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <div className="relative h-8 w-8">
                        <Image
                          src={relatedLogo}
                          alt={related.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">
                          {related.name}
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                          {related.country}
                          {related.ibanCountry
                            ? ` · IBAN ${related.ibanCountry}`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <p className="mb-3 line-clamp-3 text-xs text-muted-foreground">
                      {related.tagline}
                    </p>
                    <Link
                      href={`/programas/${related.slug}`}
                      className="mt-auto inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-[11px] font-semibold text-black hover:brightness-105"
                    >
                      Ver detalles →
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* CTA final */}
        <section className="border-t border-border pt-8">
          <div className="flex flex-col gap-4 rounded-3xl border border-border bg-hero-background/80 p-6 shadow-card md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <h2 className="mb-2 text-xl font-bold md:text-2xl">
                ¿Listo para abrir tu cuenta en {name}?
              </h2>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                El alta suele tardar solo unos minutos y puedes hacerlo 100%
                online. Ten tu documento de identidad a mano y sigue los pasos
                que verás en la app o en la web oficial.
              </p>
            </div>
            <a
              href={primaryCtaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-black shadow-soft transition hover:brightness-105"
            >
              Empezar ahora →
            </a>
          </div>
        </section>
      </Container>
    </section>
  );
}

/* -----------------------------------------
   Componentes pequeños de apoyo
------------------------------------------ */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background px-3 py-2 shadow-sm">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function formatTag(tag: string): string {
  const map: Record<string, string> = {
    "sin-comisiones": "Sin comisiones",
    "tarjeta-fisica": "Tarjeta física",
    "tarjeta-virtual": "Tarjeta virtual",
    multidivisa: "Cuenta multidivisa",
    crypto: "Cripto",
    "para-freelancers": "Para freelancers",
    "para-empresa": "Para empresa",
    "no-residentes": "Acepta no residentes",
    espanol: "App/soporte en español",
  };
  return map[tag] ?? tag;
}

/**
 * Devuelve bancos relacionados según categoría y tags en común.
 */
function getRelatedBanks(current: Bank): Bank[] {
  return banks
    .filter((b) => b.slug !== current.slug)
    .map((b) => {
      const sameCategoryScore = b.category === current.category ? 2 : 0;
      const commonTags = b.tags.filter((tag) =>
        current.tags.includes(tag),
      ).length;
      return {
        bank: b,
        score: sameCategoryScore + commonTags,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.bank);
}
