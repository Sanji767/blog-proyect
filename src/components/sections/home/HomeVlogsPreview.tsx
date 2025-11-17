import Link from "next/link";
import { vlogs } from "@/lib/vlogs";
import VlogCard from "@/components/vlogs/VlogCard";
import Container from "@/components/layout/Container";

export default function HomeVlogsPreview() {
  const recentVlogs = vlogs.slice(0, 3); // Los 3 más recientes

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            Últimos Vlogs & Artículos
          </h2>

          <Link
            href="/vlogs"
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Ver todos
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recentVlogs.map((vlog) => (
            <VlogCard key={vlog.slug} vlog={vlog} />
          ))}
        </div>
      </Container>
    </section>
  );
}
