// src/components/ui/logo.tsx
"use client";

type LogoProps = {
  className?: string;
  showText?: boolean; // ahora por defecto false en footer
};

export default function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* ICONO COMPACTO Y BRUTAL PARA FOOTER */}
      <div className="group relative h-11 w-11 md:h-12 md:w-12">
        {/* Halo sutil animado */}
        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-sky-400/50 via-cyan-400/40 to-emerald-400/50 blur-xl transition-all duration-700 group-hover:blur-2xl group-hover:scale-110" />

        {/* Fondo principal */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 shadow-xl ring-1 ring-white/20" />

        {/* Glassmorphism + ruido sutil */}
        <div className="absolute inset-px rounded-2xl bg-white/10 backdrop-blur-xl">
          <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22/%3E%3C/filter%3E%3Crect width=%22256%22 height=%22256%22 filter=%22url(%23noise)%22 opacity=%220.08%22/%3E%3C/svg%3E')] mix-blend-overlay" />
        </div>

        {/* Símbolo F + flecha (más pequeño y refinado) */}
        <svg
          viewBox="0 0 36 36"
          className="relative h-9 w-9 text-white drop-shadow-lg transition-all duration-500 group-hover:scale-110"
          fill="none"
        >
          <path d="M10 8h12M10 17h9M13 6v24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <path d="M10 13h11" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />

          {/* Flecha de crecimiento sutil */}
          <path
            d="M20 19c1.5-2 3-4 4.5-6l3-2"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="origin-left transition-all duration-700 group-hover:translate-x-1.5 group-hover:-translate-y-1"
          />
          <path d="M26.5 11.5l3-1.5-1.5 3.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>

        {/* Glow interior mínimo */}
        <div className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white/30 blur-lg transition-all duration-500 group-hover:scale-125 opacity-40" />
      </div>

      {/* Texto solo si se activa (en footer lo desactivamos por defecto) */}
      {showText && (
        <div className="flex flex-col leading-none">
          <h1 className="text-2xl font-black tracking-tighter text-foreground md:text-3xl">
            Finanzas{" "}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              EU
            </span>
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Bancos digitales en Europa
          </p>
        </div>
      )}
    </div>
  );
}