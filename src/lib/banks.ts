// src/lib/banks.ts
import { StaticImageData } from "next/image";

// === TIPOS AVANZADOS ===
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

export interface BankFAQ {
  question: string;
  answer: string;
  keywords?: string[];
}

export interface BankRating {
  trustpilot?: number;
  appStore?: number;
  googlePlay?: number;
  totalReviews?: number;
}

export interface BankFees {
  monthly: string;
  setup: string;
  inactivity: string;
  atmEU: string;
  atmInternational: string;
  fxRate: string;
  // Opcionales extra para tabla de tarifas
  transfer?: string;
  cardReplacement?: string;
}

export interface BankSupport {
  languages: string[];
  channels: ("chat" | "email" | "phone" | "help-center")[];
  responseTime?: string;
  spanishSupport: boolean;
}

export interface BankCompliance {
  license: string;
  depositGuarantee: string;
  regulatedBy: string[];
}

export interface BankSEO {
  metaTitle: string;
  metaDescription: string;
  slug: string;
  canonicalUrl: string;
  openGraphImage?: string;
  keywords: string[];
}

// Bloques de contenido extra / EEAT
export interface BankExpertOpinion {
  summary: string;
  recommendedFor: string[];
  notFor?: string[];
}

export interface BankHistoryItem {
  year: number;
  event: string;
}

export interface BankReview {
  author: string;
  rating: number; // 1-5
  text: string;
  source?: string;
}

export interface Bank {
  // === IDENTIDAD ===
  slug: string;
  name: string;
  shortName?: string;
  tagline: string;
  description: string;

  // === UBICACIÓN ===
  country: string;
  headquarters: string;
  ibanCountry: string;
  ibanPrefix: string;

  // === CLASIFICACIÓN ===
  category: BankCategory;
  tags: BankFeatureTag[];

  // === IMÁGENES ===
  logo: string | StaticImageData;
  heroImage?: string | StaticImageData;
  cardImage?: string | StaticImageData;
  appScreenshot?: string | StaticImageData;

  // === DIVISAS Y SOPORTE ===
  currencies: string[];
  support: BankSupport;

  // === TARIFAS ===
  fees: BankFees;
  cardType: string;

  // === VENTAJAS / DESVENTAJAS ===
  keyPros: string[];
  keyCons: string[];
  idealFor: string;

  // === REQUISITOS ===
  requirements: string[];
  acceptedCountries: string[];

  // === CALIFICACIONES ===
  rating: BankRating;

  // === CUMPLIMIENTO ===
  compliance: BankCompliance;

  // === ENLACES ===
  website: string;
  affiliateUrl?: string;
  appStoreUrl?: string;
  googlePlayUrl?: string;

  // === FAQ ===
  faq?: BankFAQ[];

  // === SEO ===
  seo: BankSEO;

  // === BLOQUES EXTRA PARA CONTENIDO (opcionales) ===
  expertOpinion?: BankExpertOpinion;
  openingSteps?: string[];
  history?: BankHistoryItem[];
  videoUrl?: string;
  reviews?: BankReview[];

  // === DATOS INTERNOS ===
  _lastUpdated: string;
  _affiliateCommission?: string;
  _priority?: number;
}

// === BANCOS ===
export const banks: Bank[] = [
  {
    slug: "revolut",
    name: "Revolut",
    shortName: "Revolut",
    tagline:
      "Cuenta multidivisa con IBAN lituano. Ideal para viajes y freelancers.",
    description:
      "Neobanco con más de 30 millones de usuarios. Ofrece cuentas en 30+ divisas, tarjetas virtuales desechables, cripto, acciones y app avanzada. Regulado en la UE.",

    country: "Lituania",
    headquarters: "Vilna, Lituania",
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
    ],

    logo: "/images/logos/revolut.svg",
    heroImage: "/images/logos/revolut-hero.webp",
    cardImage: "/images/logos/revolut.svg",

    currencies: ["EUR", "USD", "GBP", "CHF", "PLN", "AUD", "CAD", "+25 más"],
    support: {
      languages: [
        "Español",
        "Inglés",
        "Francés",
        "Alemán",
        "Italiano",
        "Polaco",
      ],
      channels: ["chat", "email"],
      responseTime: "Media: 2 minutos",
      spanishSupport: true,
    },

    fees: {
      monthly: "0 €/mes (Estándar)",
      setup: "Gratis",
      inactivity: "Ninguna",
      atmEU: "Gratis hasta 200 €/mes",
      atmInternational: "2% después de 1.000 €/mes",
      fxRate: "Interbancario (0% markup en días laborables)",
      transfer: "SEPA gratis; internacionales con pequeña comisión",
      cardReplacement: "Coste según tipo de tarjeta y país",
    },
    cardType: "Visa / Mastercard (según país)",

    keyPros: [
      "Cambio de divisa al tipo real (sin markup)",
      "Tarjetas virtuales desechables",
      "App con analíticas, vaults y control de gastos",
      "Crypto, acciones y commodities",
    ],
    keyCons: [
      "IBAN lituano (LT) → algunas empresas lo rechazan",
      "Soporte puede saturarse en picos",
    ],
    idealFor: "Viajeros, freelancers, nómadas digitales, compradores online.",

    requirements: ["DNI/NIE/Pasaporte", "Selfie", "Mayor de 18"],
    acceptedCountries: [
      "UE",
      "EEA",
      "UK",
      "Australia",
      "Canadá",
      "EEUU",
      "Singapur",
    ],

    rating: {
      trustpilot: 4.3,
      appStore: 4.8,
      googlePlay: 4.7,
      totalReviews: 220000,
    },

    compliance: {
      license: "Banco de Lituania",
      depositGuarantee: "100.000€ (Fondo de Garantía Lituano)",
      regulatedBy: ["Banco de Lituania", "UE"],
    },

    website: "https://www.revolut.com",
    affiliateUrl: "https://revolut.com/ref/BANCOS2025",
    appStoreUrl: "https://apps.apple.com/app/revolut/id932493382",
    googlePlayUrl:
      "https://play.google.com/store/apps/details?id=com.revolut.revolut",

    faq: [
      {
        question: "¿Revolut es un banco real?",
        answer:
          "Sí, tiene licencia bancaria en Lituania y tus depósitos están protegidos hasta 100.000€.",
        keywords: ["licencia", "seguridad", "depósitos"],
      },
      {
        question: "¿Puedo domiciliar nómina en Revolut?",
        answer:
          "Sí, pero algunas empresas rechazan IBAN lituano. Úsalo como cuenta secundaria.",
      },
    ],

    // === NUEVOS BLOQUES DE CONTENIDO ===
    expertOpinion: {
      summary:
        "Revolut es especialmente interesante si viajas a menudo, operas en varias divisas o quieres concentrar en una sola app muchas funciones financieras.",
      recommendedFor: [
        "Viajeros frecuentes dentro y fuera de la zona euro.",
        "Freelancers que cobran en distintas divisas.",
        "Personas que quieren una app potente para controlar gastos y ahorros.",
      ],
      notFor: [
        "Quien prefiere una cuenta tradicional con oficina física.",
        "Quien solo necesita una cuenta muy básica en euros sin extras.",
      ],
    },

    openingSteps: [
      "Entra a la web oficial.",
      "Regístrate con tu número de teléfono y crea tu perfil.",
      "Verifica tu identidad subiendo tu documento y realizando un selfie.",
      "Ingresa dinero en la cuenta con tarjeta o transferencia bancaria.",
      "Solicita tu tarjeta física (si la quieres) y empieza a usarla.",
    ],

    history: [
      {
        year: 2015,
        event:
          "Lanzamiento de Revolut como app de pagos y cambio de divisa en Reino Unido.",
      },
      {
        year: 2018,
        event:
          "Expansión a gran parte de Europa y mejora de las cuentas multidivisa.",
      },
      {
        year: 2020,
        event:
          "Obtención de licencia bancaria completa en la UE y nuevos planes de suscripción.",
      },
      {
        year: 2023,
        event:
          "Refuerzo de funciones de inversión, seguridad y herramientas de presupuesto.",
      },
    ],

    // Puedes poner aquí un vídeo tuyo o de YouTube
  

    reviews: [
      {
        author: "Lucía",
        rating: 5,
        text: "Perfecta para viajar y pagar en el extranjero sin preocuparte por las comisiones.",
        source: "Resumen de opiniones de usuarios",
      },
      {
        author: "Carlos",
        rating: 4,
        text: "La app es muy completa. A veces tiene tantas funciones que abruma un poco si solo quieres algo sencillo.",
      },
      {
        author: "María",
        rating: 4,
        text: "Me va muy bien para dividir gastos con amigos y pagar en otras divisas.",
      },
    ],

    seo: {
      metaTitle: "Revolut España 2025: Opiniones, Comisiones y Cómo Abrir Cuenta",
      metaDescription:
        "Análisis completo de Revolut: comisiones, IBAN lituano, multidivisa, tarjeta virtual. ¿Es seguro? ¿Para quién es ideal?",
      slug: "revolut",
      canonicalUrl: "https://bancoseuropa.com/programas/revolut",
      keywords: ["revolut españa", "cuenta revolut", "iban lituano", "multidivisa"],
    },

    _lastUpdated: "2025-11-16",
    _affiliateCommission: "hasta 50€ por cuenta",
    _priority: 1,
  },

  {
    slug: "n26",
    name: "N26",
    tagline: "Banco alemán con IBAN DE. Simple, gratis y 100% móvil.",
    description:
      "Banco digital con licencia alemana. Plan gratuito con IBAN europeo. App minimalista y rápida.",

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
    ],

    logo: "/images/logos/n26.svg",
    heroImage: "/images/logos/n26-hero.webp",
    cardImage: "/images/logos/n26.svg",

    currencies: ["EUR"],
    support: {
      languages: ["Español", "Inglés", "Alemán", "Francés", "Italiano"],
      channels: ["chat", "email", "phone"],
      spanishSupport: true,
    },

    fees: {
      monthly: "0 €/mes",
      setup: "Gratis",
      inactivity: "Ninguna",
      atmEU: "3 gratis/mes",
      atmInternational: "1,7% comisión",
      fxRate: "Mastercard + 0%",
    },
    cardType: "Mastercard",

    keyPros: ["IBAN alemán", "App ultraintuitiva", "Seguro de depósitos alemán"],
    keyCons: ["Solo EUR", "Límite de retiradas gratis"],
    idealFor: "Cuenta principal en euros, uso diario simple.",

    requirements: ["DNI/NIE", "Residir en país admitido", "Mayor de 18"],
    acceptedCountries: ["UE", "EEA"],

    rating: {
      trustpilot: 3.9,
      appStore: 4.7,
      googlePlay: 4.6,
    },

    compliance: {
      license: "BaFin (Alemania)",
      depositGuarantee: "100.000€ (Fondo Alemán)",
      regulatedBy: ["BaFin", "UE"],
    },

    website: "https://n26.com",
    affiliateUrl: "https://n26.com/ref/BANCOS2025",

    seo: {
      metaTitle: "N26 España: Opiniones, IBAN Alemán y Cuenta Gratis 2025",
      metaDescription:
        "N26: banco alemán con IBAN DE. ¿Es seguro? Comisiones, requisitos y cómo abrir cuenta desde España.",
      slug: "n26",
      canonicalUrl: "https://bancoseuropa.com/programas/n26",
      keywords: ["n26 españa", "iban alemán", "banco online gratis"],
    },

    _lastUpdated: "2025-11-16",
    _priority: 2,
  },

  {
    slug: "wise",
    name: "Wise",
    shortName: "Wise",
    tagline:
      "Transferencias internacionales al cambio real. Cuenta multidivisa con IBAN BE.",
    description:
      "Líder en transferencias baratas. Cuenta con datos bancarios locales en 10+ países.",

    country: "Bélgica (EUR)",
    headquarters: "Londres",
    ibanCountry: "Bélgica",
    ibanPrefix: "BE",

    category: "cuenta-multidivisa",
    tags: ["multidivisa", "para-freelancers", "no-residentes", "seguro-depositos"],

    logo: "/images/logos/wise.svg",
    heroImage: "/images/logos/wise-hero.webp",
    cardImage: "/images/logos/wise.svg",

    currencies: ["EUR", "USD", "GBP", "AUD", "CAD", "+50 más"],
    support: {
      languages: ["Español", "Inglés"],
      channels: ["email", "help-center"],
      spanishSupport: true,
    },

    fees: {
      monthly: "Gratis",
      setup: "Gratis",
      inactivity: "Ninguna",
      atmEU: "2 gratis/mes hasta 200 €",
      atmInternational: "1,75% + 0,50 €",
      fxRate: "Tipo medio del mercado",
    },
    cardType: "Mastercard",

    keyPros: ["Cambio real", "Datos bancarios locales", "Ideal para freelancers"],
    keyCons: ["No es banco completo", "Soporte solo email"],
    idealFor: "Cobrar/pagar en divisas extranjeras.",

    requirements: ["DNI/Pasaporte", "Verificación online"],
    acceptedCountries: ["Global"],

    rating: {
      trustpilot: 4.6,
    },

    compliance: {
      license: "Entidad de Dinero Electrónico (Bélgica)",
      depositGuarantee: "Salvaguarda de fondos",
      regulatedBy: ["NBB", "FCA"],
    },

    website: "https://wise.com",
    affiliateUrl: "https://wise.com/ref/BANCOS2025",

    seo: {
      metaTitle: "Wise España 2025: Cuenta Multidivisa, IBAN y Comisiones",
      metaDescription:
        "Wise: transferencias baratas y cuenta con IBAN BE. ¿Mejor que Revolut? Análisis completo.",
      slug: "wise",
      canonicalUrl: "https://bancoseuropa.com/programas/wise",
      keywords: ["wise españa", "transferencias internacionales", "cuenta multidivisa"],
    },

    _lastUpdated: "2025-11-16",
    _priority: 3,
  },

  {
    slug: "bunq",
    name: "Bunq",
    tagline: "Banco holandés con 25 subcuentas y automatizaciones.",
    description: "Ideal para autónomos y empresas. IBAN NL.",

    country: "Países Bajos",
    headquarters: "Ámsterdam",
    ibanCountry: "Países Bajos",
    ibanPrefix: "NL",

    category: "neobanco",
    tags: ["tarjeta-fisica", "para-empresa", "iban-nl"],

    logo: "/images/logos/bunq.svg",
    heroImage: "/images/logos/bunq-hero.webp",
    cardImage: "/images/logos/bunq.svg",

    currencies: ["EUR"],
    support: {
      languages: ["Inglés", "Holandés", "Alemán"],
      channels: ["chat", "email"],
      spanishSupport: false,
    },

    fees: {
      monthly: "2,99 €/mes (Easy Bank)",
      setup: "Gratis",
      inactivity: "Ninguna",
      atmEU: "Según plan",
      atmInternational: "Según plan",
      fxRate: "Mastercard",
    },
    cardType: "Mastercard",

    keyPros: ["25 subcuentas", "Automatizaciones", "IBAN NL"],
    keyCons: ["Sin plan gratis", "Sin español"],
    idealFor: "Autónomos y empresas en NL.",

    requirements: ["DNI", "Residir en UE"],
    acceptedCountries: ["UE"],

    rating: {
      trustpilot: 4.1,
    },

    compliance: {
      license: "DNB (Países Bajos)",
      depositGuarantee: "100.000€",
      regulatedBy: ["DNB"],
    },

    website: "https://bunq.com",
    affiliateUrl: "https://bunq.com/ref/BANCOS2025",

    seo: {
      metaTitle: "Bunq España: Opiniones, IBAN Holandés y Precios 2025",
      metaDescription:
        "Bunq: banco holandés con subcuentas. ¿Vale la pena? Análisis para autónomos.",
      slug: "bunq",
      canonicalUrl: "https://bancoseuropa.com/programas/bunq",
      keywords: ["bunq españa", "iban holandés", "banco para autónomos"],
    },

    _lastUpdated: "2025-11-16",
    _priority: 4,
  },
];

// === UTILIDADES ===
export const getBankBySlug = (slug: string): Bank | undefined =>
  banks.find((b) => b.slug === slug);

export const getFeaturedBanks = (limit = 3): Bank[] =>
  banks
    .filter((b) => typeof b._priority === "number")
    .sort((a, b) => (a._priority || 0) - (b._priority || 0))
    .slice(0, limit);

export const getBanksByTag = (tag: BankFeatureTag): Bank[] =>
  banks.filter((b) => b.tags.includes(tag));
