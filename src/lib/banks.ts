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

const DEFAULT_LAST_UPDATED = "2026-03-07";

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
    seed.seo?.canonicalUrl ?? `${DOMAIN}/programas/${seed.slug}`;

  const seo: Bank["seo"] = {
    metaTitle:
      seed.seo?.metaTitle ??
      `${seed.name}: comisiones, IBAN ${seed.ibanPrefix} y opiniones (2026) | FinanzasEU`,
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
    _status: seed._status ?? "draft",
  };
}

// ====================== BANCOS ======================
export const banks: Bank[] = [
  {
    slug: "revolut",
    name: "Revolut",
    shortName: "Revolut",
    tagline: "Cuenta multidivisa líder con IBAN LT y app top en 2025",
    description:
      "Neobanco con licencia europea y más de 45M usuarios. Cambio al tipo real, tarjetas virtuales desechables, inversión en acciones y cripto, y una de las mejores apps bancarias.",

    country: "Lituania",
    headquarters: "Vilna",
    ibanCountry: "Lituania",
    ibanPrefix: "LT",

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
      "iban-lt",
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
      atmEU: "Gratis hasta 200 €/mes",
      atmInternational: "Gratis hasta 1.000 €/mes",
      fxRate: "Tipo interbancario (0% markup laborables)",
    },

    cardType: "Visa o Mastercard",

    keyPros: [
      "Cambio de divisa sin comisiones en días laborables",
      "Tarjetas virtuales ilimitadas y desechables",
      "Cuenta multidivisa con +25 monedas",
      "App completa con analíticas y control de gastos",
    ],
    keyCons: [
      "IBAN LT: algunas empresas antiguas aún ponen pegas",
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
      trustpilot: 4.3,
      appStore: 4.8,
      googlePlay: 4.7,
      totalReviews: 250000,
    },

    compliance: {
      license: "Licencia bancaria lituana",
      depositGuarantee: "100.000 € (Fondo lituano, SEPA)",
      regulatedBy: ["Banco de Lituania", "BCE"],
    },

    website: "https://www.revolut.com/es-ES/",
    appStoreUrl: "https://apps.apple.com/es/app/revolut/id932493382",
    googlePlayUrl:
      "https://play.google.com/store/apps/details?id=com.revolut.revolut&hl=es",

    seo: {
      metaTitle: "Revolut España 2025: comisiones, IBAN LT y opinión real",
      metaDescription:
        "Revolut en España 2025: cuenta gratis con IBAN LT, tarjetas físicas/virtuales, cambio real y app potente. Pros, contras y para quién merece la pena.",
      slug: "revolut",
      canonicalUrl: `${DOMAIN}/programas/revolut`,
      keywords: [
        "revolut españa 2025",
        "revolut iban lituano LT",
        "cuenta revolut gratis",
        "revolut comisiones cambio divisa",
        "tarjeta revolut virtual desechable",
        "revolut para viajar",
        "revolut opiniones",
        "revolut vs wise",
      ],
      openGraphImage: "/og/revolut.webp",
    },

    _lastUpdated: "2025-11-20",
    _priority: 1,
    _status: "published",
  },

  {
    slug: "n26",
    name: "N26",
    tagline: "Banco alemán con IBAN DE, cuenta gratis y seguro BaFin",
    description:
      "Banco 100% digital con licencia alemana. IBAN DE para todos los clientes, app sencilla, pagos móviles y depósitos protegidos hasta 100.000 €.",

    country: "Alemania",
    headquarters: "Berlín",
    ibanCountry: "Alemania",
    ibanPrefix: "DE",

    category: "neobanco",
    tags: [
      "sin-comisiones",
      "tarjeta-fisica",
      "no-residentes",
      "iban-de",
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
      monthly: "0 €",
      setup: "Gratis",
      inactivity: "Ninguna",
      atmEU: "3 retiradas gratis/mes",
      atmInternational: "1,7%",
      fxRate: "Tipo Mastercard",
    },

    cardType: "Mastercard",

    keyPros: [
      "IBAN DE aceptado en nóminas y domiciliaciones",
      "Cuenta sin cuota mensual",
      "Seguro de depósitos alemán (100.000 €)",
      "App directa y fácil de usar",
    ],
    keyCons: [
      "Solo permite operar en euros",
      "Retiradas gratis limitadas según plan",
    ],
    idealFor: "Cuenta principal en euros y nómina",

    requirements: ["DNI/NIE", "Residir en país admitido"],
    acceptedCountries: ["España", "Alemania", "Francia", "Italia", "+10 países UE"],

    rating: { trustpilot: 3.9, appStore: 4.7, googlePlay: 4.6 },

    compliance: {
      license: "Licencia bancaria alemana (BaFin)",
      depositGuarantee: "100.000 €",
      regulatedBy: ["BaFin", "BCE"],
    },

    website: "https://n26.com/es-es/",

    seo: {
      metaTitle: "N26 España 2025: IBAN DE, cuenta gratis y condiciones",
      metaDescription:
        "N26 en España 2025: cuenta online sin comisiones con IBAN alemán DE, tarjeta Mastercard y depósitos protegidos. Ventajas, límites y opinión.",
      slug: "n26",
      canonicalUrl: `${DOMAIN}/programas/n26`,
      keywords: [
        "n26 españa 2025",
        "n26 iban alemán DE",
        "cuenta n26 gratis",
        "n26 nómina españa",
        "tarjeta n26 mastercard",
        "n26 opiniones",
        "n26 vs revolut",
      ],
      openGraphImage: "/og/n26.webp",
    },

    _lastUpdated: "2025-11-20",
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

    currencies: ["EUR", "USD", "GBP", "AUD", "CAD", "+50 más"],

    support: {
      languages: ["Español", "Inglés", "+15"],
      channels: ["email", "help-center"],
      spanishSupport: true,
    },

    fees: {
      monthly: "Gratis",
      setup: "Gratis",
      inactivity: "Ninguna",
      atmEU: "2 retiradas gratis/mes hasta 200 €",
      atmInternational: "1,75% + 0,50€",
      fxRate: "Tipo medio de mercado",
    },

    cardType: "Mastercard",

    keyPros: [
      "Comisiones muy bajas en transferencias",
      "Tipo de cambio real sin margen oculto",
      "Datos bancarios locales en 10 países",
      "Muy útil para cobrar y pagar en varias divisas",
    ],
    keyCons: [
      "No es un banco completo para nómina",
      "Soporte principalmente por email",
    ],
    idealFor: "Freelancers, expatriados y pagos internacionales",

    requirements: ["DNI o pasaporte"],
    acceptedCountries: ["La mayoría del mundo (excepto países restringidos)"],

    rating: { trustpilot: 4.6 },

    compliance: {
      license: "Entidad de Dinero Electrónico (EMI)",
      depositGuarantee: "Fondos salvaguardados",
      regulatedBy: ["NBB Bélgica", "FCA Reino Unido"],
    },

    website: "https://wise.com/es/",

    seo: {
      metaTitle: "Wise España 2025: comisiones, IBAN BE y cuenta multidivisa",
      metaDescription:
        "Wise 2025 en España: cuenta multidivisa gratis con IBAN belga BE, cambio real y transferencias baratas. Pros, contras y para quién es ideal.",
      slug: "wise",
      canonicalUrl: `${DOMAIN}/programas/wise`,
      keywords: [
        "wise españa 2025",
        "wise iban belga BE",
        "cuenta wise multidivisa",
        "wise comisiones transferencias",
        "wise tarjeta para viajar",
        "wise opiniones",
        "wise vs revolut",
      ],
      openGraphImage: "/og/wise.webp",
    },

    _lastUpdated: "2025-11-20",
    _priority: 3,
    _status: "published",
  },

  {
    slug: "bunq",
    name: "Bunq",
    tagline: "Banco holandés con IBAN NL y subcuentas para autónomos",
    description:
      "Banco digital neerlandés con licencia completa. Permite subcuentas con IBAN propio, automatizaciones y herramientas para gestionar gastos personales o de empresa.",

    country: "Países Bajos",
    headquarters: "Ámsterdam",
    ibanCountry: "Países Bajos",
    ibanPrefix: "NL",

    category: "neobanco",
    tags: ["tarjeta-fisica", "para-empresa", "iban-nl"],

    logo: "/logos/bunq.svg",
    heroImage: "/logos/bunq-hero.webp",
    cardImage: "/logos/bunq.svg",

    currencies: ["EUR"],

    support: {
      languages: ["Inglés", "Holandés", "Alemán", "Francés"],
      channels: ["chat", "email"],
      spanishSupport: false,
    },

    fees: {
      monthly: "desde 2,99 €/mes",
      setup: "Gratis",
      inactivity: "Ninguna",
      atmEU: "Según plan",
      atmInternational: "Según plan",
      fxRate: "Tipo Mastercard",
    },

    cardType: "Mastercard",

    keyPros: [
      "Hasta 25 subcuentas con IBAN (según plan)",
      "Automatizaciones y reglas inteligentes",
      "Ideal para separar gastos y presupuestos",
    ],
    keyCons: [
      "No tiene plan completamente gratis",
      "App y soporte principalmente en inglés",
    ],
    idealFor: "Autónomos, PYMEs y gestión por subcuentas",

    requirements: ["DNI/NIE", "Residir en UE"],
    acceptedCountries: ["Toda la UE"],

    rating: { trustpilot: 4.1 },

    compliance: {
      license: "Licencia bancaria neerlandesa",
      depositGuarantee: "100.000 €",
      regulatedBy: ["DNB", "BCE"],
    },

    website: "https://www.bunq.com/es-es",

    seo: {
      metaTitle: "Bunq España 2025: precio, IBAN NL y subcuentas",
      metaDescription:
        "Bunq en España 2025: banco holandés con IBAN NL, subcuentas con IBAN propio y automatizaciones. Precios, ventajas y opinión.",
      slug: "bunq",
      canonicalUrl: `${DOMAIN}/programas/bunq`,
      keywords: [
        "bunq españa 2025",
        "bunq iban holandés NL",
        "bunq subcuentas con iban",
        "bunq para autónomos",
        "bunq precios 2025",
        "bunq opiniones",
      ],
      openGraphImage: "/og/bunq.webp",
    },

    _lastUpdated: "2025-11-20",
    _priority: 4,
    _status: "published",
  },

  // ====================== ESPAÑA (publicadas) ======================
  createDraftBank({
    slug: "santander",
    name: "Banco Santander",
    shortName: "Santander",
    tagline: "Banco español con IBAN ES, app completa y oferta amplia",
    description:
      "Banco tradicional español con presencia internacional. Ofrece cuentas, tarjetas y servicios para particulares y empresas; las condiciones varían según el producto.",
    country: "España",
    headquarters: "Madrid",
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
    tagline: "Banco europeo con cuenta en España (IBAN ES) y operativa online",
    description:
      "Banco europeo con operativa online en España. Oferta de cuentas y tarjetas orientada a gestión digital; condiciones y comisiones dependen del plan.",
    country: "España",
    headquarters: "Madrid",
    ibanCountry: "España",
    ibanPrefix: "ES",
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
      license: "Banco (licencia europea)",
      depositGuarantee: "Hasta 100.000 € (según esquema aplicable)",
      regulatedBy: ["BCE", "Regulador local"],
    },
    _priority: 24,
    _status: "published",
  }),

  // ====================== ESPAÑA (en revisión) ======================
  createDraftBank({
    slug: "sabadell",
    name: "Banco Sabadell",
    shortName: "Sabadell",
    tagline: "Banco español con IBAN ES y cuentas para particulares/empresa",
    country: "España",
    headquarters: "Alicante",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "tradicional",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.bancsabadell.com",
    _priority: 900,
  }),

  createDraftBank({
    slug: "bankinter",
    name: "Bankinter",
    shortName: "Bankinter",
    tagline: "Banco español con IBAN ES y oferta para ahorro e inversión",
    country: "España",
    headquarters: "Madrid",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "tradicional",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.bankinter.com",
    _priority: 901,
  }),

  createDraftBank({
    slug: "abanca",
    name: "Abanca",
    shortName: "Abanca",
    tagline: "Banco español con IBAN ES y presencia fuerte en el noroeste",
    country: "España",
    headquarters: "A Coruña",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "tradicional",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.abanca.com",
    _priority: 902,
  }),

  createDraftBank({
    slug: "unicaja",
    name: "Unicaja",
    shortName: "Unicaja",
    tagline: "Banco español con IBAN ES y servicios para particulares",
    country: "España",
    headquarters: "Málaga",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "tradicional",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.unicajabanco.es",
    _priority: 903,
  }),

  createDraftBank({
    slug: "cajamar",
    name: "Cajamar",
    shortName: "Cajamar",
    tagline: "Caja cooperativa con IBAN ES y enfoque en banca minorista",
    country: "España",
    headquarters: "Almería",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "tradicional",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.cajamar.es",
    _priority: 904,
  }),

  createDraftBank({
    slug: "banca-march",
    name: "Banca March",
    shortName: "March",
    tagline: "Banco español con IBAN ES y enfoque premium (según producto)",
    country: "España",
    headquarters: "Palma",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "tradicional",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.bancamarch.es",
    _priority: 905,
  }),

  createDraftBank({
    slug: "evo",
    name: "EVO Banco",
    shortName: "EVO",
    tagline: "Banco digital en España con IBAN ES (según disponibilidad)",
    country: "España",
    headquarters: "Madrid",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "neobanco",
    tags: ["tarjeta-fisica", "espanol", "iban-es", "seguro-depositos"],
    website: "https://www.evobanco.com",
    _priority: 906,
  }),

  createDraftBank({
    slug: "myinvestor",
    name: "MyInvestor",
    shortName: "MyInvestor",
    tagline: "Plataforma fintech con cuenta e inversión (según producto)",
    country: "España",
    headquarters: "Madrid",
    ibanCountry: "España",
    ibanPrefix: "ES",
    category: "fintech",
    tags: ["espanol", "iban-es"],
    website: "https://myinvestor.es",
    keyPros: [
      "Enfoque en inversión y ahorro",
      "Operativa online",
      "Alternativa para usuarios que invierten a largo plazo",
    ],
    keyCons: ["No es un banco tradicional", "Condiciones dependen del producto"],
    idealFor: "Ahorro e inversión con enfoque digital",
    _priority: 920,
  }),

  // ====================== FINTECH / NEGOCIOS (en revisión) ======================
  createDraftBank({
    slug: "qonto",
    name: "Qonto",
    shortName: "Qonto",
    tagline: "Cuenta para empresa/autónomos con herramientas de gestión",
    country: "Francia",
    headquarters: "París",
    ibanCountry: "Francia",
    ibanPrefix: "FR",
    category: "fintech",
    tags: ["para-empresa"],
    website: "https://qonto.com",
    keyPros: [
      "Herramientas de facturación y gastos",
      "Pensado para empresa/autónomos",
      "Gestión multiusuario",
    ],
    keyCons: ["No es una cuenta personal", "Precio según plan"],
    idealFor: "Autónomos y pymes que quieren orden contable",
    fees: {
      monthly: "Desde X €/mes (según plan)",
      setup: "Según plan",
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
    tagline: "Fintech alemana para ahorro/inversión con operativa digital",
    country: "Alemania",
    headquarters: "Berlín",
    ibanCountry: "Alemania",
    ibanPrefix: "DE",
    category: "fintech",
    tags: ["iban-de", "sin-comisiones"],
    website: "https://traderepublic.com",
    keyPros: [
      "Enfoque en inversión y ahorro",
      "App simple",
      "Costes competitivos (según producto)",
    ],
    keyCons: [
      "No es un banco tradicional para operativa diaria",
      "Condiciones pueden cambiar por país",
    ],
    idealFor: "Inversores principiantes que buscan simplicidad",
    fees: {
      monthly: "0 € (según producto)",
      setup: "Gratis",
      inactivity: "Ninguna (según producto)",
      atmEU: "Según tarjeta/condiciones",
      atmInternational: "Según tarjeta/condiciones",
      fxRate: "Según entidad",
    },
    acceptedCountries: ["UE (según disponibilidad)"],
    _priority: 931,
  }),

  // ====================== EUROPA (en revisión / directorio) ======================
  createDraftBank({
    slug: "bnp-paribas",
    name: "BNP Paribas",
    shortName: "BNP Paribas",
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
    tagline: "Banco austriaco con foco minorista en Europa Central",
    country: "Austria",
    headquarters: "Viena",
    ibanCountry: "Austria",
    ibanPrefix: "AT",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://www.erstegroup.com",
    acceptedCountries: ["Austria", "UE (según producto)"],
    _priority: 990,
  }),

  createDraftBank({
    slug: "raiffeisen",
    name: "Raiffeisen Bank",
    shortName: "Raiffeisen",
    tagline: "Grupo bancario cooperativo (según país y entidad)",
    country: "Austria",
    headquarters: "Viena",
    ibanCountry: "Austria",
    ibanPrefix: "AT",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://www.rbinternational.com",
    acceptedCountries: ["Austria", "UE (según entidad)"],
    _priority: 991,
  }),

  createDraftBank({
    slug: "ubs",
    name: "UBS",
    shortName: "UBS",
    tagline: "Banco suizo con oferta amplia (según país)",
    country: "Suiza",
    headquarters: "Zúrich",
    ibanCountry: "Suiza",
    ibanPrefix: "CH",
    category: "tradicional",
    tags: ["tarjeta-fisica"],
    website: "https://www.ubs.com",
    acceptedCountries: ["Suiza", "UE (según producto)"],
    _priority: 992,
  }),

  createDraftBank({
    slug: "nordea",
    name: "Nordea",
    shortName: "Nordea",
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
    tagline: "Banco danés con cuentas y tarjetas (según país)",
    country: "Dinamarca",
    headquarters: "Copenhague",
    ibanCountry: "Dinamarca",
    ibanPrefix: "DK",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://danskebank.com",
    acceptedCountries: ["Dinamarca", "UE (según producto)"],
    _priority: 994,
  }),

  createDraftBank({
    slug: "cgd",
    name: "Caixa Geral de Depósitos",
    shortName: "CGD",
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
    tagline: "Banco portugués con servicios minoristas (según producto)",
    country: "Portugal",
    headquarters: "Oporto",
    ibanCountry: "Portugal",
    ibanPrefix: "PT",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos"],
    website: "https://ind.millenniumbcp.pt",
    acceptedCountries: ["Portugal", "UE (según producto)"],
    _priority: 996,
  }),

  createDraftBank({
    slug: "triodos",
    name: "Triodos Bank",
    shortName: "Triodos",
    tagline: "Banco con enfoque en finanzas sostenibles (según país)",
    country: "Países Bajos",
    headquarters: "Driebergen-Rijsenburg",
    ibanCountry: "Países Bajos",
    ibanPrefix: "NL",
    category: "tradicional",
    tags: ["tarjeta-fisica", "seguro-depositos", "iban-nl"],
    website: "https://www.triodos.com",
    acceptedCountries: ["UE (según país)"],
    _priority: 997,
  }),
];
