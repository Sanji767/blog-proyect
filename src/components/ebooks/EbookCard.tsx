import { motion } from "framer-motion";
import BookMockup from "./BookMockup";
import Badge from "./Badge";
import Link from "next/link";
import type { Ebook } from "@/lib/ebooks-data";

interface EbookCardProps {
  ebook: Ebook;
}

export default function EbookCard({ ebook }: EbookCardProps) {
  return (
    <Link href={`/ebooks/${ebook.id}`} className="block h-full group">
      <div className="bg-white rounded-[2rem] p-0 flex flex-col h-full transition-transform duration-300 group-hover:-translate-y-1">
        <BookMockup image={ebook.image} />

        <div className="mt-4 flex flex-col items-start px-1">
          <h3 className="text-[14px] font-medium text-gray-800 leading-tight line-clamp-2 mb-3">
            {ebook.title}
          </h3>
          
          <div className="flex gap-2">
            <Badge>{ebook.format || "Curso Online"}</Badge>
            {ebook.isFree && <Badge variant="free">Gratis</Badge>}
          </div>
        </div>
      </div>
    </Link>
  );
}