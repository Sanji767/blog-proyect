// scripts/generateArticles.mjs
import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import matter from "gray-matter";

// Cargar variables de entorno
dotenv.config();

// Inicializar OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Carpeta donde se guardarán los posts
const POSTS_DIR = path.join(process.cwd(), "src/content/blog/posts");
fs.ensureDirSync(POSTS_DIR);

// Temas de ejemplo para la generación profesional
const topics = [
  {
    title: "Los mejores bancos digitales en Europa en 2026",
    category: "bancos",
    tags: ["bancos", "finanzas", "Europa", "banca digital"],
    linkCTA: "/programas/revolut",
  },
  {
    title: "Cómo gestionar tus finanzas personales de forma eficiente",
    category: "finanzas",
    tags: ["finanzas", "ahorro", "inversiones", "gestion"],
    linkCTA: "/ventajas",
  },
  {
    title: "Tarjetas de crédito y débito: ventajas y consejos",
    category: "bancos",
    tags: ["tarjetas", "bancos", "finanzas", "consejos"],
    linkCTA: "/programas/n26",
  },
];

// Función para generar contenido MDX usando OpenAI
async function generateMDX(topic) {
  const prompt = `
Eres un experto en finanzas, inversiones y banca digital. Genera un artículo profesional para un blog sobre "${topic.title}".
- Contenido enfocado en las últimas noticias del mercado de inversiones y novedades en bancos.
- Extensión: 600-900 palabras
- Estilo: profesional, cercano, lenguaje claro y útil para usuarios interesados en finanzas
- Estructura: títulos H1/H2/H3, listas, ejemplos prácticos genéricos (no inventes información específica que no sea pública)
- Incluye consejos prácticos para los usuarios y menciona tendencias recientes del sector financiero
- Añade un enlace interno al final como CTA: [¡Abre una cuenta recomendada aquí!](${topic.linkCTA})
- No incluyas frontmatter, solo el contenido en Markdown
- No uses imágenes ni links externos innecesarios
`;

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content.trim();
}

// Generar posts
async function main() {
  for (const topic of topics) {
    try {
      const content = await generateMDX(topic);

      // Frontmatter sin imagen
      const mdx = matter.stringify(content, {
        title: topic.title,
        date: new Date().toISOString(),
        category: topic.category,
        tags: topic.tags,
      });

      // Crear archivo con slug-friendly
      const slug = topic.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
      await fs.writeFile(filePath, mdx, "utf-8");

      console.log(`✅ Post generado: ${filePath}`);
    } catch (err) {
      console.error("❌ Error generando post:", err.message);
    }
  }
}

main();
