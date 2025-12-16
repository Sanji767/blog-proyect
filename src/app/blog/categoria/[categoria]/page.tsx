// src/app/blog/categoria/[category]/page.tsx
import Container from "@/components/layout/Container";
import BlogCard from "@/components/blog/BlogCard";
import { blogPosts } from "@/lib/blog/posts";
import { getCategories } from "@/lib/blog/getCategories";

type Props = {
  params: {
    category: string;
  };
};

export async function generateStaticParams(): Promise<{ category: string }[]> {
  const categories = getCategories();
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const categories = getCategories();
  const cat = categories.find((c) => c.slug === params.category);

  if (!cat) {
    return { title: "Categoría no encontrada" };
  }

  return {
    title: `${cat.title} | Blog Finanzas EU`,
    description: `Todos los artículos sobre ${cat.title.toLowerCase()} – guías, opiniones y trucos 2025.`,
  };
}

export default function CategoryPage({ params }: Props) {
  const categories = getCategories();
  const cat = categories.find((c) => c.slug === params.category);

  if (!cat) {
    return (
      <Container className="py-20 text-center">
        <p className="text-lg text-muted-foreground">Categoría no encontrada</p>
      </Container>
    );
  }

  const posts = blogPosts.filter((p) =>
    p.tags?.includes(params.category)
  );

  return (
    <Container className="py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black mb-4">{cat.title}</h1>
        <p className="text-xl text-muted-foreground">
          {posts.length} artículo{posts.length !== 1 ? "s" : ""} en esta categoría
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <BlogCard key={post.slug} post={post} index={i} />
        ))}
      </div>
    </Container>
  );
}