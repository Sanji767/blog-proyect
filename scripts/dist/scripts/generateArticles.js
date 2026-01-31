import fs from "fs-extra";
import path from "path";
import matter from "gray-matter";
import OpenAI from "openai";
import "dotenv/config";
const POSTS_DIR = path.join(process.cwd(), "src/content/blog/posts");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
async function generateBlogPost(topic, year) {
    const prompt = `Escribe un artículo de blog sobre "${topic}" en Markdown/MDX con H1, H2, bullets y excerpt.`;
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });
    const content = response.choices[0].message?.content ?? "";
    const titleMatch = content.match(/^#\s*(.+)/m);
    const title = titleMatch ? titleMatch[1].trim() : topic;
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const date = new Date().toISOString();
    return { title, slug, date, year, category: "general", tags: [], content };
}
async function savePost(post) {
    const dir = path.join(POSTS_DIR, post.year ?? new Date().getFullYear().toString());
    await fs.ensureDir(dir);
    const filePath = path.join(dir, `${post.slug}.mdx`);
    const frontmatter = matter.stringify(post.content, {
        title: post.title,
        date: post.date,
        category: post.category,
        tags: post.tags,
        excerpt: post.excerpt ?? "",
    });
    await fs.writeFile(filePath, frontmatter);
    console.log(`✅ Post generado: ${filePath}`);
}
async function main() {
    const topics = [
        "Next.js y SEO",
        "Optimización de imágenes con Tailwind",
        "ISR en Next.js explicado",
        "Cómo crear un blog automático con GPT-4",
        "Mejores prácticas de frontmatter en MDX",
        "Incrementar visitas con contenido automatizado",
    ];
    const year = new Date().getFullYear().toString();
    for (const topic of topics) {
        const post = await generateBlogPost(topic, year);
        await savePost(post);
    }
    console.log("🎉 Todos los posts han sido generados con éxito!");
}
main().catch(console.error);
