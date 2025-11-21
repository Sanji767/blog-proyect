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
    openGraphImage?: string;   // ← AÑADIDO Y TIPADO
  };

  _lastUpdated: string;
  _affiliateCommission?: string;
  _priority?: number;
}

export const DOMAIN = "https://finanzaseu.com";

// ====================== BANCOS ======================
export const banks: Bank[] = [
  {
    slug: "revolut",
    name: "Revolut",
    shortName: "Revolut",
    tagline: "La cuenta multidivisa más usada en España en 2025",
    description:
      "Más de 45 millones de usuarios. Cambio al tipo real, cripto, acciones, tarjetas virtuales desechables y la mejor app del mercado.",

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
    ],

    logo: "/logos/revolut.svg",
    heroImage: "/heroes/revolut.webp",
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
      "Cambio de divisa sin comisiones",
      "Tarjetas virtuales ilimitadas",
      "Inversión en cripto y acciones",
      "App brutal con analíticas",
    ],
    keyCons: [
      "IBAN lituano (algunas nóminas lo rechazan)",
      "Soporte puede saturarse",
    ],
    idealFor: "Viajeros, freelancers, nómadas digitales y compras online",

    requirements: ["DNI/NIE/Pasaporte", "Selfie", "Mayor de 18"],
    acceptedCountries: [
      "España",
      "UE",
      "UK",
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
      depositGuarantee: "100.000 €",
      regulatedBy: ["Banco de Lituania", "BCE"],
    },

    website: "https://www.revolut.com/es-ES/",
    affiliateUrl: undefined,

    appStoreUrl: "https://apps.apple.com/es/app/revolut/id932493382",
    googlePlayUrl:
      "https://play.google.com/store/apps/details?id=com.revolut.revolut&hl=es",

    seo: {
      metaTitle: "Revolut España 2025: Opiniones reales y comisiones",
      metaDescription:
        "Análisis completo Revolut 2025: IBAN lituano, cambio real, cripto y todo lo que necesitas saber.",
      slug: "revolut",
      canonicalUrl: `${DOMAIN}/revolut`,
      keywords: [
        "revolut españa",
        "revolut 2025",
        "cuenta revolut",
        "iban lituano",
        "revolut opiniones",
      ],
      openGraphImage: "/og/revolut.webp",
    },

    _lastUpdated: "2025-11-20",
    _priority: 1,
  },

  {
    slug: "n26",
    name: "N26",
    tagline: "Banco alemán con IBAN DE · 100% gratis y seguro alemán",
    description:
      "Licencia bancaria alemana, app minimalista y seguro de depósitos hasta 100.000 €.",

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
    heroImage: "/heroes/n26.webp",
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
      atmEU: "3 gratis/mes",
      atmInternational: "1,7%",
      fxRate: "Tipo Mastercard",
    },

    cardType: "Mastercard",

    keyPros: ["IBAN alemán aceptado en todos lados", "Seguro alemán", "App limpia"],
    keyCons: ["Solo euros", "Límite retiradas gratis"],
    idealFor: "Cuenta principal en euros",

    requirements: ["DNI/NIE", "Residir en país admitido"],
    acceptedCountries: ["España", "Alemania", "Francia", "Italia", "+10 países UE"],

    rating: { trustpilot: 3.9, appStore: 4.7, googlePlay: 4.6 },

    compliance: {
      license: "BaFin Alemania",
      depositGuarantee: "100.000 €",
      regulatedBy: ["BaFin", "BCE"],
    },

    website: "https://n26.com/es-es/",

    seo: {
      metaTitle: "N26 España 2025: Opiniones, IBAN Alemán y Cuenta Gratis",
      metaDescription:
        "Todo sobre N26 en España: ventajas del IBAN alemán y cómo abrir cuenta gratis.",
      slug: "n26",
      canonicalUrl: `${DOMAIN}/n26`,
      keywords: ["n26 españa", "n26 2025", "iban alemán", "n26 opiniones"],
      openGraphImage: "/og/n26.webp",
    },

    _lastUpdated: "2025-11-20",
    _priority: 2,
  },

  {
    slug: "wise",
    name: "Wise",
    tagline:
      "Transferencias internacionales al cambio real · Cuenta multidivisa GRATIS",
    description:
      "La forma más barata de enviar dinero al extranjero. +16M clientes.",

    country: "Bélgica",
    headquarters: "Londres",
    ibanCountry: "Bélgica",
    ibanPrefix: "BE",

    category: "cuenta-multidivisa",
    tags: ["multidivisa", "para-freelancers", "no-residentes"],

    logo: "/logos/wise.svg",
    heroImage: "/heroes/wise.webp",
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
      atmEU: "2 gratis/mes hasta 200€",
      atmInternational: "1,75% + 0,50€",
      fxRate: "Tipo medio mercado",
    },

    cardType: "Mastercard",

    keyPros: [
      "Cambio real siempre",
      "Datos bancarios en 10 países",
      "Transparencia total",
    ],
    keyCons: ["No es banco completo", "Soporte solo escrito"],
    idealFor: "Freelancers, emigrantes, compras internacionales",

    requirements: ["DNI o pasaporte"],
    acceptedCountries: ["Todo el mundo"],

    rating: { trustpilot: 4.6 },

    compliance: {
      license: "Entidad de Dinero Electrónico",
      depositGuarantee: "Fondos salvaguardados",
      regulatedBy: ["NBB Bélgica", "FCA"],
    },

    website: "https://wise.com/es/",

    seo: {
      metaTitle: "Wise España 2025: Cuenta Multidivisa y Transferencias Baratas",
      metaDescription:
        "Comparativa Wise vs Revolut 2025. Comisiones reales y cómo abrir cuenta multidivisa gratis.",
      slug: "wise",
      canonicalUrl: `${DOMAIN}/wise`,
      keywords: ["wise españa", "wise 2025", "transferencias baratas", "cuenta wise"],
      openGraphImage: "/og/wise.webp",
    },

    _lastUpdated: "2025-11-20",
    _priority: 3,
  },

  {
    slug: "bunq",
    name: "Bunq",
    tagline: "25 subcuentas con IBAN propio · Ideal autónomos",
    description:
      "Banco holandés con licencia completa. Automatizaciones y herramientas premium.",

    country: "Países Bajos",
    headquarters: "Ámsterdam",
    ibanCountry: "Países Bajos",
    ibanPrefix: "NL",

    category: "neobanco",
    tags: ["tarjeta-fisica", "para-empresa", "iban-nl"],

    logo: "/logos/bunq.svg",
    heroImage: "/heroes/bunq.webp",
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
      "25 subcuentas con IBAN",
      "Automatizaciones",
      "Ideal separar gastos",
    ],
    keyCons: ["Sin plan gratis", "App solo inglés"],
    idealFor: "Autónomos, PYMEs, separación de finanzas",

    requirements: ["DNI/NIE", "Residir en UE"],
    acceptedCountries: ["Toda la UE"],

    rating: { trustpilot: 4.1 },

    compliance: {
      license: "Banco de Países Bajos",
      depositGuarantee: "100.000 €",
      regulatedBy: ["DNB"],
    },

    website: "https://www.bunq.com/es-es",

    seo: {
      metaTitle: "Bunq España 2025: Opiniones y 25 IBAN diferentes",
      metaDescription:
        "Análisis Bunq para autónomos en España: precios 2025 y subcuentas.",
      slug: "bunq",
      canonicalUrl: `${DOMAIN}/bunq`,
      keywords: ["bunq españa", "bunq 2025", "iban holandés", "bunq autónomos"],
      openGraphImage: "/og/bunq.webp",
    },

    _lastUpdated: "2025-11-20",
    _priority: 4,
  },
];
