// src/app/blog/loading.tsx

export default function LoadingBlog() {
  return (
    <div className="mx-auto max-w-3xl pt-4 md:pt-8 animate-pulse">
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="mt-6 h-10 w-4/5 rounded bg-muted" />
      <div className="mt-4 h-6 w-3/5 rounded bg-muted" />

      <div className="mt-14 border-t border-border/50">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-b border-border/50 py-8 md:py-10">
            <div className="h-3 w-44 rounded bg-muted" />
            <div className="mt-4 h-7 w-5/6 rounded bg-muted" />
            <div className="mt-4 h-4 w-3/5 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

