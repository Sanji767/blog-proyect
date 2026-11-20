// src/lib/tools.ts
// Single source of truth for the free tools listed on /herramientas.
// The homepage trust bar reads TOOLS.length, so keep this list in sync
// with the tools that actually exist as pages.

export type Tool = {
  href: string;
  label: string;
  meta: string;
  desc: string;
  category: "Banca" | "Ahorro e inversión";
  featured?: boolean;
};

export const TOOLS: Tool[] = [
  {
    href: "/iban",
    label: "IBAN Scanner",
    meta: "Validador SEPA + entidad",
    desc: "Comprueba longitud, país, SEPA y (cuando aplica) banco asociado. Incluye historial y modo bulk.",
    category: "Banca",
    featured: true,
  },
  {
    href: "/comparativa",
    label: "Comparativa de bancos",
    meta: "Ranking editorial 2026",
    desc: "Filtra por IBAN, comisiones, soporte en español, multidivisa y más. Exporta comparativas a PDF.",
    category: "Banca",
    featured: true,
  },
  {
    href: "/herramientas/tae",
    label: "Calculadora TAE",
    meta: "Desde TIN + capitalización",
    desc: "Convierte TIN a TAE y estima interés anual. Incluye comisión fija opcional y enlace para compartir.",
    category: "Banca",
  },
  {
    href: "/herramientas/hipoteca",
    label: "Calculadora de hipoteca",
    meta: "Euríbor + diferencial + revisión",
    desc: "Calcula tu cuota mensual con tipo variable o fijo, y simula cuánto cambiará en la próxima revisión del euríbor.",
    category: "Banca",
    featured: true,
  },
  {
    href: "/herramientas/interes-compuesto",
    label: "Calculadora de interés compuesto",
    meta: "Aportaciones + inflación",
    desc: "Proyecta tu capital con aportaciones mensuales y ajusta por inflación para ver el valor real.",
    category: "Ahorro e inversión",
    featured: true,
  },
  {
    href: "/herramientas/objetivo-ahorro",
    label: "Objetivo de ahorro",
    meta: "Aportación mensual",
    desc: "Calcula cuánto aportar al mes para llegar a una meta en X años con una rentabilidad esperada.",
    category: "Ahorro e inversión",
  },
  {
    href: "/herramientas/inflacion",
    label: "Calculadora de inflación",
    meta: "Poder adquisitivo",
    desc: "Calcula cuánto necesitas en el futuro para mantener el mismo poder adquisitivo.",
    category: "Ahorro e inversión",
  },
  {
    href: "/herramientas/regla-4",
    label: "Regla del 4% (FIRE)",
    meta: "Capital objetivo",
    desc: "Estimación rápida de capital necesario para sostener un gasto anual según una tasa de retirada.",
    category: "Ahorro e inversión",
  },
];
