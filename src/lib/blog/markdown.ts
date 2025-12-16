// src/lib/blog/markdown.ts
import { readFile } from "fs/promises";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export async function parseMarkdownFile(filePath: string) {
  const raw = await readFile(filePath, "utf-8");

  const { data, content } = matter(raw);

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content);

  return {
    frontmatter: data,
    html: processed.toString(),
  };
}
