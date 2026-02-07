// src/components/blog/TableOfContents.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { List } from "lucide-react";

type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseHeadingsFromMarkdown(content: string): Heading[] {
  const lines = content.split("\n");
  const parsed: Heading[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+?)(?:\s+{#(.+?)})?$/);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    let text = match[2].trim();
    const customId = match[3];

    // Strip markdown links so the TOC label reads nicely.
    text = text.replace(/\[(.*?)\]\(.*?\)/g, "$1");

    const id = (customId || slugify(text)).trim();
    if (!id) continue;

    parsed.push({ id, text, level });
  }

  return parsed;
}

function parseHeadingsFromDom(): Heading[] {
  const nodes = Array.from(
    document.querySelectorAll("article h2[id], article h3[id]")
  );

  return nodes
    .map((el) => {
      const level = el.tagName === "H2" ? 2 : 3;
      const id = (el as HTMLElement).id;
      const text = (el as HTMLElement).textContent?.trim() ?? "";
      return { id, text, level } as Heading;
    })
    .filter((h) => Boolean(h.id) && Boolean(h.text));
}

export default function TableOfContents({
  content,
  title = "En esta página",
  className,
}: {
  content?: string;
  title?: string;
  className?: string;
}) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const fromMarkdown = useMemo(() => {
    if (!content) return null;
    const parsed = parseHeadingsFromMarkdown(content);
    return parsed.length > 0 ? parsed : null;
  }, [content]);

  // Build a TOC either from the markdown source (preferred) or from DOM headings.
  useEffect(() => {
    if (fromMarkdown) {
      setHeadings(fromMarkdown);
      return;
    }

    // DOM-based TOC (useful for shared sidebars where we don't have content).
    let raf = 0;
    const refresh = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        setHeadings(parseHeadingsFromDom());
      });
    };

    refresh();

    const root = document.querySelector("article") ?? document.body;
    const observer = new MutationObserver(() => refresh());
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(raf);
    };
  }, [fromMarkdown]);

  // Highlight the active section while scrolling.
  useEffect(() => {
    if (headings.length === 0) return;

    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActiveId((entry.target as HTMLElement).id);
        }
      },
      {
        // "Current" section ~ when the heading is in the upper third of the viewport.
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0,
      }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      className={[
        "not-prose rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur",
        className ?? "",
      ].join(" ")}
      aria-label="Tabla de contenidos"
    >
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-muted-foreground">
        <List className="h-4 w-4 text-primary" />
        {title}
      </div>

      <ul className="mt-4 space-y-1.5 text-sm">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveId(h.id);
                  document.getElementById(h.id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className={[
                  "group flex items-start gap-3 rounded-2xl px-3 py-2 transition",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                ].join(" ")}
              >
                <span
                  className={[
                    "mt-2 h-1.5 w-1.5 rounded-full transition",
                    isActive
                      ? "bg-primary"
                      : "bg-border group-hover:bg-foreground/30",
                  ].join(" ")}
                  aria-hidden="true"
                />
                <span
                  className={[
                    "leading-5",
                    h.level === 2 ? "font-semibold" : "text-[13px]",
                  ].join(" ")}
                >
                  {h.text}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
