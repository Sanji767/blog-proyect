import BookMockup from "./BookMockup";
import Badge from "./Badge";
import Link from "next/link";
import type { Ebook } from "@/lib/ebooks-data";

interface EbookCardProps {
  ebook: Ebook;
}

export default function EbookCard({ ebook }: EbookCardProps) {
  return (
    <Link href={`/ebooks/${ebook.id}`} className="group block h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-secondary bg-secondary text-secondary-foreground shadow-soft transition-shadow group-hover:shadow-offset-accent">
        <BookMockup image={ebook.image} />

        <div className="flex flex-1 flex-col gap-4 p-6">
          <h3 className="text-balance text-lg font-black leading-tight text-accent line-clamp-2">
            {ebook.title}
          </h3>

          <div className="mt-auto flex flex-wrap gap-2">
            <Badge>{ebook.format || "Curso online"}</Badge>
            {ebook.isFree ? <Badge variant="free">Gratis</Badge> : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
