// content/categories/index.ts
export const categories = [
  {
    slug: "bancos-digitales",
    title: "Bancos digitales",
    description: "Neobancos y cuentas online en Europa.",
  },
  {
    slug: "cuentas-sin-comisiones",
    title: "Cuentas sin comisiones",
    description: "Cuentas gratis, SEPA y sin letra pequeña.",
  },
  {
    slug: "tarjetas",
    title: "Tarjetas",
    description: "Tarjetas físicas/virtuales para viajar y pagar sin recargos.",
  },
  {
    slug: "ahorro",
    title: "Ahorro",
    description: "Trucos reales para ahorrar y organizar finanzas.",
  },
] as const;

export type Category = (typeof categories)[number];
