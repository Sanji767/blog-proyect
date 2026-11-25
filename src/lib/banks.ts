import { StaticImageData } from "next/image";

// ====================== TIPOS ======================
export type BankCategory =
  | "neobanco"
  | "tradicional"
  | "cuenta-multidivisa"
  | "fintech";

export type BankFeatureTag =
  | "sin-comisiones"
  | "tarjeta-fisica"
  | "tarjeta-virtual"
  | "multidivisa"
  | "crypto"
  | "para-freelancers"
  | "para-empresa"
  | "no-residentes"
  | "espanol"
  | "iban-es"
  | "iban-nl"
  | "iban-de"
  | "iban-lt"
  | "iban-be"
  | "seguro-depositos"
  | "soporte-24-7";

export interface Bank {
  slug: string;
  name: string;
  shortName?: string;
  tagline: string;
  description: string;

  country: string;
  headquarters: string;
  ibanCountry: string;
  ibanPrefix: string;
  // All local-IBAN country codes when the bank issues IBANs in several
  // countries (e.g. Revolut). Falls back to [ibanPrefix] when absent.
  ibanPrefixes?: string[];

  category: BankCategory;
  tags: BankFeatureTag[];

  logo: string | StaticImageData;
  heroImage?: string | StaticImageData;
  cardImage?: string | StaticImageData;

  currencies: string[];

  support: {
    languages: string[];
    channels: ("chat" | "email" | "phone" | "help-center")[];
    responseTime?: string;
    spanishSupport: boolean;
  };

  fees: {
    monthly: string;
    setup: string;
    inactivity: string;
    atmEU: string;
    atmInternational: string;
    fxRate: string;
    transfer?: string;
    cardReplacement?: string;
  };

  cardType: string;

  keyPros: string[];
  keyCons: string[];
  idealFor: string;

  requirements: string[];
  acceptedCountries: string[];

  rating: {
    trustpilot?: number;
    appStore?: number;
    googlePlay?: number;
    totalReviews?: number;
    trustpilotUrl?: string;
    ratingAsOf?: string; // ISO date the Trustpilot figure was checked
  };

  compliance: {
    license: string;
    depositGuarantee: string;
    regulatedBy: string[];
  };

  website: string;         // Enlace oficial
  affiliateUrl?: string;   // Enlace de afiliado opcional
  appStoreUrl?: string;
  googlePlayUrl?: string;

  seo: {
    metaTitle: string;
    metaDescription: string;
    slug: string;
    canonicalUrl: string;
    keywords: string[];
    openGraphImage?: string;
  };

  _lastUpdated: string;
  _affiliateCommission?: string;
  _priority?: number;
  _status?: "published" | "draft";
}

export const DOMAIN = "https://finanzaseu.com";

// All local-IBAN country codes for a bank (multi-country banks list every
// country where residents get a local IBAN; single-country banks fall back
// to their one prefix).
export function getIbanPrefixes(
  bank: Pick<Bank, "ibanPrefix" | "ibanPrefixes">,
): string[] {
  if (bank.ibanPrefixes && bank.ibanPrefixes.length > 0) {
    return bank.ibanPrefixes;
  }
  return bank.ibanPrefix && bank.ibanPrefix !== "—" ? [bank.ibanPrefix] : [];
}

// Compact prefix list for cards: "ES" or "ES · DE · FR · +9".
export function formatIbanPrefixes(
  bank: Pick<Bank, "ibanPrefix" | "ibanPrefixes">,
  max = 3,
): string {
  const prefixes = getIbanPrefixes(bank);
  if (prefixes.length === 0) return "";
  if (prefixes.length <= max) return prefixes.join(" · ");
  return `${prefixes.slice(0, max).join(" · ")} · +${prefixes.length - max}`;
}

// Display label after "IBAN ": the country name for single-IBAN banks
// (unchanged legacy rendering), the prefix list for multi-IBAN banks.
export function ibanDisplayLabel(
  bank: Pick<Bank, "ibanPrefix" | "ibanPrefixes" | "ibanCountry">,
  max = 3,
): string {
  const prefixes = getIbanPrefixes(bank);
  if (prefixes.length > 1) return formatIbanPrefixes(bank, max);
  return bank.ibanCountry ?? prefixes[0] ?? "";
}

const DEFAULT_LAST_UPDATED = "2026-11-20";

type DraftBankSeed = Pick<
  Bank,
  | "slug"
  | "name"
  | "tagline"
  | "country"
  | "headquarters"
  | "ibanCountry"
  | "ibanPrefix"
  | "category"
  | "tags"
  | "website"
> &
  Partial<
    Omit<
      Bank,
      | "slug"
      | "name"
      | "tagline"
      | "country"
      | "headquarters"
      | "ibanCountry"
      | "ibanPrefix"
      | "category"
      | "tags"
      | "website"
      | "seo"
      | "_lastUpdated"
    >
  > & {
    seo?: Partial<Bank["seo"]>;
    _lastUpdated?: string;
  };

function createDraftBank(seed: DraftBankSeed): Bank {
  const canonicalUrl =
    seed.seo?.canonicalUrl ?? `${DOMAIN}/bancos/${seed.slug}`;

  const seo: Bank["seo"] = {
    metaTitle:
      seed.seo?.metaTitle ??
      `${seed.name}: comisiones, IBAN ${seed.ibanPrefix} y opiniones (2026)`,
    metaDescription: seed.seo?.metaDescription ?? seed.tagline,
    slug: seed.slug,
    canonicalUrl,
    keywords:
      seed.seo?.keywords ?? [
        `${seed.name} opiniones`,
        `${seed.name} comisiones`,
        `cuenta ${seed.name}`,
        `IBAN ${seed.ibanPrefix}`,
      ],
    openGraphImage: seed.seo?.openGraphImage,
  };

  const spanishSupport =
    seed.support?.spanishSupport ??
    (seed.tags.includes("espanol") ||
      seed.country.toLowerCase() === "españa");

  const support: Bank["support"] =
    seed.support ?? {
      languages: spanishSupport ? ["Español"] : ["Inglés"],
      channels: ["help-center", "email"],
      spanishSupport,
    };

  const fees: Bank["fees"] =
    seed.fees ?? {
      monthly: "Desde 0 € (según condiciones)",
      setup: "Normalmente gratis (según cuenta)",
      inactivity: "Según cuenta",
      atmEU: "Según red/condiciones",
      atmInternational: "Según red/condiciones",
      fxRate: "Según entidad",
      transfer: "Según entidad",
      cardReplacement: "Según entidad",
    };

  const compliance: Bank["compliance"] =
    seed.compliance ?? {
      license: "Consulta la licencia en la web oficial",
      depositGuarantee: seed.tags.includes("seguro-depositos")
        ? "Hasta 100.000 € (según esquema aplicable)"
        : "Consulta la protección aplicable",
      regulatedBy:
        seed.ibanPrefix === "ES"
          ? ["Banco de España", "BCE"]
          : ["Regulador local", "BCE"],
    };

  return {
    slug: seed.slug,
    name: seed.name,
    shortName: seed.shortName,
    tagline: seed.tagline,
    description:
      seed.description ??
      `${seed.tagline} Consulta condiciones y disponibilidad en la web oficial.`,

    country: seed.country,
    headquarters: seed.headquarters,
    ibanCountry: seed.ibanCountry,
    ibanPrefix: seed.ibanPrefix,
    ibanPrefixes: seed.ibanPrefixes,

    category: seed.category,
    tags: seed.tags,

    logo: seed.logo ?? "/logos/generic-bank.svg",
    heroImage: seed.heroImage,
    cardImage: seed.cardImage,

    currencies: seed.currencies ?? ["EUR"],

    support,
    fees,

    cardType: seed.cardType ?? "Débito (según cuenta)",

    keyPros:
      seed.keyPros ?? [
        `IBAN ${seed.ibanPrefix}`,
        "Marca reconocida y operativa en Europa",
        "Apertura online u oficina (según cuenta)",
      ],
    keyCons:
      seed.keyCons ?? [
        "Condiciones y comisiones dependen del producto",
        "Requisitos de residencia pueden aplicar",
      ],
    idealFor: seed.idealFor ?? "Cuenta diaria en Europa",

    requirements: seed.requirements ?? ["DNI/NIE o pasaporte", "Mayor de 18 años"],
    acceptedCountries: seed.acceptedCountries ?? ["España", "UE (según entidad)"],

    rating: seed.rating ?? {},

    compliance,

    website: seed.website,
    affiliateUrl: seed.affiliateUrl,
    appStoreUrl: seed.appStoreUrl,
    googlePlayUrl: seed.googlePlayUrl,

    seo,

    _lastUpdated: seed._lastUpdated ?? DEFAULT_LAST_UPDATED,
    _affiliateCommission: seed._affiliateCommission,
    _priority: seed._priority,
    _status: seed._status ?? "published",
  };
}

// ====================== BANCOS ======================
export const banks: Bank[] = [
  {
    slug: "revolut",
    name: "Revolut",
    shortName: "Revolut",
    tagline: "Cuenta multidivisa líder con IBAN ES, Bizum y app de referencia",
    description:
      "Neobanco con licencia europea y más de 80M de clientes en todo el mundo. Cuenta con IBAN español, cambio al tipo real, hasta 20 tarjetas virtuales y 1 desechable, inversión en acciones y cripto, y una de las mejores apps bancarias.",

    country: "Lituania",
    headquarters: "Vilna",
    ibanCountry: "España",
    ibanPrefix: "ES",
    ibanPrefixes: ["ES", "BE", "CH", "DE", "FR", "IE", "IT", "LT", "NL", "PL", "PT", "RO"],

    category: "cuenta-multidivisa",
    tags: [
      "multidivisa",
      "tarjeta-fisica",
      "tarjeta-virtual",
      "sin-comisiones",
      "no-residentes",
      "crypto",
      "para-freelancers",
      "soporte-24-7",
      "espanol",
      "iban-es",
    ],

    logo: "/logos/revolut.svg",
    heroImage: "/images/logos/revolut-hero.webp",
    cardImage: "/logos/revolut.svg",

    currencies: ["EUR", "USD", "GBP", "CHF", "PLN", "AUD", "CAD", "+25 más"],

    support: {
      languages: [
        "Español",
        "Inglés",
        "Francés",
        "Alemán",
        "Italiano",
        "Portugués",
      ],
      channels: ["chat", "email"],
      responseTime: "2-5 minutos",
      spanishSupport: true,
    },

    fees: {
      monthly: "0 € (plan Estándar)",
      setup: "Gratis",
      inactivity: "Ninguna",
      atmEU: "Gratis hasta 200 €/mes o 5 retiradas",
      atmInternational: "Gratis hasta 200 €/mes o 5 retiradas (mismo límite global)",
      fxRate: "Tipo interbancario; gratis hasta 1.000 €/mes lun–vie (Estándar), +1% en fin de semana",
    },

    cardType: "Visa o Mastercard",

    keyPros: [
      "Cambio de divisa sin comisiones hasta 1.000 €/mes en días laborables (Estándar)",
      "Hasta 20 tarjetas virtuales y 1 tarjeta desechable de un solo uso",
      "Cuenta multidivisa con +25 monedas",
      "Cuenta Remunerada en España desde 1,15% TAE en el plan Estándar",
      "App completa con analíticas y control de gastos",
    ],
    keyCons: [
      "El plan Estándar limita el cambio gratis a 1.000 €/mes y cobra un 1% en fin de semana",
      "El soporte puede saturarse en horas punta",
    ],
    idealFor: "Viajeros, freelancers, nómadas digitales y compras online",

    requirements: ["DNI/NIE/Pasaporte", "Selfie", "Mayor de 18"],
    acceptedCountries: [
      "España",
      "UE",
      "Reino Unido",
      "EEUU",
      "Australia",
      "Canadá",
      "Singapur",
    ],

    rating: {
      trustpilot: 4.7,
      appStore: 4.8,
      googlePlay: 4.7,
      totalReviews: 497321,
      trustpilotUrl: "https://www.trustpilot.com/review/www.revolut.com",
      ratingAsOf: "2026-11-23",
    },

    compliance: {
      license: "Licencia bancaria lituana",
      depositGuarantee: "100.000 € (Fondo de Garantía de Depósitos lituano)",
      regulatedBy: ["Banco de Lituania", "BCE", "Banco de España"],
    },

    website: "https://www.revolut.com/es-ES/",
    appStoreUrl: "https://apps.apple.com/es/app/revolut/id932493382",
    googlePlayUrl:
      "https://play.google.com/store/apps/details?id=com.revolut.revolut&hl=es",

    seo: {
      metaTitle: "Revolut España 2026: comisiones, IBAN ES y opinión real",
      metaDescription:
        "Revolut en España 2026: cuenta gratis con IBAN ES, tarjetas físicas/virtuales, cambio real y app potente. Pros, contras y para quién merece la pena.",
      slug: "revolut",
      canonicalUrl: `${DOMAIN}/bancos/revolut`,
      keywords: [
        "revolut españa 2026",
        "revolut iban español ES",
        "cuenta revolut gratis",
        "revolut comisiones cambio divisa",
        "tarjeta revolut virtual desechable",
        "revolut para viajar",
        "revolut opiniones",
        "revolut vs wise",
      ],
      openGraphImage: "/og/revolut.webp",
    },

    _lastUpdated: "2026-11-20",
    _priority: 1,
    _status: "published",
  },

  {
    slug: "n26",
    name: "N26",
    tagline: "Banco alemán con IBAN ES, cuenta gratis y seguro BaFin",
    description:
      "Banco 100% digital con licencia alemana y más de 8M de clientes. IBAN español, app sencilla, Bizum, pagos móviles y depósitos protegidos hasta 100.000 €.",

    country: "Alemania",
    headquarters: "Berlín",
    ibanCountry: "España",
    ibanPrefix: "ES",
    ibanPrefixes: ["ES", "DE", "FR", "IT"],

    category: "neobanco",
    tags: [
      "sin-comisiones",
      "tarjeta-fisica",
      "no-residentes",
      "iban-es",
      "seguro-depositos",
      "espanol",
    ],

    logo: "/logos/n26.svg",
    heroImage: "/logos/n26-hero.webp",
    cardImage: "/logos/n26.svg",

    currencies: ["EUR"],

    support: {
      languages: ["Español", "Inglés", "Alemán", "Francés", "Italiano"],
      channels: ["chat", "phone"],
      spanishSupport: true,
    },

    fees: {
      monthly: "0 € (plan Estándar)",
      setup: "Gratis",
      inactivity: "Ninguna",
      atmEU: "Gratis e ilimitadas en euros en España",
      atmInternational: "1,7% (Estándar/Smart); gratis con Go y Metal",
      fxRate: "Tipo Mastercard, sin comisión en pagos con tarjeta",
    },

    cardType: "Mastercard",

    keyPros: [
      "IBAN ES aceptado en nóminas, domiciliaciones y Bizum",
      "Cuenta sin cuota mensual",
      "Seguro de depósitos alemán (100.000 €)",
      "App directa y fácil de usar",
    ],
    keyCons: [
      "Solo permite operar en euros",
      "Cuenta de ahorro al 0,50% TAE en Estándar (1,30% solo con Metal)",
    ],
    idealFor: "Cuenta principal en euros y nómina",

    requirements: ["DNI/NIE", "Residir en país admitido"],
    acceptedCountries: ["España", "Alemania", "Francia", "Italia", "+10 países UE"],

    rating: { trustpilot: 4.2, appStore: 4.7, googlePlay: 4.6 },

    compliance: {
      license: "Licencia bancaria alemana (BaFin)",
      depositGuarantee: "100.000 € (Fondo de Garantía de Depósitos alemán)",
      regulatedBy: ["BaFin", "BCE"],
    },

    website: "https://n26.com/es-es/",

    seo: {
      metaTitle: "N26 España 2026: IBAN ES, cuenta gratis y condiciones",
      metaDescription:
        "N26 en España 2026: cuenta online sin comisiones con IBAN español ES, tarjeta Mastercard y depósitos protegidos. Ventajas, límites y opinión.",
      slug: "n26",
      canonicalUrl: `${DOMAIN}/bancos/n26`,
      keywords: [
        "n26 españa 2026",
        "n26 iban español ES",
        "cuenta n26 gratis",
        "n26 nómina españa",
        "tarjeta n26 mastercard",
        "n26 opiniones",
        "n26 vs revolut",
      ],
      openGraphImage: "/og/n26.webp",
    },

    _lastUpdated: "2026-11-20",
    _priority: 2,
    _status: "published",
  },

  {
    slug: "wise",
    name: "Wise",
    tagline: "Cuenta multidivisa barata con IBAN BE y cambio real",
    description:
      "Fintech especializada en transferencias internacionales y cuentas multidivisa. Ofrece tipo de cambio real, datos bancarios locales en varios países y tarjeta para viajes.",

    country: "Bélgica",
    headquarters: "Londres",
    ibanCountry: "Bélgica",
    ibanPrefix: "BE",

    category: "cuenta-multidivisa",
    tags: ["multidivisa", "para-freelancers", "no-residentes", "iban-be"],

    logo: "/logos/wise.svg",
    heroImage: "/logos/wise-hero.webp",
    cardImage: "/logos/wise.svg",

    currencies: ["EUR", "USD", "GBP", "AUD", "CAD", "+35 más"],

    support: {
      languages: ["Español", "Inglés", "+15"],
      channels: ["email", "help-center"],
      spanishSupport: true,
    },

    fees: {
      monthly: "Gratis",
      setup: "Gratis",
      inactivity: "Ninguna",
      atmEU: "Gratis hasta 250 €/mes",
      atmInternational: "2,69% sobre el importe que supere los 250 €/mes",
      fxRate: "Tipo medio de mercado",
    },

    cardType: "Visa o Mastercard",

    keyPros: [
      "Comisiones muy bajas en transferencias",
      "Tipo de cambio real sin margen oculto",
      "Datos bancarios locales en más de 10 divisas",
      "Muy útil para cobrar y pagar en varias divisas",
      "Wise Interest: ~2,30% en EUR (variable, capital en riesgo)",
    ],
    keyCons: [
      "No es un banco completo para nómina",
      "Soporte principalmente por email",
    ],
    idealFor: "Freelancers, expatriados y pagos internacionales",

    requirements: ["DNI o pasaporte"],
    acceptedCountries: ["La mayoría del mundo (excepto países restringidos)"],

    rating: { trustpilot: 4.3 },

    compliance: {
      license: "Entidad de Dinero Electrónico (EMI)",
      depositGuarantee: "Fondos salvaguardados (sin garantía de depósitos)",
      regulatedBy: ["NBB Bélgica", "FCA Reino Unido"],
    },

    website: "https://wise.com/es/",

    seo: {
      metaTitle: "Wise España 2026: comisiones, IBAN BE y cuenta multidivisa",
      metaDescription:
        "Wise 2026 en España: cuenta multidivisa gratis con IBAN belga BE, cambio real y transferencias baratas. Pros, contras y para quién es ideal.",
      slug: "wise",
      canonicalUrl: `${DOMAIN}/bancos/wise`,
      keywords: [
        "wise españa 2026",
        "wise iban belga BE",
        "cuenta wise multidivisa",
        "wise comisiones transferencias",
        "wise tarjeta para viajar",
        "wise opiniones",
        "wise vs revolut",
      ],
      openGraphImage: "/og/wise.webp",
    },

    _lastUpdated: "2026-11-20",
    _priority: 3,
    _status: "published",
  },

  {
    slug: "bunq",
    name: "Bunq",
    tagline: "Banco holandés con IBAN NL y subcuentas para autónomos",
    description:
      "Banco digital neerlandés con licencia completa y plan gratuito. Permite subcuentas con IBAN propio, automatizaciones y herramientas para gestionar gastos personales o de empresa.",

    country: "Países Bajos",
    headquarters: "Ámsterdam",
    ibanCountry: "Países Bajos",
    ibanPrefix: "NL",
    ibanPrefixes: ["ES", "BE", "DE", "FR", "IE", "IT", "NL"],

    category: "neobanco",
    tags: ["tarjeta-fisica", "para-empresa", "iban-nl"],

    logo: "/logos/bunq.svg",
    heroImage: "/logos/bunq-hero.webp",
    cardImage: "/logos/bunq.svg",

    currencies: ["EUR", "USD", "GBP"],

    support: {
      languages: ["Inglés", "Holandés", "Alemán", "Francés"],
      channels: ["chat", "email"],
      spanishSupport: false,
    },

    fees: {
      monthly: "0 € (plan Free)",
      setup: "Gratis",
      inactivity: "Ninguna",
      atmEU: "Free: 2,99 €/retirada; Core: 0,99 € (5 primeras); Pro/Elite: 6 gratis/mes",
      atmInternational: "Igual que en la UE; +0,5% si hay conversión de divisa",
      fxRate: "Tipo Mastercard real + 0,5% (Free: hasta 1.000 €/año, luego 1,5%)",
    },

    cardType: "Mastercard",

    keyPros: [
      "Hasta 25 cuentas con IBAN propio (3 en Free, 5 en Core)",
      "Automatizaciones y reglas inteligentes",
      "Ideal para separar gastos y presupuestos",
    ],
    keyCons: [
      "Cajeros de pago en los planes Free y Core (2,99 € / 0,99 € por retirada)",
      "App y soporte principalmente en inglés",
    ],
    idealFor: "Autónomos, PYMEs y gestión por subcuentas",

    requirements: ["DNI/NIE", "Residir en UE"],
    acceptedCountries: ["Toda la UE"],

    rating: { trustpilot: 3.7 },

    compliance: {
      license: "Licencia bancaria neerlandesa",
      depositGuarantee: "100.000 € (Fondo de Garantía holandés, DNB)",
      regulatedBy: ["DNB", "BCE"],
    },

    website: "https://www.bunq.com/es-es",

    seo: {
      metaTitle: "Bunq España 2026: precio, IBAN NL y subcuentas",
      metaDescription:
        "Bunq en España 2026: banco holandés con IBAN NL, subcuentas con IBAN propio y automatizaciones. Precios, ventajas y opinión.",
      slug: "bunq",
      canonicalUrl: `${DOMAIN}/bancos/bunq`,
      keywords: [
        "bunq españa 2026",
        "bunq iban holandés NL",
        "bunq subcuentas con iban",
        "bunq para autónomos",
        "bunq precios 2026",
        "bunq opiniones",
      ],
      openGraphImage: "/og/bunq.webp",
    },

    _lastUpdated: "2026-11-20",
    _priority: 4,
    _status: "published",
  },

  // ====================== ESPAÑA (publicadas) ======================
  createDraftBank({
    slug: "santander",
    name: "Banco Santander",
    shortName: "Santander",
    logo: "/logos/santander.svg",
    tagline: "Banco español con IBAN ES, app completa y oferta amplia",
    description:
      "Banco tradicional español con presencia internacional. Ofrece cuentas, tarjetas y servicios para particulares y empresas; las condiciones varían según el producto.",
    country: "España",
    headquarters: "Santander",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "tradicional",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.bancosantander.es",
    fees: {
      monthly: "Desde 0 € (según cuenta y condiciones)",
      setup: "Normalmente gratis (según cuenta)",
      inactivity: "Según cuenta",
      atmEU: "Según red/condiciones",
      atmInternational: "Según red/condiciones",
      fxRate: "Según entidad",
    },
    cardType: "Débito y crédito (según cuenta)",
    keyPros: [
      "IBAN ES para nóminas y recibos",
      "Amplia red y oferta de productos",
      "App completa y banca online",
    ],
    keyCons: [
      "Comisiones y requisitos dependen de la cuenta",
      "Algunos planes exigen vinculación",
    ],
    idealFor: "Cuenta principal en España y operativa diaria",
    requirements: ["DNI/NIE o pasaporte", "Mayor de 18 años"],
    acceptedCountries: ["España", "UE (según cuenta)"],
    compliance: {
      license: "Banco (licencia española)",
      depositGuarantee: "Hasta 100.000 € (FGD España)",
      regulatedBy: ["Banco de España", "BCE"],
    },
    _priority: 20,
    _status: "published",
  }),

  createDraftBank({
    slug: "bbva",
    name: "BBVA",
    shortName: "BBVA",
    logo: "/logos/bbva.svg",
    tagline: "Banco español con IBAN ES y alta online (según cuenta)",
    description:
      "Entidad bancaria española con operativa digital avanzada. Ofrece cuentas, tarjetas y productos de ahorro/inversión; la disponibilidad y comisiones dependen del plan.",
    country: "España",
    headquarters: "Bilbao",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "tradicional",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.bbva.es",
    fees: {
      monthly: "Desde 0 € (según condiciones)",
      setup: "Normalmente gratis (según cuenta)",
      inactivity: "Según cuenta",
      atmEU: "Según red/condiciones",
      atmInternational: "Según red/condiciones",
      fxRate: "Según entidad",
    },
    cardType: "Débito y crédito (según cuenta)",
    keyPros: ["IBAN ES", "Buena app y banca online", "Oferta amplia en España"],
    keyCons: ["Requisitos variables", "Condiciones cambian por cuenta"],
    idealFor: "Cuenta diaria en España y gestión desde app",
    compliance: {
      license: "Banco (licencia española)",
      depositGuarantee: "Hasta 100.000 € (FGD España)",
      regulatedBy: ["Banco de España", "BCE"],
    },
    _priority: 21,
    _status: "published",
  }),

  createDraftBank({
    slug: "caixabank",
    name: "CaixaBank",
    shortName: "CaixaBank",
    logo: "/logos/caixabank.svg",
    tagline: "Banco español con IBAN ES, red amplia y opciones digitales",
    description:
      "Banco tradicional con fuerte presencia en España. Permite operativa desde app y web, además de amplia red; las comisiones dependen de la cuenta.",
    country: "España",
    headquarters: "Valencia",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "tradicional",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.caixabank.es",
    fees: {
      monthly: "Desde 0 € (según condiciones)",
      setup: "Normalmente gratis (según cuenta)",
      inactivity: "Según cuenta",
      atmEU: "Según red/condiciones",
      atmInternational: "Según red/condiciones",
      fxRate: "Según entidad",
    },
    cardType: "Débito y crédito (según cuenta)",
    keyPros: ["IBAN ES", "Red extensa en España", "App completa"],
    keyCons: ["Vinculación según cuenta", "Condiciones variables"],
    idealFor: "Cuenta principal con soporte presencial",
    compliance: {
      license: "Banco (licencia española)",
      depositGuarantee: "Hasta 100.000 € (FGD España)",
      regulatedBy: ["Banco de España", "BCE"],
    },
    _priority: 22,
    _status: "published",
  }),

  createDraftBank({
    slug: "openbank",
    name: "Openbank",
    shortName: "Openbank",
    logo: "/logos/openbank.svg",
    tagline: "Banco digital con IBAN ES y apertura 100% online (según cuenta)",
    description:
      "Banco digital orientado a operativa online. Suele encajar si priorizas gestión desde app/web; las condiciones y comisiones dependen del producto.",
    country: "España",
    headquarters: "Madrid",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "neobanco",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.openbank.es",
    fees: {
      monthly: "Desde 0 € (según condiciones)",
      setup: "Normalmente gratis (según cuenta)",
      inactivity: "Según cuenta",
      atmEU: "Según red/condiciones",
      atmInternational: "Según red/condiciones",
      fxRate: "Según entidad",
    },
    cardType: "Débito (según cuenta)",
    keyPros: ["IBAN ES", "Enfoque digital", "Operativa desde app/web"],
    keyCons: ["Condiciones cambian por producto", "Menos foco en multidivisa"],
    idealFor: "Cuenta online en España",
    compliance: {
      license: "Banco (licencia española)",
      depositGuarantee: "Hasta 100.000 € (FGD España)",
      regulatedBy: ["Banco de España", "BCE"],
    },
    _priority: 23,
    _status: "published",
  }),

  createDraftBank({
    slug: "ing",
    name: "ING",
    shortName: "ING",
    logo: "/logos/ing.svg",
    tagline: "Banco europeo con cuenta en España (IBAN ES) y operativa online",
    description:
      "Sucursal en España de ING Bank N.V. (Países Bajos), con operativa online. Oferta de cuentas y tarjetas orientada a gestión digital; los depósitos están cubiertos por el sistema de garantía neerlandés (DNB) hasta 100.000 €. Condiciones y comisiones dependen del plan.",
    country: "España",
    headquarters: "Madrid",
    ibanCountry: "España",
    ibanPrefix: "ES",
    ibanPrefixes: ["ES", "BE", "DE", "IT", "NL", "PL", "RO", "TR"],
    category: "tradicional",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.ing.es",
    fees: {
      monthly: "Desde 0 € (según condiciones)",
      setup: "Normalmente gratis (según cuenta)",
      inactivity: "Según cuenta",
      atmEU: "Según red/condiciones",
      atmInternational: "Según red/condiciones",
      fxRate: "Según entidad",
    },
    cardType: "Débito (según cuenta)",
    keyPros: ["IBAN ES", "Operativa digital", "Marca consolidada en Europa"],
    keyCons: ["Condiciones variables", "Oferta multidivisa limitada"],
    idealFor: "Cuenta diaria en España con gestión online",
    compliance: {
      license: "Sucursal en España de ING Bank N.V. (Países Bajos)",
      depositGuarantee: "Hasta 100.000 € (sistema de garantía de depósitos de Países Bajos, DNB)",
      regulatedBy: ["BCE", "De Nederlandsche Bank (DNB)", "Banco de España"],
    },
    _priority: 24,
    _status: "published",
  }),

  // ====================== ESPAÑA (en revisión) ======================
  createDraftBank({
    slug: "sabadell",
    name: "Banco Sabadell",
    shortName: "Sabadell",
    logo: "/logos/sabadell.svg",
    tagline: "Banco español con IBAN ES y cuentas para particulares/empresa",
    country: "España",
    headquarters: "Alicante",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "tradicional",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.bancsabadell.com",
    compliance: {
      license: "Banco (licencia española)",
      depositGuarantee: "Hasta 100.000 € (FGD España)",
      regulatedBy: ["Banco de España", "BCE"],
    },
    _priority: 900,
  }),

  createDraftBank({
    slug: "bankinter",
    name: "Bankinter",
    shortName: "Bankinter",
    logo: "/logos/bankinter.svg",
    tagline: "Banco español con IBAN ES y oferta para ahorro e inversión",
    country: "España",
    headquarters: "Madrid",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "tradicional",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.bankinter.com",
    compliance: {
      license: "Banco (licencia española)",
      depositGuarantee: "Hasta 100.000 € (FGD España)",
      regulatedBy: ["Banco de España", "BCE"],
    },
    _priority: 901,
  }),

  createDraftBank({
    slug: "abanca",
    name: "Abanca",
    shortName: "Abanca",
    logo: "/logos/abanca.svg",
    tagline: "Banco español con IBAN ES y presencia fuerte en el noroeste",
    country: "España",
    headquarters: "Betanzos (A Coruña)",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "tradicional",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.abanca.com",
    compliance: {
      license: "Banco (licencia española)",
      depositGuarantee: "Hasta 100.000 € (FGD España)",
      regulatedBy: ["Banco de España", "BCE"],
    },
    _priority: 902,
  }),

  createDraftBank({
    slug: "unicaja",
    name: "Unicaja",
    shortName: "Unicaja",
    logo: "/logos/unicaja.svg",
    tagline: "Banco español con IBAN ES y servicios para particulares",
    country: "España",
    headquarters: "Málaga",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "tradicional",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.unicajabanco.es",
    compliance: {
      license: "Banco (licencia española)",
      depositGuarantee: "Hasta 100.000 € (FGD España)",
      regulatedBy: ["Banco de España", "BCE"],
    },
    _priority: 903,
  }),

  createDraftBank({
    slug: "cajamar",
    name: "Cajamar",
    shortName: "Cajamar",
    logo: "/logos/cajamar.svg",
    tagline: "Caja cooperativa con IBAN ES y enfoque en banca minorista",
    country: "España",
    headquarters: "Almería",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "tradicional",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.cajamar.es",
    compliance: {
      license: "Cooperativa de crédito (licencia española)",
      depositGuarantee: "Hasta 100.000 € (FGD España)",
      regulatedBy: ["Banco de España", "BCE"],
    },
    _priority: 904,
  }),

  createDraftBank({
    slug: "banca-march",
    name: "Banca March",
    shortName: "March",
    logo: "/logos/banca-march.svg",
    tagline: "Banco español con IBAN ES y enfoque premium (según producto)",
    country: "España",
    headquarters: "Palma",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "tradicional",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.bancamarch.es",
    compliance: {
      license: "Banco (licencia española)",
      depositGuarantee: "Hasta 100.000 € (FGD España)",
      regulatedBy: ["Banco de España", "BCE"],
    },
    _priority: 905,
  }),

  createDraftBank({
    slug: "evo",
    name: "EVO Banco",
    shortName: "EVO",
    logo: "/logos/evo.svg",
    tagline: "Marca integrada en Bankinter desde 2025: ya no admite altas nuevas",
    description:
      "EVO Banco fue absorbido por Bankinter en abril de 2025 y dejó de operar como entidad independiente. Sus clientes pasaron a operar con Bankinter; ya no se pueden abrir cuentas nuevas bajo la marca EVO.",
    country: "España",
    headquarters: "Madrid",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "neobanco",
    tags: ["tarjeta-fisica", "espanol", "iban-es"],
    website: "https://www.bankinter.com",
    _priority: 906,
    _status: "draft",
  }),

  createDraftBank({
    slug: "myinvestor",
    name: "MyInvestor",
    shortName: "MyInvestor",
    logo: "/logos/myinvestor.svg",
    tagline: "Neobanco español con IBAN ES, cuenta remunerada e inversión",
    description:
      "Neobanco español especializado en inversión, respaldado por Grupo Andbank, El Corte Inglés Seguros y AXA. Ofrece cuenta remunerada, depósitos, fondos y carteras automatizadas; la remuneración y las condiciones dependen del producto y del momento.",
    country: "España",
    headquarters: "Madrid",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "neobanco",
    tags: ["espanol", "iban-es", "seguro-depositos"],
    website: "https://myinvestor.es",
    keyPros: [
      "Enfoque en inversión y ahorro",
      "Operativa online",
      "Alternativa para usuarios que invierten a largo plazo",
    ],
    keyCons: ["Sin oficinas físicas", "Condiciones dependen del producto"],
    idealFor: "Ahorro e inversión con enfoque digital",
    compliance: {
      license: "Banco (licencia española)",
      depositGuarantee: "Hasta 100.000 € (FGD España)",
      regulatedBy: ["Banco de España", "CNMV"],
    },
    _priority: 920,
  }),

  // ====================== FINTECH / NEGOCIOS (en revisión) ======================
  createDraftBank({
    slug: "qonto",
    name: "Qonto",
    shortName: "Qonto",
    logo: "/logos/qonto.svg",
    tagline: "Cuenta para empresa/autónomos con herramientas de gestión",
    country: "Francia",
    headquarters: "París",
    ibanCountry: "España",
    ibanPrefix: "ES",
    ibanPrefixes: ["ES", "DE", "FR", "IT", "NL"],
    category: "fintech",
    tags: ["para-empresa", "iban-es"],
    website: "https://qonto.com",
    keyPros: [
      "Herramientas de facturación y gastos",
      "Pensado para empresa/autónomos",
      "Gestión multiusuario",
    ],
    keyCons: ["No es una cuenta personal", "Precio según plan"],
    idealFor: "Autónomos y pymes que quieren orden contable",
    fees: {
      monthly: "0 € (plan Starter); desde 9 €/mes (sin IVA)",
      setup: "0 €",
      inactivity: "Según plan",
      atmEU: "Según plan",
      atmInternational: "Según plan",
      fxRate: "Según entidad",
    },
    acceptedCountries: ["UE (según plan)"],
    _priority: 930,
  }),

  createDraftBank({
    slug: "trade-republic",
    name: "Trade Republic",
    shortName: "Trade Republic",
    logo: "/logos/trade-republic.svg",
    tagline: "Banco alemán con cuenta remunerada, inversión y tarjeta en una sola app",
    description:
      "Banco alemán con licencia completa (BaFin) y sucursal en España, con IBAN español y Bizum. Remunera el efectivo al tipo del BCE (2,50%; nuevos clientes 4% hasta 20.000 € hasta el 1 de marzo de 2027). Planes de ahorro en ETF sin comisiones, órdenes a 1 € y tarjeta con 1% de Saveback.",
    country: "Alemania",
    headquarters: "Berlín",
    ibanCountry: "España",
    ibanPrefix: "ES",
    ibanPrefixes: ["ES", "DE", "FR", "IT", "PL"],
    category: "fintech",
    tags: ["iban-es", "sin-comisiones"],
    website: "https://traderepublic.com",
    keyPros: [
      "Enfoque en inversión y ahorro",
      "App simple",
      "Costes competitivos (según producto)",
    ],
    keyCons: [
      "Sin oficinas físicas",
      "Condiciones pueden cambiar por país",
    ],
    idealFor: "Inversores principiantes que buscan simplicidad",
    fees: {
      monthly: "0 €",
      setup: "Gratis",
      inactivity: "Ninguna",
      atmEU: "Según tarjeta/condiciones",
      atmInternational: "Según tarjeta/condiciones",
      fxRate: "Según entidad",
    },
    acceptedCountries: ["España", "Alemania", "Francia", "Italia", "Países Bajos", "Austria", "Bélgica", "Irlanda", "Portugal", "Finlandia", "Grecia", "Estonia", "Letonia", "Lituania", "Luxemburgo", "Eslovaquia", "Eslovenia", "Polonia"],
    compliance: {
      license: "Banco (licencia alemana, BaFin)",
      depositGuarantee: "Hasta 100.000 € (efectivo en bancos asociados)",
      regulatedBy: ["BaFin", "BCE"],
    },
    _priority: 931,
  }),

  // ====================== EUROPA (en revisión / directorio) ======================
  createDraftBank({
    slug: "bnp-paribas",
    name: "BNP Paribas",
    shortName: "BNP Paribas",
    logo: "/logos/bnp-paribas.svg",
    tagline: "Banco francés tradicional con oferta amplia en Europa",
    country: "Francia",
    headquarters: "París",
    ibanCountry: "Francia",
    ibanPrefix: "FR",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://group.bnpparibas",
    acceptedCountries: ["Francia", "UE (según producto)"],
    _priority: 980,
  }),

  createDraftBank({
    slug: "credit-agricole",
    name: "Crédit Agricole",
    shortName: "Crédit Agricole",
    logo: "/logos/credit-agricole.svg",
    tagline: "Banco francés cooperativo con presencia nacional",
    country: "Francia",
    headquarters: "Montrouge",
    ibanCountry: "Francia",
    ibanPrefix: "FR",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://www.credit-agricole.com",
    acceptedCountries: ["Francia", "UE (según producto)"],
    _priority: 981,
  }),

  createDraftBank({
    slug: "societe-generale",
    name: "Société Générale",
    shortName: "Société Générale",
    logo: "/logos/societe-generale.svg",
    tagline: "Banco francés tradicional con oferta para particulares y empresa",
    country: "Francia",
    headquarters: "París",
    ibanCountry: "Francia",
    ibanPrefix: "FR",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://www.societegenerale.com",
    acceptedCountries: ["Francia", "UE (según producto)"],
    _priority: 982,
  }),

  createDraftBank({
    slug: "unicredit",
    name: "UniCredit",
    shortName: "UniCredit",
    logo: "/logos/unicredit.svg",
    tagline: "Banco italiano/europeo con oferta amplia",
    country: "Italia",
    headquarters: "Milán",
    ibanCountry: "Italia",
    ibanPrefix: "IT",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://www.unicreditgroup.eu",
    acceptedCountries: ["Italia", "UE (según producto)"],
    _priority: 983,
  }),

  createDraftBank({
    slug: "intesa-sanpaolo",
    name: "Intesa Sanpaolo",
    shortName: "Intesa",
    logo: "/logos/intesa-sanpaolo.svg",
    tagline: "Banco italiano con foco en banca minorista",
    country: "Italia",
    headquarters: "Turín",
    ibanCountry: "Italia",
    ibanPrefix: "IT",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://group.intesasanpaolo.com",
    acceptedCountries: ["Italia", "UE (según producto)"],
    _priority: 984,
  }),

  createDraftBank({
    slug: "abn-amro",
    name: "ABN AMRO",
    shortName: "ABN AMRO",
    logo: "/logos/abn-amro.svg",
    tagline: "Banco neerlandés con cuentas en euros (según país)",
    country: "Países Bajos",
    headquarters: "Ámsterdam",
    ibanCountry: "Países Bajos",
    ibanPrefix: "NL",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://www.abnamro.com",
    acceptedCountries: ["Países Bajos", "UE (según producto)"],
    _priority: 985,
  }),

  createDraftBank({
    slug: "rabobank",
    name: "Rabobank",
    shortName: "Rabobank",
    logo: "/logos/rabobank.svg",
    tagline: "Banco cooperativo neerlandés (según disponibilidad)",
    country: "Países Bajos",
    headquarters: "Utrecht",
    ibanCountry: "Países Bajos",
    ibanPrefix: "NL",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://www.rabobank.com",
    acceptedCountries: ["Países Bajos", "UE (según producto)"],
    _priority: 986,
  }),

  createDraftBank({
    slug: "commerzbank",
    name: "Commerzbank",
    shortName: "Commerzbank",
    logo: "/logos/commerzbank.svg",
    tagline: "Banco alemán tradicional con cuentas en euros",
    country: "Alemania",
    headquarters: "Fráncfort",
    ibanCountry: "Alemania",
    ibanPrefix: "DE",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos", "iban-de"],
    website: "https://www.commerzbank.com",
    acceptedCountries: ["Alemania", "UE (según producto)"],
    _priority: 987,
  }),

  createDraftBank({
    slug: "dkb",
    name: "DKB",
    shortName: "DKB",
    logo: "/logos/dkb.svg",
    tagline: "Banco alemán con enfoque digital (según producto)",
    country: "Alemania",
    headquarters: "Berlín",
    ibanCountry: "Alemania",
    ibanPrefix: "DE",
    category: "neobanco",
    tags: ["tarjeta-fisica", "seguro-depositos", "iban-de"],
    website: "https://www.dkb.de",
    acceptedCountries: ["Alemania", "UE (según producto)"],
    _priority: 988,
  }),

  createDraftBank({
    slug: "deutsche-bank",
    name: "Deutsche Bank",
    shortName: "Deutsche Bank",
    logo: "/logos/deutsche-bank.svg",
    tagline: "Banco alemán con presencia internacional",
    country: "Alemania",
    headquarters: "Fráncfort",
    ibanCountry: "Alemania",
    ibanPrefix: "DE",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos", "iban-de"],
    website: "https://www.db.com",
    acceptedCountries: ["Alemania", "UE (según producto)"],
    _priority: 989,
  }),

  createDraftBank({
    slug: "erste-bank",
    name: "Erste Bank",
    shortName: "Erste",
    logo: "/logos/erste-bank.svg",
    tagline: "Banco austriaco con foco minorista",
    country: "Austria",
    headquarters: "Viena",
    ibanCountry: "Austria",
    ibanPrefix: "AT",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://www.erstebank.at",
    acceptedCountries: ["Austria", "UE (según producto)"],
    _priority: 990,
  }),

  createDraftBank({
    slug: "raiffeisen",
    name: "Raiffeisen Bank",
    shortName: "Raiffeisen",
    logo: "/logos/raiffeisen.svg",
    tagline: "Grupo bancario cooperativo (según país y entidad)",
    country: "Austria",
    headquarters: "Viena",
    ibanCountry: "Austria",
    ibanPrefix: "AT",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://www.raiffeisen.at",
    acceptedCountries: ["Austria", "UE (según entidad)"],
    _priority: 991,
  }),

  createDraftBank({
    slug: "ubs",
    name: "UBS",
    shortName: "UBS",
    logo: "/logos/ubs.svg",
    tagline: "Banco suizo con oferta amplia (según país)",
    country: "Suiza",
    headquarters: "Zúrich",
    ibanCountry: "Suiza",
    ibanPrefix: "CH",
    category: "tradicional",
    tags: ["tarjeta-fisica"],
    website: "https://www.ubs.com",
    acceptedCountries: ["Suiza", "UE (según producto)"],
    compliance: {
      license: "Consulta la licencia en la web oficial",
      depositGuarantee: "Hasta 100.000 CHF (esisuisse)",
      regulatedBy: ["FINMA"],
    },
    _priority: 992,
  }),

  createDraftBank({
    slug: "nordea",
    name: "Nordea",
    shortName: "Nordea",
    logo: "/logos/nordea.svg",
    tagline: "Banco nórdico con presencia en varios países (según producto)",
    country: "Finlandia",
    headquarters: "Helsinki",
    ibanCountry: "Finlandia",
    ibanPrefix: "FI",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://www.nordea.com",
    acceptedCountries: ["Países nórdicos", "UE (según producto)"],
    _priority: 993,
  }),

  createDraftBank({
    slug: "danske-bank",
    name: "Danske Bank",
    shortName: "Danske",
    logo: "/logos/danske-bank.svg",
    tagline: "Banco danés con cuentas y tarjetas (según país)",
    country: "Dinamarca",
    headquarters: "Copenhague",
    ibanCountry: "Dinamarca",
    ibanPrefix: "DK",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://danskebank.com",
    acceptedCountries: ["Dinamarca", "UE (según producto)"],
    compliance: {
      license: "Consulta la licencia en la web oficial",
      depositGuarantee: "Hasta 100.000 € (Garantiformuen)",
      regulatedBy: ["Finanstilsynet"],
    },
    _priority: 994,
  }),

  createDraftBank({
    slug: "cgd",
    name: "Caixa Geral de Depósitos",
    shortName: "CGD",
    logo: "/logos/cgd.svg",
    tagline: "Banco portugués tradicional (según producto)",
    country: "Portugal",
    headquarters: "Lisboa",
    ibanCountry: "Portugal",
    ibanPrefix: "PT",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://www.cgd.pt",
    acceptedCountries: ["Portugal", "UE (según producto)"],
    _priority: 995,
  }),

  createDraftBank({
    slug: "millennium-bcp",
    name: "Millennium bcp",
    shortName: "Millennium",
    logo: "/logos/millennium-bcp.svg",
    tagline: "Banco portugués con servicios minoristas (según producto)",
    country: "Portugal",
    headquarters: "Oporto",
    ibanCountry: "Portugal",
    ibanPrefix: "PT",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://www.millenniumbcp.pt",
    acceptedCountries: ["Portugal", "UE (según producto)"],
    _priority: 996,
  }),

  createDraftBank({
    slug: "triodos",
    name: "Triodos Bank",
    shortName: "Triodos",
    logo: "/logos/triodos.svg",
    tagline: "Banco ético con sucursal en España: cuentas con IBAN ES",
    country: "Países Bajos",
    headquarters: "Driebergen-Rijsenburg",
    ibanCountry: "Países Bajos",
    ibanPrefix: "NL",
    ibanPrefixes: ["NL", "ES"],
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos", "iban-nl", "iban-es", "espanol"],
    website: "https://www.triodos.com",
    acceptedCountries: ["España", "Países Bajos", "UE (según país)"],
    seo: {
      metaTitle: "Triodos Bank España: comisiones, IBAN ES y opiniones (2026)",
    },
    _priority: 997,
  }),

  createDraftBank({
    slug: "trading-212",
    name: "Trading 212",
    shortName: "Trading 212",
    logo: "/logos/trading212.svg",
    tagline: "Cuenta con remuneración diaria en efectivo e inversión sin comisiones",
    description: "Plataforma de inversión británica y europea con licencia FCA, CySEC y BaFin. Intereses diarios sobre el saldo no invertido (2,3% TAE en EUR, 4% en GBP; variable) y tarjeta de débito Mastercard sin comisión de cambio de divisa.",
    country: "Reino Unido / Chipre",
    headquarters: "Londres",
    ibanCountry: "No aplica",
    ibanPrefix: "—",
    category: "fintech",
    tags: ["sin-comisiones", "multidivisa", "crypto", "tarjeta-virtual", "tarjeta-fisica"],
    website: "https://www.trading212.com",
    acceptedCountries: ["España", "Unión Europea", "Reino Unido"],
    fees: {
      monthly: "0 €",
      setup: "0 €",
      inactivity: "0 €",
      atmEU: "Gratis hasta 400 €/mes",
      atmInternational: "1% (por encima de 400 €/mes)",
      fxRate: "0,15%",
    },
    rating: { trustpilot: 4.6, totalReviews: 108700 },
    compliance: {
      license: "Broker (FCA, CySEC, BaFin)",
      depositGuarantee: "Compensación al inversor hasta 20.000 € (ICF)",
      regulatedBy: ["FCA", "CySEC", "BaFin"],
    },
    seo: {
      metaTitle: "Trading 212: comisiones, intereses y opiniones (2026)",
      keywords: ["Trading 212 opiniones", "Trading 212 comisiones", "Trading 212 intereses", "Trading 212 tarjeta"],
    },
    _priority: 15,
  }),

  createDraftBank({
    slug: "freedom24",
    name: "Freedom24",
    shortName: "Freedom24",
    logo: "/logos/freedom24.svg",
    tagline: "Broker europeo cotizado en NASDAQ con cuenta D de alta rentabilidad",
    description: "Plataforma de inversión y ahorro regulada por CySEC. Ofrece la Cuenta D acumulativa con interés diario (2,42% anual en EUR y 3,92% en USD, variable según euríbor y SOFR) y depósitos a plazo con tipos superiores.",
    country: "Chipre",
    headquarters: "Limasol",
    ibanCountry: "Chipre",
    ibanPrefix: "CY",
    category: "fintech",
    tags: ["multidivisa"],
    website: "https://freedom24.com",
    acceptedCountries: ["España", "Unión Europea"],
    fees: {
      monthly: "0 €",
      setup: "0 €",
      inactivity: "0 €",
      atmEU: "No aplica",
      atmInternational: "No aplica",
      fxRate: "Mercado real",
    },
    compliance: {
      license: "Broker (CySEC, licencia 275/15)",
      depositGuarantee: "Compensación al inversor hasta 20.000 € (ICF)",
      regulatedBy: ["CySEC"],
    },
    _priority: 18,
  }),

  createDraftBank({
    slug: "plum",
    name: "Plum App",
    shortName: "Plum",
    logo: "/logos/plum.svg",
    tagline: "App inteligente de ahorro automático y bolsillos con interés",
    description: "Aplicación financiera que automatiza el ahorro mediante IA, permite invertir en acciones, ETF y criptomonedas, y ofrece Plum Interest, un fondo del mercado monetario con hasta un 1,12% anual en el plan gratuito (variable según el plan).",
    country: "Reino Unido / Grecia",
    headquarters: "Londres",
    ibanCountry: "No aplica",
    ibanPrefix: "—",
    category: "fintech",
    tags: ["sin-comisiones"],
    website: "https://withplum.com",
    acceptedCountries: ["España", "Francia", "Irlanda", "Reino Unido", "Portugal", "Italia", "Bélgica", "Países Bajos", "Grecia", "Chipre"],
    fees: {
      monthly: "0 € (plan Basic); planes de pago desde 3,99 €/mes",
      setup: "0 €",
      inactivity: "0 €",
      atmEU: "No aplica",
      atmInternational: "No aplica",
      fxRate: "No aplica",
    },
    rating: { trustpilot: 4.1, totalReviews: 9900 },
    compliance: {
      license: "Entidad de dinero electrónico (FCA)",
      depositGuarantee: "Fondos salvaguardados (sin garantía de depósitos)",
      regulatedBy: ["FCA"],
    },
    seo: {
      metaTitle: "Plum App: ahorro automático, intereses y opiniones (2026)",
      keywords: ["Plum opiniones", "Plum ahorro automático", "Plum intereses", "Plum app España"],
    },
    _priority: 22,
  }),

  createDraftBank({
    slug: "klarna",
    name: "Klarna Bank",
    shortName: "Klarna",
    logo: "/logos/klarna.svg",
    tagline: "Cuenta de ahorro flexible y gestión de compras inteligentes",
    description: "Banco sueco con cuenta Flex al 2,22% TAE (variable, sin mínimo ni comisiones), tarjeta Visa, cashback en compras y opciones de pago flexibles.",
    country: "Suecia",
    headquarters: "Estocolmo",
    ibanCountry: "Suecia",
    ibanPrefix: "SE",
    ibanPrefixes: ["SE", "DE"],
    category: "neobanco",
    tags: ["sin-comisiones", "seguro-depositos"],
    website: "https://www.klarna.com",
    acceptedCountries: ["España", "Alemania", "Suecia", "Unión Europea"],
    fees: {
      monthly: "0 €",
      setup: "0 €",
      inactivity: "0 €",
      atmEU: "No aplica",
      atmInternational: "No aplica",
      fxRate: "Sin comisión",
    },
    rating: { trustpilot: 4.5, totalReviews: 633500 },
    compliance: {
      license: "Banco (licencia sueca)",
      depositGuarantee: "Hasta 1.150.000 SEK (~103.800 €, sistema sueco)",
      regulatedBy: ["Finansinspektionen"],
    },
    _priority: 25,
  }),

  createDraftBank({
    slug: "sumup",
    name: "SumUp Pay & Business",
    shortName: "SumUp",
    logo: "/logos/sumup.svg",
    tagline: "Cuenta de empresa y autónomos con tarjeta de débito y cobro TPV",
    description: "Solución integral para autónomos y pequeñas empresas: cuenta con IBAN europeo, tarjeta Mastercard de empresa sin coste mensual, cobro con TPV y pagos inmediatos. La cuenta personal SumUp Pay añade cashback del 5% en comercios SumUp, 2% en supermercados y 0,5% en el resto.",
    country: "Alemania",
    headquarters: "Berlín",
    ibanCountry: "Irlanda / Lituania",
    ibanPrefix: "IE",
    ibanPrefixes: ["IE", "IT"],
    category: "fintech",
    tags: ["para-freelancers", "para-empresa", "sin-comisiones", "tarjeta-fisica"],
    website: "https://sumup.com",
    acceptedCountries: ["España", "Unión Europea"],
    fees: {
      monthly: "0 €",
      setup: "0 €",
      inactivity: "0 €",
      atmEU: "Gratis 3 retiradas/mes",
      atmInternational: "2%",
      fxRate: "Mastercard estándar",
    },
    rating: { trustpilot: 4.2, totalReviews: 61500 },
    compliance: {
      license: "Entidad de dinero electrónico",
      depositGuarantee: "Fondos salvaguardados (sin garantía de depósitos)",
      regulatedBy: ["Banco de Lituania", "Banco Central de Irlanda"],
    },
    _priority: 28,
  }),
];
