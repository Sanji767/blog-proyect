// content/tags/index.ts
export const tags = [
  { slug: "sincomisiones", title: "Sin comisiones" },
  { slug: "revolut", title: "Revolut" },
  { slug: "virtual", title: "Tarjeta virtual" },
  { slug: "multidivisa", title: "Multidivisa" },
  { slug: "viajes", title: "Viajes" },
] as const;

export type Tag = (typeof tags)[number];
