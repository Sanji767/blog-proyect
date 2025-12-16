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
}

export const DOMAIN = "https://finanzaseu.com";

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
    heroImage: "/images/logos/revolut-p.webp",
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
  },
];
