// src/lib/blog/markdown.ts
import { readFile } from "fs/promises";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export function stripLeadingMarkdownH1(markdown: string): string {
  if (!markdown) return markdown;

  const normalized = markdown.replace(/^\uFEFF/, "");
  const lines = normalized.replace(/\r\n/g, "\n").split("\n");

  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;

  // ATX style: "# Title"
  if (i < lines.length && /^#\s+/.test(lines[i])) {
    i += 1;
    while (i < lines.length && lines[i].trim() === "") i++;
    return lines.slice(i).join("\n").trimStart();
  }

  // Setext style:
  // Title
  // =====
  if (
    i + 1 < lines.length &&
    lines[i].trim() !== "" &&
    /^={2,}\s*$/.test(lines[i + 1])
  ) {
    i += 2;
    while (i < lines.length && lines[i].trim() === "") i++;
    return lines.slice(i).join("\n").trimStart();
  }

  return markdown;
}

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
