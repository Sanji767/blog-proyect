// src/app/blog/loading.tsx
import Container from "@/components/layout/Container";

export default function LoadingBlog() {
  return (
    <Container className="py-16 max-w-5xl">
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-2/3 bg-muted rounded" />
        <div className="h-4 w-1/2 bg-muted rounded" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
    </Container>
  );
}
