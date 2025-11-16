// src/app/programas/[slug]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

import { banks } from "@/lib/banks";
import type { Bank } from "@/lib/banks";
import Container from "@/components/layout/Container";

// 1) Generamos las rutas estáticas: /programas/revolut, /programas/n26, etc.
export function generateStaticParams() {
  return banks.map((bank) => ({
    slug: bank.slug,
  }));
}

// 2) Metadata dinámica por banco
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const bank = banks.find((b) => b.slug === params.slug);

  if (!bank) {
    return {
      title: "Programa no encontrado | Bancos Europa",
    };
  }

  return {
    title: `${bank.name} – Opinión y cómo abrir tu cuenta`,
    description: bank.tagline,
  };
}

// 3) Página principal
export default function ProgramaPage({ params }: { params: { slug: string } }) {
  const bank = banks.find((b) => b.slug === params.slug);

  if (!bank) return notFound();

  const {
    name,
    tagline,
    description,
    logo,
    heroImage,
    monthlyFee,
    cardType,
    atmWithdrawals,
    country,
    ibanCountry,
    currencies,
    languages,
    keyPros,
    keyCons,
    idealFor,
    requirements,
    affiliateUrl,
    website,
    tags,
    faq,
  } = bank as Bank;

  const primaryCtaUrl = affiliateUrl ?? website;
  const hasAffiliate = Boolean(affiliateUrl);

  return (
    <section className="py-10 md:py-14">
      <Container className="space-y-10">
        {/* HERO */}
        <header className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] items-start">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Programa bancario
              {hasAffiliate && (
                <span className="rounded-full bg-primary text-black px-2 py-0.5 text-[11px]">
                  Enlace recomendado
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 md:h-12 md:w-12">
                <Image
                  src={logo}
                  alt={name}
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
            </div>

            <p className="text-lg text-muted-foreground">{tagline}</p>

            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              {description}
            </p>

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

            <div className="flex flex-wrap gap-3 pt-4">
              <a
                href={primaryCtaUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-black shadow-soft hover:brightness-105 transition"
              >
                Abrir cuenta en {name} →
              </a>
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-sm font-medium"
              >
                Ver web oficial
              </a>
            </div>
          </div>

          {/* Imagen / tarjeta lateral */}
          <div className="rounded-3xl border border-border bg-hero-background/60 p-5 shadow-card">
            {heroImage ? (
              <div className="relative mb-4 h-40 w-full overflow-hidden rounded-2xl">
                <Image
                  src={heroImage}
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
                value={`${country}${ibanCountry ? ` · IBAN ${ibanCountry}` : ""}`}
              />
            </dl>
          </div>
        </header>

        {/* DETALLES */}
        <section className="grid gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)] items-start">
          {/* Columna izquierda: pros/cons */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">
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
              <div>
                <h2 className="text-xl font-semibold mb-3">
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

          {/* Columna derecha: tabla de características */}
          <aside className="space-y-5">
            <div className="rounded-3xl border border-border bg-background p-5 shadow-card">
              <h2 className="text-lg font-semibold mb-3">
                Características principales
              </h2>
              <dl className="grid grid-cols-1 gap-3 text-sm">
                <InfoRow
                  label="Divisas disponibles"
                  value={currencies.join(" · ")}
                />
                <InfoRow
                  label="Idiomas de la app/soporte"
                  value={languages.join(" · ")}
                />
                <InfoRow label="Ideal para" value={idealFor} />
              </dl>
            </div>

            <div className="rounded-3xl border border-border bg-background p-5">
              <h2 className="text-lg font-semibold mb-3">
                Requisitos principales
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
            <h2 className="text-xl font-semibold mb-4">
              Preguntas frecuentes sobre {name}
            </h2>
            <div className="space-y-3">
              {faq.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-border bg-background p-4 text-sm"
                >
                  <summary className="cursor-pointer list-none font-medium">
                    {item.question}
                  </summary>
                  <p className="mt-2 text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CTA final */}
        <section className="border-t border-border pt-8">
          <div className="rounded-3xl bg-hero-background/80 border border-border p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                ¿Listo para abrir tu cuenta en {name}?
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl">
                El alta suele tardar solo unos minutos y puedes hacerlo 100% online.
                Ten tu documento de identidad a mano y sigue los pasos en la app.
              </p>
            </div>
            <a
              href={primaryCtaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-black shadow-soft hover:brightness-105 transition"
            >
              Empezar ahora →
            </a>
          </div>
        </section>
      </Container>
    </section>
  );
}

// Componentes pequeños de apoyo

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
