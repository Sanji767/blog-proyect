// ============================================================================
// src/lib/banks-en.ts  —  NEW FILE (draft for review, do not commit directly)
// ============================================================================
//
// English overlay for the bank dataset in src/lib/banks.ts.
//
// PROBLEM (finding F-07): every user-facing string in `banks` is Spanish
// (taglines, descriptions, pros/cons, fees, countries, card types...), but
// the EN surfaces render those fields verbatim:
//   - /en/programas/[slug]  (tagline, description, country, ibanCountry,
//     keyPros, keyCons, fees.*, cardType — plus tagline as meta description)
//   - /en/bancos            (tagline, country, fees.monthly, cardType)
//   - /en/comparar/[slug]   (keyPros verbatim; taglines via a stale hardcoded
//     map — Revolut "LT IBAN", N26 "DE IBAN", Trade Republic "3.75% APY",
//     Trading 212 "up to 5.1% APY" — all wrong vs banks.ts)
//   - EN home               (HomeBanksPreview tagline/ibanCountry, UseCases
//     ibanCountry, BankQuiz country/tagline)
//
// This file is the single source of truth for EN bank copy. Consumers call
// `getBankEn(bank)` and render the returned object exactly as they render
// the ES one — no regex patching, no per-page translation maps.
//
// DESIGN
// - `BANK_EN_OVERRIDES`: per-bank translations of strings that are unique
//   to that bank (tagline, description, custom pros/cons/fees, ...).
// - `EXACT_EN`: exact-match dictionary for RECURRING strings — the
//   createDraftBank() defaults and other values shared by many banks.
//   This keeps the override table small: most draft banks need only a
//   tagline (+ country/headquarters) here.
// - `COUNTRY_EN`: Spanish country/region names → English, including the
//   " / "-joined composites used in banks.ts.
// - `getBankEn(bank)`: returns a translated COPY of the bank. Lookup order
//   per field: per-bank override → exact dictionary → country map (for
//   country-like fields) → original string (never throws, never blanks).
// - SEO: EN metaTitle/metaDescription/keywords are generated for banks
//   that use the createDraftBank() defaults; the 4 flagship banks and the
//   banks with custom ES seo get hand-written EN seo in the overrides.
//
// DATA NOTES (2026-11-23, verified against src/lib/banks.ts)
// - Revolut savings rate is kept at 1.15% TAE exactly as banks.ts states
//   it (keyPros). See CHANGES.md §1.7: the SavingsCalculator verified
//   table says 1.25% (Netherlands, Standard) and the ES review says up to
//   2.27% TAE on higher plans — banks.ts needs a correction, not this file.
// - "FGD España" is rendered "Spanish DGS" (Deposit Guarantee Scheme);
//   "Fondo de Garantía de Depósitos" likewise. "BCE" → "ECB".
// - Money is kept in the source's own format (€0, €200/month): the
//   per-locale number formatting fix (Intl.NumberFormat) is separate and
//   covers computed numbers; these are quoted strings, not computed values.
// - EVO is _status "draft" but still has a live ficha (both locales
//   generate static params for every bank), so it gets translations too.

import type { Bank } from "./banks";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BankEnOverride = {
  tagline?: string;
  description?: string;
  country?: string;
  headquarters?: string;
  ibanCountry?: string;
  currencies?: string[];
  supportLanguages?: string[];
  responseTime?: string;
  fees?: Partial<Bank["fees"]>;
  cardType?: string;
  keyPros?: string[];
  keyCons?: string[];
  idealFor?: string;
  requirements?: string[];
  acceptedCountries?: string[];
  license?: string;
  depositGuarantee?: string;
  regulatedBy?: string[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
};

// ---------------------------------------------------------------------------
// Country / region names (every value used in country / ibanCountry /
// acceptedCountries in banks.ts, incl. " / " composites)
// ---------------------------------------------------------------------------

export const COUNTRY_EN: Record<string, string> = {
  "España": "Spain",
  "Alemania": "Germany",
  "Francia": "France",
  "Italia": "Italy",
  "Países Bajos": "Netherlands",
  "Austria": "Austria",
  "Bélgica": "Belgium",
  "Irlanda": "Ireland",
  "Portugal": "Portugal",
  "Finlandia": "Finland",
  "Grecia": "Greece",
  "Estonia": "Estonia",
  "Letonia": "Latvia",
  "Lituania": "Lithuania",
  "Luxemburgo": "Luxembourg",
  "Eslovaquia": "Slovakia",
  "Eslovenia": "Slovenia",
  "Polonia": "Poland",
  "Reino Unido": "United Kingdom",
  "Chipre": "Cyprus",
  "Suecia": "Sweden",
  "Suiza": "Switzerland",
  "Dinamarca": "Denmark",
  "Reino Unido / Chipre": "United Kingdom / Cyprus",
  "Reino Unido / Grecia": "United Kingdom / Greece",
  "Irlanda / Lituania": "Ireland / Lithuania",
  "No aplica": "Not applicable",
  "UE": "EU",
  "Unión Europea": "European Union",
  "Toda la UE": "All EU",
  "UE (según entidad)": "EU (depending on provider)",
  "UE (según cuenta)": "EU (depending on account)",
  "UE (según producto)": "EU (depending on product)",
  "UE (según plan)": "EU (depending on plan)",
  "UE (según país)": "EU (depending on country)",
  "Países nórdicos": "Nordic countries",
  "EEUU": "USA",
  "Canadá": "Canada",
  "Singapur": "Singapore",
  "+10 países UE": "+10 EU countries",
  "La mayoría del mundo (excepto países restringidos)":
    "Most of the world (except restricted countries)",
};

/** Translate one country/region label, splitting " / " composites. */
export function translateCountryName(value: string): string {
  if (COUNTRY_EN[value]) return COUNTRY_EN[value];
  if (value.includes(" / ")) {
    return value
      .split(" / ")
      .map((part) => COUNTRY_EN[part.trim()] ?? part.trim())
      .join(" / ");
  }
  return value;
}

// ---------------------------------------------------------------------------
// Exact-match dictionary for RECURRING strings
// (createDraftBank() defaults + values shared by several banks)
// ---------------------------------------------------------------------------

export const EXACT_EN: Record<string, string> = {
  // --- createDraftBank() fee defaults (banks.ts ~L184-193) ---
  "Desde 0 € (según condiciones)": "From €0 (depending on terms)",
  "Normalmente gratis (según cuenta)": "Usually free (depending on account)",
  "Según cuenta": "Depends on account",
  "Según red/condiciones": "Varies by network/terms",
  "Según entidad": "Varies by provider",
  "Según plan": "Depends on plan",
  "Según tarjeta/condiciones": "Depends on card/terms",

  // --- fee values shared by several banks ---
  "Gratis": "Free",
  "Ninguna": "None",
  "0 €": "€0",
  "No aplica": "Not applicable",
  "Sin comisión": "No fee",
  "Mercado real": "Real market rate",
  "Mastercard estándar": "Standard Mastercard",

  // --- cardType defaults / shared values ---
  "Débito (según cuenta)": "Debit (depending on account)",
  "Débito y crédito (según cuenta)": "Debit and credit (depending on account)",
  "Visa o Mastercard": "Visa or Mastercard",

  // --- keyPros / keyCons defaults (banks.ts ~L222-232) ---
  "Marca reconocida y operativa en Europa":
    "Well-known brand operating across Europe",
  "Apertura online u oficina (según cuenta)":
    "Online or branch opening (depending on account)",
  "Condiciones y comisiones dependen del producto":
    "Terms and fees depend on the product",
  "Requisitos de residencia pueden aplicar":
    "Residency requirements may apply",

  // --- idealFor / requirements defaults (banks.ts ~L233-236) ---
  "Cuenta diaria en Europa": "Everyday account in Europe",
  "DNI/NIE o pasaporte": "National ID or passport",
  "Mayor de 18 años": "Aged 18 or over",

  // --- support languages ---
  "Español": "Spanish",
  "Inglés": "English",
  "Francés": "French",
  "Alemán": "German",
  "Italiano": "Italian",
  "Portugués": "Portuguese",
  "Holandés": "Dutch",

  // --- currencies ---
  "+25 más": "+25 more",
  "+35 más": "+35 more",

  // --- compliance defaults (banks.ts ~L195-205) ---
  "Consulta la licencia en la web oficial":
    "Check the licence on the official website",
  "Hasta 100.000 € (según esquema aplicable)":
    "Up to €100,000 (depending on the applicable scheme)",
  "Consulta la protección aplicable": "Check the applicable protection",
  "Banco (licencia española)": "Bank (Spanish licence)",
  "Hasta 100.000 € (FGD España)": "Up to €100,000 (Spanish DGS)",
  "Cooperativa de crédito (licencia española)":
    "Credit cooperative (Spanish licence)",

  // --- regulators ---
  "Banco de España": "Bank of Spain",
  "BCE": "ECB",
  "Regulador local": "Local regulator",
  "Banco de Lituania": "Bank of Lithuania",
  "NBB Bélgica": "NBB Belgium",
  "FCA Reino Unido": "FCA United Kingdom",
  "Banco Central de Irlanda": "Central Bank of Ireland",

  // --- response times ---
  "2-5 minutos": "2–5 minutes",
};

// Suffix createDraftBank() appends to the tagline when no description is
// given (banks.ts ~L213-215).
const ES_DESCRIPTION_SUFFIX =
  " Consulta condiciones y disponibilidad en la web oficial.";
const EN_DESCRIPTION_SUFFIX =
  " Check terms and availability on the official website.";

// ---------------------------------------------------------------------------
// Per-bank overrides (unique strings only; recurring ones come from EXACT_EN
// / COUNTRY_EN above)
// ---------------------------------------------------------------------------

const SPANISH_COMPLIANCE_EN: {
  license: string;
  depositGuarantee: string;
  regulatedBy: string[];
} = {
  license: "Bank (Spanish licence)",
  depositGuarantee: "Up to €100,000 (Spanish DGS)",
  regulatedBy: ["Bank of Spain", "ECB"],
};

const SPANISH_FEES_EN: Bank["fees"] = {
  monthly: "From €0 (depending on terms)",
  setup: "Usually free (depending on account)",
  inactivity: "Depends on account",
  atmEU: "Varies by network/terms",
  atmInternational: "Varies by network/terms",
  fxRate: "Varies by provider",
};

export const BANK_EN_OVERRIDES: Record<string, BankEnOverride> = {
  // ====================== FLAGSHIP BANKS (full profiles) ======================
  revolut: {
    tagline:
      "Leading multi-currency account with Spanish IBAN, Bizum and a top-rated app",
    description:
      "Neobank with a European licence and more than 80M customers worldwide. Account with Spanish IBAN, real exchange rate, up to 20 virtual cards and 1 disposable card, stock and crypto investing, and one of the best banking apps.",
    country: "Lithuania",
    headquarters: "Vilnius",
    ibanCountry: "Spain",
    currencies: ["EUR", "USD", "GBP", "CHF", "PLN", "AUD", "CAD", "+25 more"],
    supportLanguages: ["Spanish", "English", "French", "German", "Italian", "Portuguese"],
    responseTime: "2–5 minutes",
    fees: {
      monthly: "€0 (Standard plan)",
      setup: "Free",
      inactivity: "None",
      atmEU: "Free up to €200/month or 5 withdrawals",
      atmInternational: "Free up to €200/month or 5 withdrawals (same global limit)",
      fxRate:
        "Interbank rate; free up to €1,000/month Mon–Fri (Standard), +1% at weekends",
    },
    cardType: "Visa or Mastercard",
    keyPros: [
      "Fee-free currency exchange up to €1,000/month on weekdays (Standard)",
      "Up to 20 virtual cards and 1 single-use disposable card",
      "Multi-currency account with 25+ currencies",
      "Savings account in Spain from 1.15% APR on the Standard plan",
      "Full-featured app with analytics and spending controls",
    ],
    keyCons: [
      "The Standard plan limits free exchange to €1,000/month and charges 1% at weekends",
      "Support can be slow at peak times",
    ],
    idealFor: "Travellers, freelancers, digital nomads and online shopping",
    requirements: ["National ID/passport", "Selfie", "Aged 18 or over"],
    acceptedCountries: ["Spain", "EU", "United Kingdom", "USA", "Australia", "Canada", "Singapore"],
    license: "Lithuanian banking licence",
    depositGuarantee: "€100,000 (Lithuanian Deposit Guarantee Fund)",
    regulatedBy: ["Bank of Lithuania", "ECB", "Bank of Spain"],
    metaTitle: "Revolut Spain 2026: fees, Spanish IBAN and honest review",
    metaDescription:
      "Revolut in Spain 2026: free account with Spanish IBAN, physical/virtual cards, real exchange rate and a powerful app. Pros, cons and who it's best for.",
    keywords: [
      "revolut spain 2026",
      "revolut spanish iban ES",
      "free revolut account",
      "revolut fx fees",
      "revolut virtual disposable card",
      "revolut for travel",
      "revolut review",
      "revolut vs wise",
    ],
  },

  n26: {
    tagline: "German bank with Spanish IBAN, free account and BaFin protection",
    description:
      "100% digital bank with a German licence and more than 8M customers. Spanish IBAN, simple app, Bizum, mobile payments and deposits protected up to €100,000.",
    country: "Germany",
    headquarters: "Berlin",
    ibanCountry: "Spain",
    supportLanguages: ["Spanish", "English", "German", "French", "Italian"],
    fees: {
      monthly: "€0 (Standard plan)",
      setup: "Free",
      inactivity: "None",
      atmEU: "Free and unlimited in euros in Spain",
      atmInternational: "1.7% (Standard/Smart); free with Go and Metal",
      fxRate: "Mastercard rate, no fee on card payments",
    },
    cardType: "Mastercard",
    keyPros: [
      "Spanish IBAN accepted for salary, direct debits and Bizum",
      "No monthly fee",
      "German deposit protection (€100,000)",
      "Straightforward, easy-to-use app",
    ],
    keyCons: [
      "Euro-only",
      "Savings at 0.50% APR on Standard (1.30% only with Metal)",
    ],
    idealFor: "Main euro account and salary",
    requirements: ["National ID", "Resident in an accepted country"],
    acceptedCountries: ["Spain", "Germany", "France", "Italy", "+10 EU countries"],
    license: "German banking licence (BaFin)",
    depositGuarantee: "€100,000 (German Deposit Guarantee Fund)",
    regulatedBy: ["BaFin", "ECB"],
    metaTitle: "N26 Spain 2026: Spanish IBAN, free account and terms",
    metaDescription:
      "N26 in Spain 2026: fee-free online account with Spanish IBAN, Mastercard and protected deposits. Benefits, limits and review.",
    keywords: [
      "n26 spain 2026",
      "n26 spanish iban ES",
      "free n26 account",
      "n26 salary spain",
      "n26 mastercard",
      "n26 review",
      "n26 vs revolut",
    ],
  },

  wise: {
    tagline:
      "Low-cost multi-currency account with Belgian IBAN and the real exchange rate",
    description:
      "Fintech specialising in international transfers and multi-currency accounts. Real exchange rate, local bank details in several countries and a travel card.",
    country: "Belgium",
    headquarters: "London",
    ibanCountry: "Belgium",
    currencies: ["EUR", "USD", "GBP", "AUD", "CAD", "+35 more"],
    supportLanguages: ["Spanish", "English", "+15"],
    fees: {
      monthly: "Free",
      setup: "Free",
      inactivity: "None",
      atmEU: "Free up to €250/month",
      atmInternational: "2.69% on the amount above €250/month",
      fxRate: "Mid-market rate",
    },
    cardType: "Visa or Mastercard",
    keyPros: [
      "Very low transfer fees",
      "Real exchange rate with no hidden margin",
      "Local bank details in 10+ currencies",
      "Very useful for receiving and paying in several currencies",
      "Wise Interest: ~2.30% in EUR (variable, capital at risk)",
    ],
    keyCons: [
      "Not a full bank for salary",
      "Support mainly by email",
    ],
    idealFor: "Freelancers, expats and international payments",
    requirements: ["National ID or passport"],
    acceptedCountries: ["Most of the world (except restricted countries)"],
    license: "Electronic Money Institution (EMI)",
    depositGuarantee: "Safeguarded funds (no deposit guarantee)",
    regulatedBy: ["NBB Belgium", "FCA United Kingdom"],
    metaTitle: "Wise Spain 2026: fees, Belgian IBAN and multi-currency account",
    metaDescription:
      "Wise 2026 in Spain: free multi-currency account with Belgian IBAN, real exchange rate and cheap transfers. Pros, cons and who it's best for.",
    keywords: [
      "wise spain 2026",
      "wise belgian iban BE",
      "wise multi-currency account",
      "wise transfer fees",
      "wise travel card",
      "wise review",
      "wise vs revolut",
    ],
  },

  bunq: {
    tagline: "Dutch bank with NL IBAN and sub-accounts for freelancers",
    description:
      "Dutch digital bank with a full licence and a free plan. Sub-accounts with their own IBAN, automations and tools to manage personal or business spending.",
    country: "Netherlands",
    headquarters: "Amsterdam",
    ibanCountry: "Netherlands",
    supportLanguages: ["English", "Dutch", "German", "French"],
    fees: {
      monthly: "€0 (Free plan)",
      setup: "Free",
      inactivity: "None",
      atmEU: "Free: €2.99/withdrawal; Core: €0.99 (first 5); Pro/Elite: 6 free/month",
      atmInternational: "Same as in the EU; +0.5% if currency conversion applies",
      fxRate: "Real Mastercard rate + 0.5% (Free: up to €1,000/year, then 1.5%)",
    },
    cardType: "Mastercard",
    keyPros: [
      "Up to 25 accounts with their own IBAN (3 on Free, 5 on Core)",
      "Automations and smart rules",
      "Great for splitting expenses and budgets",
    ],
    keyCons: [
      "Paid ATM withdrawals on Free and Core (€2.99 / €0.99 per withdrawal)",
      "App and support mainly in English",
    ],
    idealFor: "Freelancers, SMEs and sub-account budgeting",
    requirements: ["National ID", "EU resident"],
    acceptedCountries: ["All EU"],
    license: "Dutch banking licence",
    depositGuarantee: "€100,000 (Dutch Deposit Guarantee Fund, DNB)",
    regulatedBy: ["DNB", "ECB"],
    metaTitle: "Bunq Spain 2026: pricing, NL IBAN and sub-accounts",
    metaDescription:
      "Bunq in Spain 2026: Dutch bank with NL IBAN, sub-accounts with their own IBAN and automations. Prices, benefits and review.",
    keywords: [
      "bunq spain 2026",
      "bunq dutch iban NL",
      "bunq sub-accounts with iban",
      "bunq for freelancers",
      "bunq pricing 2026",
      "bunq review",
    ],
  },

  // ====================== SPAIN (published) ======================
  santander: {
    tagline: "Spanish bank with ES IBAN, full app and broad product range",
    description:
      "Traditional Spanish bank with an international presence. Accounts, cards and services for individuals and businesses; terms vary by product.",
    country: "Spain",
    headquarters: "Santander",
    ibanCountry: "Spain",
    fees: {
      ...SPANISH_FEES_EN,
      monthly: "From €0 (depending on account and terms)",
    },
    cardType: "Debit and credit (depending on account)",
    keyPros: [
      "Spanish IBAN for salary and direct debits",
      "Wide network and product range",
      "Full app and online banking",
    ],
    keyCons: [
      "Fees and requirements depend on the account",
      "Some plans require bundled products",
    ],
    idealFor: "Main account in Spain and everyday banking",
    acceptedCountries: ["Spain", "EU (depending on account)"],
    ...SPANISH_COMPLIANCE_EN,
  },

  bbva: {
    tagline: "Spanish bank with ES IBAN and online onboarding (depending on account)",
    description:
      "Spanish bank with advanced digital banking. Accounts, cards and savings/investment products; availability and fees depend on the plan.",
    country: "Spain",
    headquarters: "Bilbao",
    ibanCountry: "Spain",
    fees: { ...SPANISH_FEES_EN },
    cardType: "Debit and credit (depending on account)",
    keyPros: ["Spanish IBAN", "Good app and online banking", "Broad range in Spain"],
    keyCons: ["Variable requirements", "Terms change by account"],
    idealFor: "Everyday account in Spain, managed from the app",
    ...SPANISH_COMPLIANCE_EN,
  },

  caixabank: {
    tagline: "Spanish bank with ES IBAN, wide branch network and digital options",
    description:
      "Traditional bank with a strong presence in Spain. App and web banking plus a wide branch network; fees depend on the account.",
    country: "Spain",
    headquarters: "Valencia",
    ibanCountry: "Spain",
    fees: { ...SPANISH_FEES_EN },
    cardType: "Debit and credit (depending on account)",
    keyPros: ["Spanish IBAN", "Extensive network in Spain", "Full app"],
    keyCons: ["Bundling depends on account", "Variable terms"],
    idealFor: "Main account with in-person support",
    ...SPANISH_COMPLIANCE_EN,
  },

  openbank: {
    tagline: "Digital bank with ES IBAN and 100% online onboarding (depending on account)",
    description:
      "Digital bank focused on online banking. A good fit if you prioritise managing everything from the app/web; terms and fees depend on the product.",
    country: "Spain",
    headquarters: "Madrid",
    ibanCountry: "Spain",
    fees: { ...SPANISH_FEES_EN },
    cardType: "Debit (depending on account)",
    keyPros: ["Spanish IBAN", "Digital-first", "Banking from app/web"],
    keyCons: ["Terms change by product", "Less multi-currency focus"],
    idealFor: "Online account in Spain",
    ...SPANISH_COMPLIANCE_EN,
  },

  ing: {
    tagline: "European bank with an account in Spain (ES IBAN) and online banking",
    description:
      "Spanish branch of ING Bank N.V. (Netherlands), with online banking. Accounts and cards focused on digital management; deposits are covered by the Dutch deposit guarantee scheme (DNB) up to €100,000. Terms and fees depend on the plan.",
    country: "Spain",
    headquarters: "Madrid",
    ibanCountry: "Spain",
    fees: { ...SPANISH_FEES_EN },
    cardType: "Debit (depending on account)",
    keyPros: ["Spanish IBAN", "Digital banking", "Established brand in Europe"],
    keyCons: ["Variable terms", "Limited multi-currency range"],
    idealFor: "Everyday account in Spain with online management",
    license: "Branch in Spain of ING Bank N.V. (Netherlands)",
    depositGuarantee: "Up to €100,000 (Dutch deposit guarantee scheme, DNB)",
    regulatedBy: ["ECB", "De Nederlandsche Bank (DNB)", "Bank of Spain"],
  },

  // ====================== SPAIN (in review — defaults + tagline) ======================
  sabadell: {
    tagline: "Spanish bank with ES IBAN and accounts for individuals/businesses",
    country: "Spain",
    headquarters: "Alicante",
    ibanCountry: "Spain",
    ...SPANISH_COMPLIANCE_EN,
  },
  bankinter: {
    tagline: "Spanish bank with ES IBAN and savings & investment products",
    country: "Spain",
    headquarters: "Madrid",
    ibanCountry: "Spain",
    ...SPANISH_COMPLIANCE_EN,
  },
  abanca: {
    tagline: "Spanish bank with ES IBAN and a strong presence in the north-west",
    country: "Spain",
    headquarters: "Betanzos (A Coruña)",
    ibanCountry: "Spain",
    ...SPANISH_COMPLIANCE_EN,
  },
  unicaja: {
    tagline: "Spanish bank with ES IBAN and services for individuals",
    country: "Spain",
    headquarters: "Málaga",
    ibanCountry: "Spain",
    ...SPANISH_COMPLIANCE_EN,
  },
  cajamar: {
    tagline: "Cooperative bank with ES IBAN and a retail banking focus",
    country: "Spain",
    headquarters: "Almería",
    ibanCountry: "Spain",
    license: "Credit cooperative (Spanish licence)",
    depositGuarantee: "Up to €100,000 (Spanish DGS)",
    regulatedBy: ["Bank of Spain", "ECB"],
  },
  "banca-march": {
    tagline: "Spanish bank with ES IBAN and a premium focus (depending on product)",
    country: "Spain",
    headquarters: "Palma",
    ibanCountry: "Spain",
    ...SPANISH_COMPLIANCE_EN,
  },
  evo: {
    tagline: "Brand folded into Bankinter since 2025: no longer accepting new customers",
    description:
      "EVO Banco was absorbed by Bankinter in April 2025 and stopped operating as an independent entity. Its customers moved to Bankinter; no new accounts can be opened under the EVO brand.",
    country: "Spain",
    headquarters: "Madrid",
    ibanCountry: "Spain",
  },
  myinvestor: {
    tagline: "Spanish neobank with ES IBAN, interest-bearing account and investing",
    description:
      "Spanish neobank specialising in investing, backed by Grupo Andbank, El Corte Inglés Seguros and AXA. Interest-bearing account, deposits, funds and automated portfolios; rates and terms depend on the product and timing.",
    country: "Spain",
    headquarters: "Madrid",
    ibanCountry: "Spain",
    keyPros: [
      "Investing and savings focus",
      "Online banking",
      "Alternative for long-term investors",
    ],
    keyCons: ["No physical branches", "Terms depend on the product"],
    idealFor: "Saving and investing with a digital focus",
    license: "Bank (Spanish licence)",
    depositGuarantee: "Up to €100,000 (Spanish DGS)",
    regulatedBy: ["Bank of Spain", "CNMV"],
  },

  // ====================== FINTECH / BUSINESS ======================
  qonto: {
    tagline: "Business/freelancer account with management tools",
    country: "France",
    headquarters: "Paris",
    ibanCountry: "Spain",
    keyPros: [
      "Invoicing and expense tools",
      "Built for businesses/freelancers",
      "Multi-user management",
    ],
    keyCons: ["Not a personal account", "Price depends on plan"],
    idealFor: "Freelancers and SMEs that want tidy bookkeeping",
    fees: {
      monthly: "€0 (Starter plan); from €9/month (excl. VAT)",
      setup: "€0",
      inactivity: "Depends on plan",
      atmEU: "Depends on plan",
      atmInternational: "Depends on plan",
      fxRate: "Varies by provider",
    },
    acceptedCountries: ["EU (depending on plan)"],
  },

  "trade-republic": {
    tagline: "German bank with an interest-bearing account, investing and card in one app",
    description:
      "German bank with a full licence (BaFin) and a branch in Spain, with Spanish IBAN and Bizum. Pays interest on cash at the ECB rate (2.50%; new clients 4% up to €20,000 until 1 March 2027). Commission-free ETF savings plans, €1 orders and a card with 1% Saveback.",
    country: "Germany",
    headquarters: "Berlin",
    ibanCountry: "Spain",
    keyPros: [
      "Investing and savings focus",
      "Simple app",
      "Competitive costs (depending on product)",
    ],
    keyCons: ["No physical branches", "Terms can change by country"],
    idealFor: "Beginner investors who want simplicity",
    fees: {
      monthly: "€0",
      setup: "Free",
      inactivity: "None",
      atmEU: "Depends on card/terms",
      atmInternational: "Depends on card/terms",
      fxRate: "Varies by provider",
    },
    acceptedCountries: [
      "Spain", "Germany", "France", "Italy", "Netherlands", "Austria",
      "Belgium", "Ireland", "Portugal", "Finland", "Greece", "Estonia",
      "Latvia", "Lithuania", "Luxembourg", "Slovakia", "Slovenia", "Poland",
    ],
    license: "Bank (German licence, BaFin)",
    depositGuarantee: "Up to €100,000 (cash held at partner banks)",
    regulatedBy: ["BaFin", "ECB"],
  },

  // ====================== EUROPE (directory — defaults + tagline) ======================
  "bnp-paribas": {
    tagline: "Traditional French bank with a broad range across Europe",
    country: "France",
    headquarters: "Paris",
    ibanCountry: "France",
    acceptedCountries: ["France", "EU (depending on product)"],
  },
  "credit-agricole": {
    tagline: "French cooperative bank with a national presence",
    country: "France",
    headquarters: "Montrouge",
    ibanCountry: "France",
    acceptedCountries: ["France", "EU (depending on product)"],
  },
  "societe-generale": {
    tagline: "Traditional French bank with products for individuals and businesses",
    country: "France",
    headquarters: "Paris",
    ibanCountry: "France",
    acceptedCountries: ["France", "EU (depending on product)"],
  },
  unicredit: {
    tagline: "Italian/European bank with a broad range",
    country: "Italy",
    headquarters: "Milan",
    ibanCountry: "Italy",
    acceptedCountries: ["Italy", "EU (depending on product)"],
  },
  "intesa-sanpaolo": {
    tagline: "Italian bank focused on retail banking",
    country: "Italy",
    headquarters: "Turin",
    ibanCountry: "Italy",
    acceptedCountries: ["Italy", "EU (depending on product)"],
  },
  "abn-amro": {
    tagline: "Dutch bank with euro accounts (depending on country)",
    country: "Netherlands",
    headquarters: "Amsterdam",
    ibanCountry: "Netherlands",
    acceptedCountries: ["Netherlands", "EU (depending on product)"],
  },
  rabobank: {
    tagline: "Dutch cooperative bank (depending on availability)",
    country: "Netherlands",
    headquarters: "Utrecht",
    ibanCountry: "Netherlands",
    acceptedCountries: ["Netherlands", "EU (depending on product)"],
  },
  commerzbank: {
    tagline: "Traditional German bank with euro accounts",
    country: "Germany",
    headquarters: "Frankfurt",
    ibanCountry: "Germany",
    acceptedCountries: ["Germany", "EU (depending on product)"],
  },
  dkb: {
    tagline: "German bank with a digital focus (depending on product)",
    country: "Germany",
    headquarters: "Berlin",
    ibanCountry: "Germany",
    acceptedCountries: ["Germany", "EU (depending on product)"],
  },
  "deutsche-bank": {
    tagline: "German bank with an international presence",
    country: "Germany",
    headquarters: "Frankfurt",
    ibanCountry: "Germany",
    acceptedCountries: ["Germany", "EU (depending on product)"],
  },
  "erste-bank": {
    tagline: "Austrian bank with a retail focus",
    country: "Austria",
    headquarters: "Vienna",
    ibanCountry: "Austria",
    acceptedCountries: ["Austria", "EU (depending on product)"],
  },
  raiffeisen: {
    tagline: "Cooperative banking group (depending on country and entity)",
    country: "Austria",
    headquarters: "Vienna",
    ibanCountry: "Austria",
    acceptedCountries: ["Austria", "EU (depending on entity)"],
  },
  ubs: {
    tagline: "Swiss bank with a broad range (depending on country)",
    country: "Switzerland",
    headquarters: "Zurich",
    ibanCountry: "Switzerland",
    acceptedCountries: ["Switzerland", "EU (depending on product)"],
    license: "Check the licence on the official website",
    depositGuarantee: "Up to CHF 100,000 (esisuisse)",
    regulatedBy: ["FINMA"],
  },
  nordea: {
    tagline: "Nordic bank present in several countries (depending on product)",
    country: "Finland",
    headquarters: "Helsinki",
    ibanCountry: "Finland",
    acceptedCountries: ["Nordic countries", "EU (depending on product)"],
  },
  "danske-bank": {
    tagline: "Danish bank with accounts and cards (depending on country)",
    country: "Denmark",
    headquarters: "Copenhagen",
    ibanCountry: "Denmark",
    acceptedCountries: ["Denmark", "EU (depending on product)"],
    license: "Check the licence on the official website",
    depositGuarantee: "Up to €100,000 (Garantiformuen)",
    regulatedBy: ["Finanstilsynet"],
  },
  cgd: {
    tagline: "Traditional Portuguese bank (depending on product)",
    country: "Portugal",
    headquarters: "Lisbon",
    ibanCountry: "Portugal",
    acceptedCountries: ["Portugal", "EU (depending on product)"],
  },
  "millennium-bcp": {
    tagline: "Portuguese bank with retail services (depending on product)",
    country: "Portugal",
    headquarters: "Porto",
    ibanCountry: "Portugal",
    acceptedCountries: ["Portugal", "EU (depending on product)"],
  },
  triodos: {
    tagline: "Ethical bank with a branch in Spain: accounts with ES IBAN",
    country: "Netherlands",
    headquarters: "Driebergen-Rijsenburg",
    ibanCountry: "Netherlands",
    acceptedCountries: ["Spain", "Netherlands", "EU (depending on country)"],
    metaTitle: "Triodos Bank Spain: fees, ES IBAN and reviews (2026)",
  },

  // ====================== BROKERS / SAVINGS APPS ======================
  "trading-212": {
    tagline: "Account with daily interest on cash and commission-free investing",
    description:
      "British and European investment platform licensed by the FCA, CySEC and BaFin. Daily interest on uninvested cash (2.3% APR in EUR, 4% in GBP; variable) and a Mastercard debit card with no FX fee.",
    country: "United Kingdom / Cyprus",
    headquarters: "London",
    ibanCountry: "Not applicable",
    fees: {
      monthly: "€0",
      setup: "€0",
      inactivity: "€0",
      atmEU: "Free up to €400/month",
      atmInternational: "1% (above €400/month)",
      fxRate: "0.15%",
    },
    acceptedCountries: ["Spain", "European Union", "United Kingdom"],
    license: "Broker (FCA, CySEC, BaFin)",
    depositGuarantee: "Investor compensation up to €20,000 (ICF)",
    regulatedBy: ["FCA", "CySEC", "BaFin"],
    metaTitle: "Trading 212: fees, interest and reviews (2026)",
    keywords: ["Trading 212 review", "Trading 212 fees", "Trading 212 interest", "Trading 212 card"],
  },
  freedom24: {
    tagline: "European broker listed on NASDAQ with a high-yield D Account",
    description:
      "Investment and savings platform regulated by CySEC. Offers the cumulative D Account with daily interest (2.42% a year in EUR and 3.92% in USD, variable with EURIBOR and SOFR) and term deposits at higher rates.",
    country: "Cyprus",
    headquarters: "Limassol",
    ibanCountry: "Cyprus",
    fees: {
      monthly: "€0",
      setup: "€0",
      inactivity: "€0",
      atmEU: "Not applicable",
      atmInternational: "Not applicable",
      fxRate: "Real market rate",
    },
    acceptedCountries: ["Spain", "European Union"],
    license: "Broker (CySEC, licence 275/15)",
    depositGuarantee: "Investor compensation up to €20,000 (ICF)",
    regulatedBy: ["CySEC"],
  },
  plum: {
    tagline: "Smart app for automatic saving and interest-bearing pockets",
    description:
      "Financial app that automates saving with AI, lets you invest in stocks, ETFs and crypto, and offers Plum Interest, a money-market fund paying up to 1.12% a year on the free plan (varies by plan).",
    country: "United Kingdom / Greece",
    headquarters: "London",
    ibanCountry: "Not applicable",
    fees: {
      monthly: "€0 (Basic plan); paid plans from €3.99/month",
      setup: "€0",
      inactivity: "€0",
      atmEU: "Not applicable",
      atmInternational: "Not applicable",
      fxRate: "Not applicable",
    },
    acceptedCountries: [
      "Spain", "France", "Ireland", "United Kingdom", "Portugal",
      "Italy", "Belgium", "Netherlands", "Greece", "Cyprus",
    ],
    license: "Electronic money institution (FCA)",
    depositGuarantee: "Safeguarded funds (no deposit guarantee)",
    regulatedBy: ["FCA"],
    metaTitle: "Plum App: automatic saving, interest and reviews (2026)",
    keywords: ["Plum review", "Plum automatic saving", "Plum interest", "Plum app Spain"],
  },
  klarna: {
    tagline: "Flexible savings account and smart shopping management",
    description:
      "Swedish bank with a Flex account at 2.22% APR (variable, no minimum and no fees), Visa card, cashback on purchases and flexible payment options.",
    country: "Sweden",
    headquarters: "Stockholm",
    ibanCountry: "Sweden",
    fees: {
      monthly: "€0",
      setup: "€0",
      inactivity: "€0",
      atmEU: "Not applicable",
      atmInternational: "Not applicable",
      fxRate: "No fee",
    },
    acceptedCountries: ["Spain", "Germany", "Sweden", "European Union"],
    license: "Bank (Swedish licence)",
    depositGuarantee: "Up to SEK 1,150,000 (~€103,800, Swedish scheme)",
    regulatedBy: ["Finansinspektionen"],
  },
  sumup: {
    tagline: "Business and freelancer account with debit card and card-reader payments",
    description:
      "All-in-one solution for freelancers and small businesses: account with European IBAN, free business Mastercard, card-reader payments and instant payouts. The personal SumUp Pay account adds 5% cashback at SumUp merchants, 2% at supermarkets and 0.5% elsewhere.",
    country: "Germany",
    headquarters: "Berlin",
    ibanCountry: "Ireland / Lithuania",
    fees: {
      monthly: "€0",
      setup: "€0",
      inactivity: "€0",
      atmEU: "3 free withdrawals/month",
      atmInternational: "2%",
      fxRate: "Standard Mastercard",
    },
    acceptedCountries: ["Spain", "European Union"],
    license: "Electronic money institution",
    depositGuarantee: "Safeguarded funds (no deposit guarantee)",
    regulatedBy: ["Bank of Lithuania", "Central Bank of Ireland"],
  },
};

// ---------------------------------------------------------------------------
// Translation helpers
// ---------------------------------------------------------------------------

function trExact(value: string): string {
  return EXACT_EN[value] ?? value;
}

function trList(values: string[] | undefined): string[] {
  return (values ?? []).map(trExact);
}

function trCountryList(values: string[] | undefined): string[] {
  return (values ?? []).map(translateCountryName);
}

function translateFees(
  bank: Bank,
  override: BankEnOverride,
): Bank["fees"] {
  const base = bank.fees;
  const o = override.fees ?? {};
  return {
    monthly: o.monthly ?? trExact(base.monthly),
    setup: o.setup ?? trExact(base.setup),
    inactivity: o.inactivity ?? trExact(base.inactivity),
    atmEU: o.atmEU ?? trExact(base.atmEU),
    atmInternational: o.atmInternational ?? trExact(base.atmInternational),
    fxRate: o.fxRate ?? trExact(base.fxRate),
    transfer: base.transfer ? (o.transfer ?? trExact(base.transfer)) : undefined,
    cardReplacement: base.cardReplacement
      ? (o.cardReplacement ?? trExact(base.cardReplacement))
      : undefined,
  };
}

function translateDescription(bank: Bank, override: BankEnOverride, enTagline: string): string {
  if (override.description) return override.description;
  // createDraftBank() default: "<tagline> Consulta condiciones y
  // disponibilidad en la web oficial." — rebuild from the EN tagline.
  if (
    bank.description.startsWith(bank.tagline) &&
    bank.description.endsWith(ES_DESCRIPTION_SUFFIX)
  ) {
    return `${enTagline}${EN_DESCRIPTION_SUFFIX}`;
  }
  return EXACT_EN[bank.description] ?? bank.description;
}

function translateSeo(
  bank: Bank,
  override: BankEnOverride,
  enTagline: string,
): Bank["seo"] {
  const defaultMetaTitle = `${bank.name}: comisiones, IBAN ${bank.ibanPrefix} y opiniones (2026)`;
  const defaultKeywords = [
    `${bank.name} opiniones`,
    `${bank.name} comisiones`,
    `cuenta ${bank.name}`,
    `IBAN ${bank.ibanPrefix}`,
  ];
  const isDefaultTitle = bank.seo.metaTitle === defaultMetaTitle;
  const isDefaultKeywords =
    JSON.stringify(bank.seo.keywords) === JSON.stringify(defaultKeywords);

  return {
    ...bank.seo,
    metaTitle:
      override.metaTitle ??
      (isDefaultTitle
        ? `${bank.name}: fees, ${bank.ibanPrefix} IBAN and reviews (2026)`
        : bank.seo.metaTitle),
    // createDraftBank() defaults metaDescription to the (Spanish) tagline.
    metaDescription:
      override.metaDescription ??
      (bank.seo.metaDescription === bank.tagline
        ? enTagline
        : bank.seo.metaDescription),
    keywords:
      override.keywords ??
      (isDefaultKeywords
        ? [
            `${bank.name} review`,
            `${bank.name} fees`,
            `${bank.name} account`,
            `IBAN ${bank.ibanPrefix}`,
          ]
        : bank.seo.keywords),
  };
}

/**
 * Return an English copy of a bank. Lookup order per field: per-bank
 * override → exact dictionary (EXACT_EN) → country map (country-like
 * fields) → original string. Never throws, never blanks a field: an
 * untranslated string is returned as-is so a missing entry degrades to
 * the current behaviour instead of breaking the page.
 *
 * NOTE: `tagline`/`description`/`keyPros`/`keyCons` in the returned object
 * are English; `name`, `slug`, `logo`, `website`, `rating`, `tags`,
 * `category`, `_priority`, `_status`, `_lastUpdated` pass through
 * unchanged (tags/categories have their own per-page label maps).
 */
export function getBankEn(bank: Bank): Bank {
  const o = BANK_EN_OVERRIDES[bank.slug] ?? {};
  const enTagline = o.tagline ?? trExact(bank.tagline);

  return {
    ...bank,
    tagline: enTagline,
    description: translateDescription(bank, o, enTagline),
    country: o.country ?? translateCountryName(bank.country),
    headquarters: o.headquarters ?? bank.headquarters,
    ibanCountry: o.ibanCountry ?? translateCountryName(bank.ibanCountry),
    currencies: o.currencies ?? trList(bank.currencies),
    support: {
      ...bank.support,
      languages: o.supportLanguages ?? trList(bank.support.languages),
      responseTime: o.responseTime ?? (bank.support.responseTime
        ? trExact(bank.support.responseTime)
        : undefined),
    },
    fees: translateFees(bank, o),
    cardType: o.cardType ?? trExact(bank.cardType),
    keyPros: o.keyPros ?? trList(bank.keyPros),
    keyCons: o.keyCons ?? trList(bank.keyCons),
    idealFor: o.idealFor ?? trExact(bank.idealFor),
    requirements: o.requirements ?? trList(bank.requirements),
    acceptedCountries: o.acceptedCountries ?? trCountryList(bank.acceptedCountries),
    compliance: {
      license: o.license ?? trExact(bank.compliance.license),
      depositGuarantee: o.depositGuarantee ?? trExact(bank.compliance.depositGuarantee),
      regulatedBy: o.regulatedBy ?? trList(bank.compliance.regulatedBy),
    },
    seo: translateSeo(bank, o, enTagline),
  };
}

/** English copy of the whole dataset, same order as `banks`. */
export function getBanksEn(banks: Bank[]): Bank[] {
  return banks.map(getBankEn);
}
