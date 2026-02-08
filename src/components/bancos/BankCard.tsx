// src/components/banks/BankCard.tsx
import Image from "next/image";
import Link from "next/link";
import { type Bank } from "@/lib/banks";

type BankCardProps = {
  bank: Bank;
  showDirectLink?: boolean;
};

// Mapeamos todas las categorías posibles del tipo Bank["category"]
const CATEGORY_LABEL: Record<Bank["category"], string> = {
  neobanco: "Neobanco",
  tradicional: "Banco tradicional",
  "cuenta-multidivisa": "Cuenta multidivisa",
  fintech: "Fintech",
};

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
    "iban-es": "IBAN ES",
    "iban-de": "IBAN DE",
    "iban-nl": "IBAN NL",
    // ✅ nuevos tags soportados
    "iban-lt": "IBAN LT",
    "iban-be": "IBAN BE",
    "seguro-depositos": "Garantía de depósitos",
    "soporte-24-7": "Soporte 24/7",
  };

  return map[tag] ?? tag;
}

function getLogoSrc(logo: Bank["logo"]): string {
  // Si en tu tipo Bank["logo"] ya es string, esto es básicamente un cast seguro
  return logo as string;
}

export default function BankCard({
  bank,
  showDirectLink = true,
}: BankCardProps) {
  const detailUrl = `/programas/${bank.slug}`;
  const logoSrc = getLogoSrc(bank.logo);

  // Adaptado al nuevo modelo: fees está agrupado
  const monthlyFee = bank.fees.monthly;
  const atmInfo = `${bank.fees.atmEU} · Intl: ${bank.fees.atmInternational}`;

  const hasAffiliate = Boolean(bank.affiliateUrl);

  return (
    <article className="group flex flex-col rounded-3xl border border-border bg-background p-5 shadow-card transition-transform duration-200 hover:-translate-y-1 hover:shadow-soft">
      {/* Cabecera: logo + nombre */}
      <header className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-hero-background md:h-12 md:w-12">
          <Image
            src={logoSrc}
            alt={bank.name}
            fill
            sizes="48px"
            className="object-contain p-1"
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{bank.name}</h3>
          <p className="text-xs text-muted-foreground">
            {bank.country}
            {/* ✅ mostramos prefijo real del IBAN */}
            {bank.ibanPrefix && ` · IBAN ${bank.ibanPrefix}`}
          </p>
        </div>
      </header>

      {/* Tagline */}
      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
        {bank.tagline}
      </p>

      {/* Chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {/* Categoría */}
        <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-medium">
          {CATEGORY_LABEL[bank.category] ?? bank.category}
        </span>

        {/* Tags principales */}
        {bank.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full border border-border bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
          >
            {formatTag(tag)}
          </span>
        ))}

        {/* “+X” si hay más tags */}
        {bank.tags.length > 3 && (
          <span className="inline-flex items-center rounded-full border border-dashed border-border bg-background px-2.5 py-0.5 text-[11px] text-muted-foreground">
            +{bank.tags.length - 3}
          </span>
        )}
      </div>

      {/* Datos rápidos */}
      <dl className="mt-4 grid grid-cols-1 gap-2 text-xs">
        <InfoRow label="Cuota" value={monthlyFee} />
        <InfoRow label="Tarjeta" value={bank.cardType} />
        <InfoRow label="Cajeros" value={atmInfo} />
      </dl>

      {/* CTA */}
      <div className="mt-5 flex flex-col gap-2">
        <Link
          href={detailUrl}
          className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-black shadow-soft group-hover:brightness-105"
        >
          Ver detalles y cómo abrirla →
        </Link>

        {showDirectLink && hasAffiliate && (
          <a
            href={bank.affiliateUrl}
            data-analytics="affiliate"
            data-affiliate-partner={bank.slug}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-[11px] font-medium text-muted-foreground hover:bg-background/60"
          >
            Ir directamente a {bank.name}
          </a>
        )}
      </div>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="text-[11px] font-medium text-right text-foreground">
        {value}
      </dd>
    </div>
  );
}
