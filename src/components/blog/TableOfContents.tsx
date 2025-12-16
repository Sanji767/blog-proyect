// src/components/blog/TableOfContents.tsx
'use client';

import { useEffect, useState } from "react";

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<{ text: string; level: number; id: string }[]>([]);

  useEffect(() => {
    const lines = content.split("\n");
    const parsed: { text: string; level: number; id: string }[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.+?)(?:\s+{#(.+?)})?$/);
      if (match) {
        const level = match[1].length;
        let text = match[2].trim();
        const customId = match[3];

        text = text.replace(/\[(.*?)\]\(.*?\)/g, "$1");

        const id = customId || text
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/^-+|-+$/g, "");

        if (id) parsed.push({ text, level, id });
      }
    });

    setHeadings(parsed);
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <nav className="not-prose bg-muted/50 border border-border/50 rounded-3xl p-8 mb-16">
      <h3 className="text-xl font-black mb-6 flex items-center gap-3">
        <span className="text-primary">📍</span> Tabla de contenidos
      </h3>
      <ul className="space-y-3 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "ml-6" : ""}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-foreground/70 hover:text-primary transition flex items-center gap-2 group"
            >
              <span className="opacity-0 group-hover:opacity-100 transition">→</span>
              <span className={h.level === 2 ? "font-medium" : ""}>
                {h.text}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}