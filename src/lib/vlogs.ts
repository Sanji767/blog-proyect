// src/lib/vlogs.ts

export type Vlog = {
  slug: string;
  title: string;
  description: string;
  date: string;          // ISO string: "2025-11-16"
  image?: string;        // portada opcional
  tags?: string[];
  readingTime?: string;  // "5 min", "8 min", etc.
  featured?: boolean;    // para destacar algunos
  content: string;       // de momento texto plano
};

export const vlogs: Vlog[] = [
  {
    slug: "mejores-bancos-digitales-europa-2025",
    title: "Mejores bancos digitales en Europa 2025",
    description:
      "Un repaso claro y directo por los bancos digitales que más sentido tienen este año si vives, trabajas o viajas por Europa.",
    date: "2025-11-16",
    image: "/images/vlogs/bancos-europa-2025.jpg",
    tags: ["bancos", "europa", "comparativa"],
    readingTime: "7 min",
    featured: true,
    content: `
Los bancos digitales han pasado de ser algo "nuevo y raro" a ser la opción principal para muchísima gente que vive, viaja o trabaja entre varios países.

En este artículo te cuento qué bancos digitales están funcionando mejor en 2025, qué tiene sentido según tu situación y en qué casos un banco tradicional sigue siendo buena idea.

(… aquí puedes seguir escribiendo tu contenido con párrafos separados por líneas en blanco …)
    `.trim(),
  },
  {
    slug: "revolut-vs-n26-vs-wise",
    title: "Revolut vs N26 vs Wise: ¿cuál te conviene?",
    description:
      "Comparativa honesta entre Revolut, N26 y Wise según comisiones, uso diario, multidivisa y facilidad para abrir cuenta.",
    date: "2025-11-10",
    image: "/images/vlogs/revolut-n26-wise.jpg",
    tags: ["comparativa", "revolut", "n26", "wise"],
    readingTime: "9 min",
    featured: true,
    content: `
Revolut, N26 y Wise son tres de los nombres que más se repiten cuando alguien busca abrir una cuenta "moderna" para vivir o moverse por Europa.

La realidad es que no hay un ganador absoluto: depende mucho de cómo usas el dinero, en qué moneda cobras y desde qué países operas.

(… contenido …)
    `.trim(),
  },
  // añade más artículos aquí
];
