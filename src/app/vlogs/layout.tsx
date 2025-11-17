// src/app/vlogs/layout.tsx
import type { ReactNode } from "react";

export default function VlogsLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-hero-background/40 py-10 md:py-16">
      {children}
    </section>
  );
}
