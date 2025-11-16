// src/lib/banks.ts

export type BankCategory = "neobanco" | "tradicional" | "cuenta-multidivisa";

export type BankFeatureTag =
  | "sin-comisiones"
  | "tarjeta-fisica"
  | "tarjeta-virtual"
  | "multidivisa"
  | "crypto"
  | "para-freelancers"
  | "para-empresa"
  | "no-residentes"
  | "espanol";

export interface Bank {
  slug: string;              // lo que usas en la URL: /programas/[slug]
  name: string;              // nombre comercial
  shortName?: string;        // opcional: nombre corto para chips, etc.
  tagline: string;           // frase corta de gancho
  description: string;       // descripción larga
  country: string;           // país principal
  ibanCountry?: string;      // país del IBAN si aplica
  category: BankCategory;
  tags: BankFeatureTag[];
  logo: string;              // ruta al logo en /public
  heroImage?: string;        // imagen más grande si la tienes

  currencies: string[];      // divisas soportadas principales
  languages: string[];       // idiomas de la app/soporte

  monthlyFee: string;        // texto "0 €/mes", "9,99 €/mes", etc.
  cardType: string;          // "Visa", "Mastercard", "Virtual", etc.
  atmWithdrawals: string;    // política de cajeros
  keyPros: string[];         // puntos fuertes
  keyCons: string[];         // puntos débiles

  idealFor: string;          // para quién es ideal
  requirements: string[];    // requisitos principales

  website: string;           // web oficial
  affiliateUrl?: string;     // tu link de afiliado (si lo tienes)

  faq?: {
    question: string;
    answer: string;
  }[];
}

export const banks: Bank[] = [
  {
    slug: "revolut",
    name: "Revolut",
    tagline: "Cuenta multidivisa perfecta para viajar y cobrar en distintas monedas.",
    description:
      "Revolut es un neobanco con IBAN lituano que permite tener cuentas en múltiples divisas, tarjetas físicas y virtuales, y una app muy completa. Es ideal para quienes viajan, cobran en distintas monedas o hacen compras online a menudo.",
    country: "Lituania (sede europea)",
    ibanCountry: "LT (Lituania)",
    category: "cuenta-multidivisa",
    tags: [
      "multidivisa",
      "tarjeta-fisica",
      "tarjeta-virtual",
      "sin-comisiones",
      "no-residentes",
    ],
    logo: "/banks/revolut.svg",
    heroImage: "/banks/revolut-hero.png",

    currencies: ["EUR", "USD", "GBP", "CHF", "PLN", "Más de 25 divisas"],
    languages: ["Español", "Inglés", "Francés", "Alemán"],

    monthlyFee: "Desde 0 €/mes (plan estándar)",
    cardType: "Tarjeta física y virtual (Visa/Mastercard según país)",
    atmWithdrawals: "Retiradas gratis hasta un límite mensual según el plan.",

    keyPros: [
      "Tipo de cambio muy competitivo para viajes y compras en otras divisas.",
      "Tarjeta virtual desechable para más seguridad en compras online.",
      "App muy completa: analytics, vaults, control de suscripciones, etc.",
      "Apertura de cuenta rápida y 100% online.",
    ],
    keyCons: [
      "El IBAN no es español (LT), puede no gustar a algunas empresas.",
      "Atención al cliente puede ser más lenta en horas punta.",
      "Algunos límites y fees en retiradas de cajero en el plan gratuito.",
    ],

    idealFor:
      "Personas que viajan a menudo, trabajan en remoto, cobran en distintas divisas o compran mucho por internet.",
    requirements: [
      "Documento de identidad válido (DNI/NIE/pasaporte).",
      "Selfie o verificación biométrica durante el alta.",
      "Ser mayor de 18 años.",
    ],

    website: "https://www.revolut.com",
    affiliateUrl: "https://www.revolut.com/ref/tucodigo",

    faq: [
      {
        question: "¿Tiene comisiones de mantenimiento?",
        answer:
          "El plan estándar es gratuito y no tiene comisión de mantenimiento. Los planes de pago incluyen ventajas extra como más retiradas en cajero, mejores límites de cambio y seguros.",
      },
      {
        question: "¿Puedo usar Revolut como cuenta principal?",
        answer:
          "Sí, puedes domiciliar ingresos y recibos en muchos casos, pero al tener IBAN lituano algunas empresas o administraciones pueden poner pegas. Es ideal como cuenta secundaria o de viajes.",
      },
    ],
  },
  {
    slug: "n26",
    name: "N26",
    tagline: "Banco alemán con IBAN europeo y una app muy sencilla de usar.",
    description:
      "N26 es un banco alemán con licencia bancaria completa y IBAN europeo. Ofrece cuentas personales con plan gratuito y planes de pago con más ventajas. Su app es muy intuitiva y permite gestionar todo desde el móvil.",
    country: "Alemania",
    ibanCountry: "DE (Alemania)",
    category: "neobanco",
    tags: ["sin-comisiones", "tarjeta-fisica", "no-residentes"],

    logo: "/banks/n26.svg",
    heroImage: "/banks/n26-hero.png",

    currencies: ["EUR"],
    languages: ["Español", "Inglés", "Alemán", "Francés", "Italiano"],

    monthlyFee: "0 €/mes (plan estándar) · planes de pago desde 4,90 €/mes",
    cardType: "Mastercard física y virtual",
    atmWithdrawals:
      "Retiradas en cajeros gratis varias veces al mes en la zona euro (según plan).",

    keyPros: [
      "IBAN alemán reconocido en toda la zona euro.",
      "Alta muy rápida y sin papeleo físico.",
      "App muy limpia y enfocada a uso diario.",
    ],
    keyCons: [
      "Solo opera en EUR, no es cuenta multidivisa.",
      "Comisiones si te pasas de los límites de retiradas gratuitas.",
    ],

    idealFor:
      "Personas que quieren un banco principal online en euros, fácil de usar y sin demasiada complicación.",
    requirements: [
      "Documento de identidad válido.",
      "Residir en uno de los países admitidos por N26.",
      "Mayoría de edad.",
    ],

    website: "https://n26.com",
    affiliateUrl: "https://n26.com/ref/tucodigo",
  },
  {
    slug: "wise",
    name: "Wise",
    tagline: "La mejor opción para enviar y recibir dinero en distintas divisas.",
    description:
      "Wise comenzó como una plataforma de transferencias internacionales baratas y ahora ofrece cuentas multidivisa con datos bancarios locales en varios países. Ideal para freelancers internacionales y personas que cobran en distintas monedas.",
    country: "Reino Unido",
    ibanCountry: "BE (Bélgica) para la zona euro",
    category: "cuenta-multidivisa",
    tags: ["multidivisa", "tarjeta-virtual", "para-freelancers", "no-residentes"],

    logo: "/banks/wise.svg",
    heroImage: "/banks/wise-hero.png",

    currencies: ["EUR", "USD", "GBP", "AUD", "CAD", "Más de 50 divisas"],
    languages: ["Español", "Inglés", "Otros idiomas"],

    monthlyFee: "Sin cuota mensual, pagas por uso (transferencias, cambio, etc.)",
    cardType: "Tarjeta física y virtual Mastercard",
    atmWithdrawals:
      "Retiradas gratis hasta un límite mensual, después pequeña comisión.",

    keyPros: [
      "Comisiones muy bajas en transferencias internacionales.",
      "Datos bancarios locales en varios países (EEUU, UK, EUR…).",
      "Ideal para cobrar en distintas divisas sin perder tanto en el cambio.",
    ],
    keyCons: [
      "No es un banco clásico, sino una entidad de dinero electrónico.",
      "No todos los países tienen acceso a todas las funciones.",
    ],

    idealFor:
      "Freelancers, nómadas digitales y personas que cobran o pagan en varias divisas de forma habitual.",
    requirements: [
      "Documento de identidad.",
      "Verificación de identidad online.",
    ],

    website: "https://wise.com",
    affiliateUrl: "https://wise.com/ref/tucodigo",
  },
  {
    slug: "bunq",
    name: "Bunq",
    tagline: "Banco holandés muy flexible con múltiples subcuentas e IBANs.",
    description:
      "Bunq es un banco holandés pensado para usuarios avanzados que quieren mucha flexibilidad: múltiples cuentas, automatizaciones, ahorros, etc. Tiene planes de pago con muchas funciones.",
    country: "Países Bajos",
    ibanCountry: "NL (Países Bajos)",
    category: "neobanco",
    tags: ["tarjeta-fisica", "para-empresa"],

    logo: "/banks/bunq.svg",

    currencies: ["EUR"],
    languages: ["Inglés", "Holandés", "Alemán"],

    monthlyFee: "Planes desde aprox. 2,99 €/mes",
    cardType: "Tarjeta física y virtual Mastercard",
    atmWithdrawals: "Condiciones según plan contratado.",

    keyPros: [
      "Múltiples subcuentas y automatizaciones muy potentes.",
      "Buen producto para autónomos y pequeñas empresas.",
    ],
    keyCons: [
      "No tiene plan totalmente gratuito.",
      "Interfaz y opciones pueden abrumar al principio.",
    ],

    idealFor:
      "Usuarios avanzados y autónomos que quieren mucho control sobre sus cuentas.",
    requirements: ["Documento de identidad.", "Residir en país admitido."],

    website: "https://www.bunq.com",
  },
];
