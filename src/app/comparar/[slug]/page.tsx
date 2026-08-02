// src/app/comparar/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check, X, ArrowRight, ShieldCheck, Star, ExternalLink } from "lucide-react";

import Container from "@/components/layout/Container";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { Button } from "@/components/ui/button";
import { banks, Bank } from "@/lib/banks";
import { SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function parseComparisonSlug(slug: string): [string, string] | null {
  const parts = slug.toLowerCase().split("-vs-");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return [parts[0], parts[1]];
}

export async function generateStaticParams() {
  const activeBanks = banks.filter((b) => b._status !== "draft");
  const params: { slug: string }[] = [];

  for (let i = 0; i < activeBanks.length; i++) {
    for (let j = i + 1; j < activeBanks.length; j++) {
      params.push({ slug: `${activeBanks[i].slug}-vs-${activeBanks[j].slug}` });
      params.push({ slug: `${activeBanks[j].slug}-vs-${activeBanks[i].slug}` });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseComparisonSlug(slug);
  if (!parsed) return {};

  const [b1Slug, b2Slug] = parsed;
  const b1 = banks.find((b) => b.slug === b1Slug);
  const b2 = banks.find((b) => b.slug === b2Slug);

  if (!b1 || !b2) return {};

  const title = `${b1.name} vs ${b2.name} (2026): ¿Cuál es mejor? Comparativa real`;
  const description = `Comparativa directa entre ${b1.name} y ${b2.name}. Analizamos comisiones, tipo de IBAN (${b1.ibanPrefix} vs ${b2.ibanPrefix}), tarjetas y cuál conviene más según tu perfil.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/comparar/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/comparar/${slug}`,
    },
  };
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseComparisonSlug(slug);
  if (!parsed) notFound();

  const [b1Slug, b2Slug] = parsed;
  const b1 = banks.find((b) => b.slug === b1Slug);
  const b2 = banks.find((b) => b.slug === b2Slug);

  if (!b1 || !b2) notFound();

  const pageUrl = `${SITE_URL}/comparar/${slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Bancos", item: `${SITE_URL}/bancos` },
      { "@type": "ListItem", position: 3, name: `${b1.name} vs ${b2.name}`, item: pageUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
      />

      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
          <ShieldCheck className="h-4 w-4" /> Comparativa Frente a Frente (2026)
        </div>

        <h1 className="text-balance text-4xl font-black leading-tight tracking-tight md:text-6xl">
          {b1.name} <span className="text-primary">vs</span> {b2.name}
        </h1>

        <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          ¿No sabes cuál elegir? Comparamos {b1.name} y {b2.name} punto por punto: comisiones, tipo de IBAN, tarjetas y cuál se adapta mejor a tu día a día o viajes.
        </p>
      </header>

      {/* Tarjetas Enfrentadas */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {[b1, b2].map((b) => (
          <div
            key={b.slug}
            className="group relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-soft"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-xl border-2 border-secondary-foreground/12 bg-secondary-foreground/5 p-2">
                <Image src={b.logo} alt={b.name} fill className="object-contain p-2" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-accent">{b.name}</h2>
                <p className="text-xs text-muted-foreground">{b.country} • IBAN {b.ibanPrefix}</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-secondary-foreground/80">{b.tagline}</p>

            <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4 text-sm">
              <span className="font-semibold text-muted-foreground">Cuota mensual:</span>
              <span className="font-bold text-primary">{b.fees.monthly}</span>
            </div>

            <div className="mt-6 flex gap-3">
              <Button asChild size="sm" className="flex-1">
                <LocalizedLink href={`/programas/${b.slug}`}>Ver ficha completa</LocalizedLink>
              </Button>
              {b.affiliateUrl && (
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <a href={b.affiliateUrl} target="_blank" rel="noreferrer noopener sponsored">
                    Web oficial <ExternalLink className="ml-1 h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tabla Comparativa Detallada */}
      <section className="mt-14 space-y-6">
        <h2 className="text-2xl font-black tracking-tight md:text-3xl">Tabla Comparativa Punto por Punto</h2>

        <div className="overflow-x-auto rounded-2xl border-2 border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4">Característica</th>
                <th className="p-4">{b1.name}</th>
                <th className="p-4">{b2.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr>
                <td className="p-4 font-semibold">Tipo de IBAN</td>
                <td className="p-4">{b1.ibanPrefix} ({b1.ibanCountry})</td>
                <td className="p-4">{b2.ibanPrefix} ({b2.ibanCountry})</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Cuota mensual</td>
                <td className="p-4 font-bold text-primary">{b1.fees.monthly}</td>
                <td className="p-4 font-bold text-primary">{b2.fees.monthly}</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Garantía de Depósitos</td>
                <td className="p-4">{b1.compliance.depositGuarantee}</td>
                <td className="p-4">{b2.compliance.depositGuarantee}</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Soporte en Español</td>
                <td className="p-4">{b1.support.spanishSupport ? <Check className="h-5 w-5 text-emerald-500" /> : <X className="h-5 w-5 text-rose-500" />}</td>
                <td className="p-4">{b2.support.spanishSupport ? <Check className="h-5 w-5 text-emerald-500" /> : <X className="h-5 w-5 text-rose-500" />}</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Ideal para</td>
                <td className="p-4">{b1.idealFor}</td>
                <td className="p-4">{b2.idealFor}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pros y Contras */}
      <section className="mt-14 grid gap-8 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border-2 border-border p-6 bg-card">
          <h3 className="text-xl font-bold">{b1.name}: Ventajas y Desventajas</h3>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Ventajas:</p>
            <ul className="space-y-1.5 text-sm">
              {b1.keyPros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          {b1.keyCons.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-border/40">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-500">Desventajas:</p>
              <ul className="space-y-1.5 text-sm">
                {b1.keyCons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <X className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-2xl border-2 border-border p-6 bg-card">
          <h3 className="text-xl font-bold">{b2.name}: Ventajas y Desventajas</h3>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Ventajas:</p>
            <ul className="space-y-1.5 text-sm">
              {b2.keyPros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          {b2.keyCons.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-border/40">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-500">Desventajas:</p>
              <ul className="space-y-1.5 text-sm">
                {b2.keyCons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <X className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Veredicto Final */}
      <section className="mt-14 rounded-2xl border-2 border-primary bg-primary/5 p-8 text-foreground">
        <h2 className="text-2xl font-black tracking-tight">Veredicto Final: ¿Cuál elegir?</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Si buscas <strong>{b1.idealFor}</strong>, la mejor opción es <strong>{b1.name}</strong>. Por otro lado, si prefieres <strong>{b2.idealFor}</strong>, te recomendamos optar por <strong>{b2.name}</strong>. Ambos son bancos regulados y seguros en Europa.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          {b1.affiliateUrl && (
            <Button asChild className="gap-2">
              <a href={b1.affiliateUrl} target="_blank" rel="noreferrer noopener sponsored">
                Abrir cuenta en {b1.name} <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          )}
          {b2.affiliateUrl && (
            <Button asChild variant="outline" className="gap-2">
              <a href={b2.affiliateUrl} target="_blank" rel="noreferrer noopener sponsored">
                Abrir cuenta en {b2.name} <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </section>
    </>
  );
}
