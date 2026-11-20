// src/components/search/SearchBox.tsx
//
// On-site search box for the header (audit finding A22). Client-side search
// over the cached /api/search-index index (~90 posts, ~30 KB).
//
// - The index is fetched lazily on first focus and cached module-wide, so
//   it costs nothing for visitors who never search.
// - Filtering/ranking is the pure searchPosts() helper in @/lib/search:
//   accent-insensitive, all tokens must match, current locale first.
// - Keyboard accessible: ArrowUp/ArrowDown move the highlight, Enter
//   navigates to the highlighted (or first) result, Escape closes.
// - Results link to the article's real URL (/blog/<slug> or /en/blog/<slug>);
//   prefetch is off — search results are clicked deliberately and the blog
//   pages are force-dynamic, so prefetching would only add load.
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { withLocale } from "@/lib/i18n";
import { searchPosts, type SearchIndex } from "@/lib/search";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Called when the user navigates from a result (e.g. to close the mobile menu). */
  onNavigate?: () => void;
};

const COPY = {
  es: {
    placeholder: "Buscar guías, bancos…",
    label: "Buscar en el sitio",
    clear: "Limpiar búsqueda",
    loading: "Cargando…",
    noResults: "Sin resultados para",
    viewAll: "Ver todos los artículos",
    results: "resultados",
  },
  en: {
    placeholder: "Search guides, banks…",
    label: "Search the site",
    clear: "Clear search",
    loading: "Loading…",
    noResults: "No results for",
    viewAll: "View all articles",
    results: "results",
  },
} as const;

const MAX_RESULTS = 8;

// Module-level cache: the index is fetched at most once per page lifetime.
let indexPromise: Promise<SearchIndex | null> | null = null;

function loadSearchIndex(): Promise<SearchIndex | null> {
  if (!indexPromise) {
    indexPromise = fetch("/api/search-index")
      .then((response) => (response.ok ? (response.json() as Promise<SearchIndex>) : null))
      .catch(() => null);
  }
  return indexPromise;
}

export default function SearchBox({ className, onNavigate }: Props) {
  const { locale } = useLocale();
  const copy = COPY[locale];
  const router = useRouter();
  const pathname = usePathname();
  const listboxId = useId();

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [loading, setLoading] = useState(false);

  const results = useMemo(
    () =>
      index && query.trim()
        ? searchPosts(index.posts, query, locale, MAX_RESULTS)
        : [],
    [index, query, locale],
  );

  const showDropdown = open && query.trim().length > 0;

  function ensureIndexLoaded() {
    if (index || loading) return;
    setLoading(true);
    loadSearchIndex()
      .then((loaded) => setIndex(loaded))
      .finally(() => setLoading(false));
  }

  function close() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function navigateTo(url: string) {
    close();
    setQuery("");
    onNavigate?.();
    router.push(url);
  }

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  // Close + reset when the route changes (e.g. result clicked via keyboard).
  useEffect(() => {
    close();
    setQuery("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!showDropdown) return;
      setActiveIndex((prev) => (prev + 1) % Math.max(results.length, 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!showDropdown) return;
      setActiveIndex((prev) =>
        prev <= 0 ? results.length - 1 : prev - 1,
      );
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (!showDropdown) return;
      const target =
        activeIndex >= 0 && activeIndex < results.length
          ? results[activeIndex]
          : results[0];
      if (target) navigateTo(target.url);
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <label htmlFor={listboxId} className="sr-only">
        {copy.label}
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-light"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id={listboxId}
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={`${listboxId}-listbox`}
          aria-activedescendant={
            activeIndex >= 0 && results[activeIndex]
              ? `${listboxId}-option-${activeIndex}`
              : undefined
          }
          aria-label={copy.label}
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
            setOpen(true);
          }}
          onFocus={() => {
            ensureIndexLoaded();
            if (query.trim()) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          placeholder={copy.placeholder}
          className="h-10 w-full rounded-full border border-secondary-foreground/15 bg-secondary-foreground/10 pl-9 pr-9 text-sm font-medium text-secondary-foreground placeholder:text-secondary-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        {query ? (
          <button
            type="button"
            aria-label={copy.clear}
            onClick={() => {
              setQuery("");
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-secondary-foreground/70 hover:text-accent"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {showDropdown ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-xl md:min-w-[22rem]">
          {loading && !index ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              {copy.loading}
            </p>
          ) : results.length === 0 ? (
            <div className="px-4 py-3">
              <p className="text-sm text-muted-foreground">
                {copy.noResults} “{query.trim()}”.
              </p>
              <Link
                href={withLocale("/blog", locale)}
                prefetch={false}
                onClick={() => {
                  close();
                  setQuery("");
                  onNavigate?.();
                }}
                className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
              >
                {copy.viewAll} →
              </Link>
            </div>
          ) : (
            <>
              <ul
                id={`${listboxId}-listbox`}
                role="listbox"
                aria-label={copy.label}
                className="max-h-[22rem] overflow-y-auto py-2"
              >
                {results.map((post, i) => (
                  <li
                    key={post.url}
                    id={`${listboxId}-option-${i}`}
                    role="option"
                    aria-selected={i === activeIndex}
                  >
                    <Link
                      href={post.url}
                      prefetch={false}
                      onClick={() => {
                        close();
                        setQuery("");
                        onNavigate?.();
                      }}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={cn(
                        "flex items-start justify-between gap-3 px-4 py-2.5 text-sm",
                        i === activeIndex ? "bg-muted" : "bg-transparent",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-foreground">
                          {post.title}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {post.category}
                        </span>
                      </span>
                      <span className="mt-0.5 shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        {post.locale}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border px-4 py-2.5">
                <Link
                  href={withLocale("/blog", locale)}
                  prefetch={false}
                  onClick={() => {
                    close();
                    setQuery("");
                    onNavigate?.();
                  }}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  {copy.viewAll} →
                </Link>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
