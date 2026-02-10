import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function blockToText(value: unknown): string {
  const children = (value as { children?: Array<{ text?: string }> } | null)?.children;
  if (!Array.isArray(children)) return "";
  return children.map((c) => c.text ?? "").join("").trim();
}

const components: PortableTextComponents = {
  block: {
    h2: ({ value, children }) => {
      const id = slugify(blockToText(value));
      return (
        <h2
          id={id || undefined}
          className="text-3xl md:text-4xl font-black tracking-tight mt-20 mb-6 scroll-mt-32"
        >
          {children}
        </h2>
      );
    },
    h3: ({ value, children }) => {
      const id = slugify(blockToText(value));
      return (
        <h3
          id={id || undefined}
          className="text-2xl md:text-3xl font-bold tracking-tight mt-16 mb-5 scroll-mt-32"
        >
          {children}
        </h3>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary bg-muted/40 rounded-r-xl py-8 px-10 my-10 text-lg">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="leading-relaxed text-lg mb-6">{children}</p>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = String((value as { href?: string } | null)?.href ?? "");
      const isExternal = /^https?:\/\//.test(href) || href.startsWith("//");

      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-primary font-medium hover:underline transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const maybeUrl = (value as { url?: string; asset?: { url?: string } } | null)?.url;
      const assetUrl = (value as { asset?: { url?: string } } | null)?.asset?.url;
      const url = maybeUrl ?? assetUrl;
      if (!url) return null;

      const alt = String((value as { alt?: string } | null)?.alt ?? "");
      const caption = String((value as { caption?: string } | null)?.caption ?? "");

      return (
        <figure className="my-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={alt}
            loading="lazy"
            className="w-full rounded-2xl border border-border/60 shadow-lg"
          />
          {caption ? (
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export default function PortableTextRenderer({
  value,
}: {
  value: PortableTextBlock[];
}) {
  return <PortableText value={value} components={components} />;
}

