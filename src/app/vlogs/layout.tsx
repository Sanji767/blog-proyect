// src/app/vlogs/layout.tsx
import type { ReactNode } from "react";

export default function VlogsLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-slate-50 dark:bg-black">
      {/* Separa del header fijo */}
      <div className="pt-20 md:pt-24">{children}</div>
    </section>
  );
}
