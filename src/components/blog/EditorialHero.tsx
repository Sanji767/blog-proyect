import Link from "next/link";

export default function EditorialHero({
  eyebrow = "Blog",
  title = "Ideas, guías y experiencias sobre finanzas en Europa.",
  subtitle = "Lecturas claras sobre bancos digitales, IBAN, comisiones y herramientas útiles. Menos marketing, más criterio.",
  links = [
    { href: "/", label: "Inicio" },
    { href: "/blog", label: "Artículos" },
    { href: "/sobre", label: "Sobre mí" },
  ],
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  links?: Array<{ href: string; label: string }>;
}) {
  return (
    <header className="mx-auto max-w-3xl pt-4 md:pt-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {eyebrow}
      </p>

      <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
        {title}
      </h1>

      <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
        {subtitle}
      </p>

      <nav className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {links.map((link, idx) => (
          <span key={link.href} className="inline-flex items-center gap-x-4">
            <Link
              href={link.href}
              className="underline-offset-4 hover:underline text-foreground/90 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
            {idx < links.length - 1 ? (
              <span className="text-muted-foreground/70">/</span>
            ) : null}
          </span>
        ))}
      </nav>
    </header>
  );
}

