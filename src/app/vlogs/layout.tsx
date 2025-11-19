// src/app/vlogs/layout.tsx
import type { ReactNode } from "react";

export default function VlogsLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-gradient-to-b from-background via-slate-950/30 to-background py-10 md:py-16">
      {children}
    </section>
  );
}
