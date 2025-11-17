// src/app/bancos/page.tsx
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import Container from "@/components/layout/Container";
import { banks } from "@/lib/banks";
import type { Bank } from "@/lib/banks";

export const metadata: Metadata = {
  title: "Bancos recomendados | Bancos Europa",
  description:
    "Listado de bancos y cuentas recomendadas en Europa: neobancos, cuentas multidivisa y bancos para no residentes.",
};

export default function BancosPage() {
  // Ordenamos: primero los que tienen affiliateUrl (opcional)
  const sortedBanks = [...banks].sort((a, b) => {
    const aAff = a.affiliateUrl ? 1 : 0;
    const bAff = b.affiliateUrl ? 1 : 0;
    return bAff - aAff;
  });

  return (
    <section className="py-12 md:py-16">
      <Container className="space-y-10">
        {/* Encabezado */}
        <header className="space-y-4 text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Bancos recomendados
          </span>

          <h1 className="text-3xl md:text-4xl font-bold">
            Elige tu banco en Europa con{" "}
            <span className="text-primary">información clara</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground">
            Aquí tienes una selección de bancos digitales y tradicionales que
            permiten abrir cuenta online, muchos de ellos aptos para
            no residentes y nómadas digitales. Haz clic en cada banco para ver
            la ficha detallada y cómo abrir tu cuenta paso a paso.
          </p>
        </header>

        {/* Grid de bancos */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedBanks.map((bank) => (
            <BankCard key={bank.slug} bank={bank} />
          ))}
        </div>

        {/* Nota final */}
        <p className="text-xs md:text-sm text-muted-foreground text-center max-w-2xl mx-auto">
          La información sobre comisiones, requisitos y países admitidos puede
          cambiar con el tiempo. Siempre revisa los detalles en la web oficial
          del banco antes de abrir tu cuenta.
        </p>
      </Container>
    </section>
  );
}

// ============ COMPONENTE DE TARJETA ============

function BankCard({ bank }: { bank: Bank }) {
  const {
    slug,
    name,
    tagline,
    logo,
    country,
    ibanCountry,
    category,
    tags,
    fees,
    cardType,
    affiliateUrl,
  } = bank;

  const detailUrl = `/programas/${slug}`;
  const logoSrc =
    typeof logo === "string" ? logo : (logo as any);

  return (
    <article className="group flex flex-col rounded-3xl border border-border bg-background p-5 shadow-card hover:shadow-soft hover:-translate-y-1 transition-transform duration-200">
      {/* Logo + nombre */}
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 md:h-12 md:w-12 rounded-xl bg-hero-background flex items-center justify-center">
          <Image
            src={logoSrc}
            alt={name}
            fill
            className="object-contain p-1"
            sizes="48px"
          />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold truncate">{name}</h2>
          <p className="text-xs text-muted-foreground">
            {country}
            {ibanCountry && ` · IBAN ${ibanCountry}`}
          </p>
        </div>
      </div>

      {/* Tagline */}
      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
        {tagline}
      </p>

      {/* Chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        <CategoryBadge category={category} />
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-primary/8 border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
          >
            {formatTag(tag)}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="inline-flex items-center rounded-full bg-background px-2.5 py-0.5 text-[11px] text-muted-foreground border border-dashed border-border">
            +{tags.length - 3}
          </span>
        )}
      </div>

      {/* Info rápida */}
      <dl className="mt-4 grid grid-cols-1 gap-2 text-xs">
        <InfoRow label="Cuota" value={fees.monthly} />
        <InfoRow label="Tarjeta" value={cardType} />
      </dl>

      {/* CTA */}
      <div className="mt-5 flex flex-col gap-2">
        <Link
          href={detailUrl}
          className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-black shadow-soft group-hover:brightness-105 transition"
        >
          Ver detalles y cómo abrirla →
        </Link>

        {affiliateUrl && (
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-[11px] font-medium text-muted-foreground hover:bg-background/60"
          >
            Ir directamente a {name}
          </a>
        )}
      </div>
    </article>
  );
}

// ============ COMPONENTES AUXILIARES ============

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="text-[11px] font-medium text-foreground text-right">
        {value}
      </dd>
    </div>
  );
}

function CategoryBadge({ category }: { category: Bank["category"] }) {
  const labelMap: Record<Bank["category"], string> = {
    neobanco: "Neobanco",
    tradicional: "Banco tradicional",
    "cuenta-multidivisa": "Cuenta multidivisa",
    fintech: "Fintech",
  };

  return (
    <span className="inline-flex items-center rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium border border-border">
      {labelMap[category] ?? category}
    </span>
  );
}

function formatTag(tag: Bank["tags"][number]): string {
  const map: Record<string, string> = {
    "sin-comisiones": "Sin comisiones",
    "tarjeta-fisica": "Tarjeta física",
    "tarjeta-virtual": "Tarjeta virtual",
    multidivisa: "Multidivisa",
    crypto: "Cripto",
    "para-freelancers": "Para freelancers",
    "para-empresa": "Para empresa",
    "no-residentes": "Acepta no residentes",
    espanol: "App/soporte en español",
  };
  return map[tag] ?? tag;
}
