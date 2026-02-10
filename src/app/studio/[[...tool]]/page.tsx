"use client";

import dynamic from "next/dynamic";

import { sanityConfigured } from "@/sanity/env";

const StudioClient = dynamic(() => import("./StudioClient"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-3xl p-8">
      <p className="text-sm text-muted-foreground">Cargando Studio…</p>
    </div>
  ),
});

export default function StudioPage() {
  if (!sanityConfigured) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <h1 className="text-2xl font-black tracking-tight">Sanity no configurado</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Define <code className="rounded bg-muted px-1.5 py-0.5">NEXT_PUBLIC_SANITY_PROJECT_ID</code>{" "}
          y <code className="rounded bg-muted px-1.5 py-0.5">NEXT_PUBLIC_SANITY_DATASET</code>{" "}
          en tu <code className="rounded bg-muted px-1.5 py-0.5">.env.local</code>.
        </p>
      </div>
    );
  }

  return <StudioClient />;
}
