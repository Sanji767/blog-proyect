// src/lib/banks.ts
import { StaticImageData } from "next/image";

// === TIPOS ===
export type BankCategory = "neobanco" | "tradicional" | "cuenta-multidivisa" | "fintech";

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

// (Todos los interfaces que ya tenías siguen iguales)
export interface BankFAQ { question: string; answer: string; keywords?: string[]; }
export interface BankRating { trustpilot?: number; appStore?: number; googlePlay?: number; totalReviews?: number; }
export interface BankFees {
  monthly: string;
  setup: string;
  inactivity: string;
  atmEU: string;
  atmInternational: string;
  fxRate: string;
  transfer?: string;
  cardReplacement?: string;
}
export interface BankSupport {
  languages: string[];
  channels: ("chat" | "email" | "phone" | "help-center")[];
  responseTime?: string;
  spanishSupport: boolean;
}
export interface BankCompliance { license: string; depositGuarantee: string; regulatedBy: string[]; }
export interface BankSEO {
  metaTitle: string;
  metaDescription: string;
  slug: string;
  canonicalUrl: string;
  openGraphImage?: string;
  keywords: string[];
}
export interface BankExpertOpinion { summary: string; recommendedFor: string[]; notFor?: string[]; }
export interface BankHistoryItem { year: number; event: string; }
export interface BankReview { author: string; rating: number; text: string; source?: string; }

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
  support: BankSupport;

  fees: BankFees;
  cardType: string;

  keyPros: string[];
  keyCons: string[];
  idealFor: string;

  requirements: string[];
  acceptedCountries: string[];

  rating: BankRating;

  compliance: BankCompliance;

  website: string;
  affiliateUrl?: string;
  appStoreUrl?: string;
  googlePlayUrl?: string;

  faq?: BankFAQ[];
  seo: BankSEO;

  expertOpinion?: BankExpertOpinion;
  openingSteps?: string[];
  history?: BankHistoryItem[];
  reviews?: BankReview[];

  _lastUpdated: string;
  _affiliateCommission?: string;
  _priority?: number;
}

// === TODOS LOS BANCOS CON LOGOS CORRECTOS ===
export const banks: Bank[] = [
  {
    slug: "revolut",
    name: "Revolut",
    shortName: "Revolut",
    tagline: "Cuenta multidivisa con IBAN lituano. Ideal para viajes y freelancers.",
    description: "Neobanco con más de 30 millones de usuarios. Ofrece cuentas en 30+ divisas, tarjetas virtuales desechables, cripto, acciones y app avanzada. Regulado en la UE.",
    country: "Lituania",
    headquarters: "Vilna, Lituania",
    ibanCountry: "Lituania",
    ibanPrefix: "LT",
    category: "cuenta-multidivisa",
    tags: ["multidivisa", "tarjeta-fisica", "tarjeta-virtual", "sin-comisiones", "no-residentes", "crypto", "para-freelancers", "soporte-24-7"],

    logo: "/logos/revolut.svg",
    heroImage: "/heroes/revolut.webp",
    cardImage: "/logos/revolut.svg",

    currencies: ["EUR", "USD", "GBP", "CHF", "PLN", "AUD", "CAD", "+25 más"],
    support: {
      languages: ["Español", "Inglés", "Francés", "Alemán", "Italiano", "Polaco"],
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
    },
    cardType: "Visa / Mastercard",

    keyPros: ["Cambio al tipo real", "Tarjetas virtuales desechables", "Crypto + acciones", "App brutal"],
    keyCons: ["IBAN lituano", "Soporte a veces lento"],
    idealFor: "Viajeros, freelancers, nómadas digitales",

    requirements: ["DNI/NIE/Pasaporte", "Selfie", "Mayor de 18"],
    acceptedCountries: ["UE", "EEA", "UK", "Australia", "Canadá", "EEUU", "Singapur"],

    rating: { trustpilot: 4.3, appStore: 4.8, googlePlay: 4.7, totalReviews: 220000 },

    compliance: {
      license: "Banco de Lituania",
      depositGuarantee: "100.000€",
      regulatedBy: ["Banco de Lituania", "UE"],
    },

    website: "https://www.revolut.com",
    affiliateUrl: "https://revolut.com/ref/BANCOS2025",

    seo: {
      metaTitle: "Revolut España 2025: Opiniones, Comisiones y Cómo Abrir Cuenta",
      metaDescription: "Análisis completo de Revolut: comisiones, IBAN lituano, multidivisa, tarjeta virtual.",
      slug: "revolut",
      canonicalUrl: "https://bancoseuropa.com/programas/revolut",
      keywords: ["revolut españa", "cuenta revolut", "iban lituano", "multidivisa"],
    },

    expertOpinion: {
      summary: "El rey actual para quien viaja o cobra en varias divisas.",
      recommendedFor: ["Viajeros", "Freelancers", "Nómadas digitales"],
      notFor: ["Cuenta principal tradicional con nómina"],
    },

    _lastUpdated: "2025-11-20",
    _affiliateCommission: "hasta 50€",
    _priority: 1,
  },

  {
    slug: "n26",
    name: "N26",
    tagline: "Banco alemán con IBAN DE. Simple, gratis y 100% móvil.",
    description: "Banco digital con licencia alemana. Plan gratuito con IBAN europeo. App minimalista y rápida.",
    country: "Alemania",
    headquarters: "Berlín",
    ibanCountry: "Alemania",
    ibanPrefix: "DE",
    category: "neobanco",
    tags: ["sin-comisiones", "tarjeta-fisica", "no-residentes", "iban-de", "seguro-depositos"],

    logo: "/logos/n26.svg",
    heroImage: "/heroes/n26.webp",
    cardImage: "/logos/n26.svg",

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

    keyPros: ["IBAN alemán", "App ultraintuitiva", "Seguro alemán 100.000€"],
    keyCons: ["Solo euros", "Pocas retiradas gratis"],
    idealFor: "Cuenta principal diaria en euros",

    requirements: ["DNI/NIE", "Residir en país admitido", "Mayor de 18"],
    acceptedCountries: ["UE", "EEA"],

    rating: { trustpilot: 3.9, appStore: 4.7, googlePlay: 4.6 },

    compliance: {
      license: "BaFin (Alemania)",
      depositGuarantee: "100.000€ (Fondo Alemán)",
      regulatedBy: ["BaFin", "UE"],
    },

    website: "https://n26.com",
    affiliateUrl: "https://n26.com/ref/BANCOS2025",

    seo: {
      metaTitle: "N26 España: Opiniones, IBAN Alemán y Cuenta Gratis 2025",
      metaDescription: "N26: banco alemán con IBAN DE. ¿Es seguro? Comisiones, requisitos y cómo abrir cuenta.",
      slug: "n26",
      canonicalUrl: "https://bancoseuropa.com/programas/n26",
      keywords: ["n26 españa", "iban alemán", "banco online gratis"],
    },

    _lastUpdated: "2025-11-20",
    _priority: 2,
  },

  {
    slug: "wise",
    name: "Wise",
    shortName: "Wise",
    tagline: "Transferencias al cambio real + cuenta multidivisa (IBAN BE)",
    description: "Líder mundial en transferencias baratas. Cuenta con datos locales en +10 países.",
    country: "Bélgica",
    headquarters: "Londres",
    ibanCountry: "Bélgica",
    ibanPrefix: "BE",
    category: "cuenta-multidivisa",
    tags: ["multidivisa", "para-freelancers", "no-residentes", "seguro-depositos"],

    logo: "/logos/wise.svg",
    heroImage: "/heroes/wise.webp",
    cardImage: "/logos/wise.svg",

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
      atmEU: "2 gratis/mes hasta 200€",
      atmInternational: "1,75% + 0,50€",
      fxRate: "Tipo medio mercado",
    },
    cardType: "Mastercard",

    keyPros: ["Cambio real siempre", "Datos bancarios locales", "Ideal freelancers"],
    keyCons: ["No es banco completo", "Soporte solo email"],
    idealFor: "Cobrar y pagar internacionalmente",

    requirements: ["DNI/Pasaporte", "Verificación online"],
    acceptedCountries: ["Global"],

    rating: { trustpilot: 4.6 },

    compliance: {
      license: "Entidad de Dinero Electrónico",
      depositGuarantee: "Salvaguarda de fondos",
      regulatedBy: ["NBB Bélgica", "FCA"],
    },

    website: "https://wise.com",
    affiliateUrl: "https://wise.com/ref/BANCOS2025",

    seo: {
      metaTitle: "Wise España 2025: Cuenta Multidivisa, IBAN y Comisiones",
      metaDescription: "Wise: transferencias baratas y cuenta multidivisa con IBAN BE. ¿Mejor que Revolut?",
      slug: "wise",
      canonicalUrl: "https://bancoseuropa.com/programas/wise",
      keywords: ["wise españa", "transferencias internacionales", "cuenta multidivisa"],
    },

    _lastUpdated: "2025-11-20",
    _priority: 3,
  },

  {
    slug: "bunq",
    name: "Bunq",
    tagline: "Banco holandés con 25 subcuentas y automatizaciones.",
    description: "El favorito de autónomos y empresas. IBAN NL.",
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

    keyPros: ["25 subcuentas", "Automatizaciones", "IBAN holandés"],
    keyCons: ["Sin plan gratis", "Sin español"],
    idealFor: "Autónomos y empresas",

    requirements: ["DNI", "Residir en UE"],
    acceptedCountries: ["UE"],

    rating: { trustpilot: 4.1 },

    compliance: {
      license: "DNB (Países Bajos)",
      depositGuarantee: "100.000€",
      regulatedBy: ["DNB"],
    },

    website: "https://bunq.com",
    affiliateUrl: "https://bunq.com/ref/BANCOS2025",

    seo: {
      metaTitle: "Bunq España: Opiniones, IBAN Holandés y Precios 2025",
      metaDescription: "Bunq: banco holandés con subcuentas múltiples. ¿Vale la pena para autónomos?",
      slug: "bunq",
      canonicalUrl: "https://bancoseuropa.com/programas/bunq",
      keywords: ["bunq españa", "iban holandés", "banco autónomos"],
    },

    _lastUpdated: "2025-11-20",
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