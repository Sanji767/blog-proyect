import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { banks, type Bank } from "@/lib/banks";
import Container from "@/components/layout/Container";

import {
  Globe2,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Info,
  CheckCircle2,
} from "lucide-react";

/* -----------------------------------------
   1) Rutas estáticas: /programas/revolut, etc.
------------------------------------------ */
export function generateStaticParams() {
  return banks.map((bank) => ({
    slug: bank.slug,
  }));
}

/* -----------------------------------------
   2) Metadata dinámica por banco (SEO)
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

  const { seo, name, tagline } = bank;

  return {
    title:
      seo?.metaTitle ??
      `${name} – Opiniones, comisiones y cómo abrir tu cuenta | Finanzas Eu`,
    description: seo?.metaDescription ?? tagline,
    alternates: seo?.canonicalUrl
      ? { canonical: seo.canonicalUrl }
      : undefined,
    openGraph: {
      title:
        seo?.metaTitle ??
        `${name} – Opiniones, comisiones y cómo abrir tu cuenta`,
      description: seo?.metaDescription ?? tagline,
      images: seo?.openGraphImage
        ? [{ url: seo.openGraphImage }]
        : undefined,
    },
  };
}

/* -----------------------------------------
   3) Página principal
------------------------------------------ */
export default function ProgramaPage({
  params,
}: {
  params: { slug: string };
}) {
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
    rating,
    compliance,
    acceptedCountries,
    expertOpinion,
    openingSteps,
    history,
    reviews,
  } = bank as Bank;

  const monthlyFee = fees.monthly;
  const atmWithdrawals = `${fees.atmEU} · Intl: ${fees.atmInternational}`;
  const languages = support?.languages ?? [];
  const channels = support?.channels ?? [];

  const primaryCtaUrl = affiliateUrl ?? website;
  const hasAffiliate = Boolean(affiliateUrl);

  const relatedBanks = getRelatedBanks(bank);

  const logoSrc = logo; // string | StaticImageData
  const heroSrc = heroImage || null;

  const isFree =
    !!monthlyFee && (/gratis/i.test(monthlyFee) || /0\s*€/.test(monthlyFee));

  const defaultOpeningSteps = [
    "Entra a la web oficial.",
    "Regístrate con tu email y número de teléfono.",
    "Verifica tu identidad subiendo tu documento.",
    "Confirma tu dirección y datos personales.",
    "Activa tu tarjeta y empieza a usar la cuenta.",
  ];

  const stepsToShow = openingSteps?.length ? openingSteps : defaultOpeningSteps;

  const siteUrl = "https://finanzaseu.com"; // ⚠️ Ajusta a tu dominio real

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Bancos",
        item: `${siteUrl}/bancos`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name,
        item: `${siteUrl}/programas/${params.slug}`,
      },
    ],
  };

  return (
    <section className="py-10 md:py-14">
      <Container className="space-y-10">
        {/* Schema.org Breadcrumbs */}
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(breadcrumbJsonLd),
  }}
/>

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

        {/* HERO PRINCIPAL */}
        <header className="grid items-start gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
          {/* Columna izquierda */}
          <div className="space-y-6">
            {/* Etiquetas superiores */}
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
              <span>Banco analizado por Finanzas Eu</span>
              {hasAffiliate && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-black">
                  Enlace recomendado (sin coste extra)
                </span>
              )}
            </div>

            {/* Logo + nombre + país */}
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
                <h1 className="text-3xl font-bold md:text-4xl">
                  {name}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {country}
                  {ibanCountry ? ` · IBAN ${ibanCountry}` : ""}
                </p>
              </div>
            </div>

            {/* Frase corta + descripción */}
            <p className="text-base text-muted-foreground md:text-lg">
              {tagline}
            </p>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
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
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-black shadow-md transition hover:brightness-105"
              >
                Abrir cuenta en {name}
                <ArrowRight className="h-4 w-4" />
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

            {/* Stats rápidos */}
            <div className="mt-4 grid gap-2 rounded-2xl border border-border bg-background p-3 text-xs md:grid-cols-4">
              <StatPill
                label="Cuota mensual"
                value={monthlyFee}
                highlight={isFree ? "success" : undefined}
              />
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

          {/* Columna derecha: tarjeta resumen */}
          <aside className="rounded-3xl border border-border bg-hero-background/70 p-5 shadow-md">
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
              {rating?.trustpilot && (
                <InfoRow
                  label="Trustpilot"
                  value={`${rating.trustpilot.toFixed(1)} / 5${
                    rating.totalReviews
                      ? ` · ${rating.totalReviews.toLocaleString()} opiniones`
                      : ""
                  }`}
                />
              )}
            </dl>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Globe2 className="h-3 w-3" />
                Apertura 100% online
              </span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Depósitos protegidos en la UE
              </span>
            </div>
          </aside>
        </header>

        {/* BLOQUE PROS / CONTRAS / IDEAL PARA */}
        <section className="grid items-start gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)]">
          {/* Izquierda: Pros / Contras */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold">
                Lo mejor de {name}
              </h2>
              <ul className="space-y-2 text-sm md:text-base">
                {keyPros.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 text-green-500">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {keyCons.length > 0 && (
              <div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
                <h2 className="mb-3 text-xl font-semibold">
                  Puntos a tener en cuenta
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

            {/* Ideal para */}
            <div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold">
                ¿Para quién es ideal?
              </h2>
              <p className="text-sm md:text-base">{idealFor}</p>
            </div>
          </div>

          {/* Derecha: características, requisitos, países, seguridad */}
          <aside className="space-y-5">
            {/* Características principales */}
            <div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
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
                  label="Canales de soporte"
                  value={
                    channels.length
                      ? channels.join(" · ")
                      : "No disponible"
                  }
                />
                <InfoRow
                  label="Tipo de tarjeta"
                  value={cardType}
                  icon={<CreditCard className="h-3 w-3" />}
                />
              </dl>
            </div>

            {/* Requisitos */}
            <div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
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

            {/* Países aceptados + Seguridad */}
            <div className="space-y-4 rounded-3xl border border-border bg-background p-5 shadow-sm">
              {acceptedCountries?.length > 0 && (
                <div>
                  <h2 className="mb-2 text-lg font-semibold">
                    Países desde los que puedes abrir la cuenta
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {acceptedCountries.length > 8
                      ? `${acceptedCountries
                          .slice(0, 8)
                          .join(", ")} y ${
                          acceptedCountries.length - 8
                        } más`
                      : acceptedCountries.join(", ")}
                  </p>
                </div>
              )}

              {compliance && (
                <div className="border-t border-border pt-3">
                  <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    Seguridad y regulación
                  </h2>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>
                      <strong>Licencia:</strong> {compliance.license}
                    </li>
                    <li>
                      <strong>Depósitos:</strong>{" "}
                      {compliance.depositGuarantee}
                    </li>
                    <li>
                      <strong>Regulado por:</strong>{" "}
                      {compliance.regulatedBy.join(" · ")}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </section>

        {/* Opinión experta */}
        <section className="rounded-3xl border border-border bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">
            Opinión de nuestro experto sobre {name}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {expertOpinion?.summary ??
              `En nuestra opinión, ${name} es una buena opción si buscas una cuenta moderna, 100% online y con buenas condiciones para tu día a día. Destaca especialmente para perfiles que necesitan gestionar su dinero desde varios países o divisas.`}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <h3 className="mb-2 text-sm font-semibold">
                Lo recomendamos especialmente si…
              </h3>
              <ul className="space-y-1 text-sm">
                {(expertOpinion?.recommendedFor ?? [
                  "Buscas una cuenta online sin demasiadas comisiones.",
                  "Quieres gestionar tu dinero desde el móvil.",
                  "Te interesa una tarjeta fácil de usar para viajar.",
                ]).map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 text-emerald-500">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-muted/10 p-4">
              <h3 className="mb-2 text-sm font-semibold">
                Puede no ser para ti si…
              </h3>
              <ul className="space-y-1 text-sm">
                {(expertOpinion?.notFor ?? [
                  "Buscas una cuenta tradicional con oficina física.",
                  "Necesitas servicios muy avanzados de inversión o empresa.",
                ]).map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 text-red-500">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Guía paso a paso */}
        <section className="rounded-3xl border border-border bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">
            Cómo abrir una cuenta en {name} paso a paso
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            El proceso suele tardar solo unos minutos y se hace 100% online.
          </p>
          <ol className="space-y-3 text-sm">
            {stepsToShow.map((step, index) => (
              <li
                key={step}
                className="flex gap-3 rounded-2xl bg-muted/40 p-3"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-black">
                  {index + 1}
                </span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Tabla de tarifas detallada */}
        <section className="rounded-3xl border border-border bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">
            Tarifas y comisiones de {name}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Resumen de las principales comisiones. Consulta siempre la web
            oficial para ver las condiciones actualizadas.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-4">Concepto</th>
                  <th className="py-2">Detalle</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-muted/40">
                  <td className="py-2 pr-4 align-top">Cuota mensual</td>
                  <td className="py-2">{fees.monthly}</td>
                </tr>
                <tr className="border-b border-muted/40">
                  <td className="py-2 pr-4 align-top">
                    Retiros en cajeros (zona euro)
                  </td>
                  <td className="py-2">{fees.atmEU}</td>
                </tr>
                <tr className="border-b border-muted/40">
                  <td className="py-2 pr-4 align-top">
                    Retiros en cajeros internacionales
                  </td>
                  <td className="py-2">{fees.atmInternational}</td>
                </tr>
                      {fees.fxRate && (
                        <tr className="border-b border-muted/40">
                          <td className="py-2 pr-4 align-top">
                            Cambio de divisa
                          </td>
                          <td className="py-2">{fees.fxRate}</td>
                        </tr>
                      )}

                {fees.transfer && (
                  <tr className="border-b border-muted/40">
                    <td className="py-2 pr-4 align-top">
                      Transferencias
                    </td>
                    <td className="py-2">{fees.transfer}</td>
                  </tr>
                )}
                {fees.cardReplacement && (
                  <tr>
                    <td className="py-2 pr-4 align-top">
                      Reemplazo de tarjeta
                    </td>
                    <td className="py-2">{fees.cardReplacement}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Reseñas de usuarios */}
        {reviews && reviews.length > 0 && (
          <section className="rounded-3xl border border-border bg-background p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold">
              Opiniones de usuarios sobre {name}
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Estas opiniones son un resumen de valoraciones reales de
              clientes. Pueden no representar la experiencia de todos los
              usuarios.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {reviews.slice(0, 3).map((review) => (
                <article
                  key={review.author + review.text.slice(0, 10)}
                  className="flex flex-col rounded-2xl border border-border bg-muted/20 p-4 text-sm"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="font-semibold">{review.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {"★".repeat(review.rating).padEnd(5, "☆")}
                    </span>
                  </div>
                  <p className="mb-2 text-muted-foreground">
                    {review.text}
                  </p>
                  {review.source && (
                    <span className="mt-auto text-xs text-muted-foreground">
                      Fuente: {review.source}
                    </span>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Historia y evolución del banco */}
        {history && history.length > 0 && (
          <section className="rounded-3xl border border-border bg-background p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold">
              Evolución de {name} en los últimos años
            </h2>
            <div className="space-y-3 text-sm">
              {[...history]
                .sort((a, b) => a.year - b.year)
                .map((item) => (
                  <div key={item.year} className="flex gap-3">
                    <div className="mt-1 w-16 text-xs font-semibold text-primary">
                      {item.year}
                    </div>
                    <p>{item.event}</p>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Vídeo resumen */}


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
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Info className="h-3 w-3" />
                      <span className="group-open:hidden">
                        Ver respuesta
                      </span>
                      <span className="hidden group-open:inline">
                        Ocultar
                      </span>
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
              Bancos similares que te pueden interesar
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Estos bancos se parecen a {name} por tipo de cuenta o por
              cómo funcionan. Revísalos si quieres comparar antes de
              decidir.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedBanks.map((related) => {
                const relatedLogo = related.logo;

                return (
                  <article
                    key={related.slug}
                    className="flex flex-col rounded-2xl border border-border bg-background p-4 shadow-sm"
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
          <div className="flex flex-col gap-4 rounded-3xl border border-border bg-hero-background/80 p-6 shadow-md md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <h2 className="mb-2 text-xl font-bold md:text-2xl">
                ¿Listo para abrir tu cuenta en {name}?
              </h2>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                El alta suele tardar solo unos minutos y puedes hacerlo
                100% online. Ten tu documento de identidad a mano y
                sigue los pasos que verás en la app o en la web oficial.
              </p>
            </div>
            <a
              href={primaryCtaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-black shadow-md transition hover:brightness-105"
            >
              Empezar ahora
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-3 max-w-xl text-[11px] text-muted-foreground">
            Algunos enlaces de esta página son enlaces de afiliado. Esto
            significa que Finanzas Eu puede recibir una comisión si abres
            tu cuenta a través de ellos. No pagarás nada extra y esta
            comisión no afecta a nuestra opinión ni a nuestra valoración
            del producto.
          </p>
        </section>
      </Container>
    </section>
  );
}

/* -----------------------------------------
   Componentes de apoyo
------------------------------------------ */

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

function StatPill({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "success";
}) {
  const valueClasses =
    highlight === "success"
      ? "text-emerald-600 dark:text-emerald-400 font-semibold"
      : "text-foreground";

  return (
    <div className="rounded-xl bg-background px-3 py-2 shadow-sm">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={`text-sm ${valueClasses}`}>{value}</p>
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
    "iban-es": "IBAN ES",
    "iban-nl": "IBAN NL",
    "iban-de": "IBAN DE",
    "seguro-depositos": "Depósitos protegidos",
    "soporte-24-7": "Soporte 24/7",
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
