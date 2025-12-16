// src/app/blog/tag/[tag]/page.tsx
import Container from "@/components/layout/Container";
import BlogCard from "@/components/blog/BlogCard";
import { blogPosts } from "@/lib/blog/posts";

// 1. Definimos el tipo explícitamente
type Props = {
  params: {
    tag: string;
  };
};

// 2. generateStaticParams con tipo correcto
export async function generateStaticParams(): Promise<{ tag: string }[]> {
  const allTags = new Set<string>();
  blogPosts.forEach((p) => p.tags?.forEach((t) => allTags.add(t)));
  return Array.from(allTags).map((tag) => ({ tag }));
}

// 3. generateMetadata con tipo explícito
export async function generateMetadata({ params }: Props): Promise<any> {
  const tag = decodeURIComponent(params.tag);
  return {
    title: `#${tag} | Blog Finanzas EU`,
    description: `Todos los artículos etiquetados con #${tag}`,
  };
}

// 4. Página con tipo explícito
export default function TagPage({ params }: Props) {
  const tag = decodeURIComponent(params.tag);
  const posts = blogPosts.filter((p) =>
    p.tags?.includes(tag.toLowerCase())
  );

  return (
    <Container className="py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black mb-4">#{tag}</h1>
        <p className="text-xl text-muted-foreground">
          {posts.length} artículo{posts.length !== 1 ? "s" : ""} encontrado{posts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground py-20 text-lg">
          No hay artículos con la etiqueta <strong>#{tag}</strong> todavía.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      )}
    </Container>
  );
}