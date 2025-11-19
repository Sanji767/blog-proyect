"use client";

type LogoProps = {
  className?: string;
  showText?: boolean;
};

export default function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* ICONO BRUTAL 2025 */}
      <div className="group relative h-14 w-14 md:h-16 md:w-16 lg:h-18 lg:w-18">
        {/* Halo exterior épico animado */}
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-sky-400/70 via-cyan-400/60 to-emerald-400/70 blur-2xl transition-all duration-1000 group-hover:blur-3xl group-hover:scale-110" />
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-sky-400/40 via-cyan-400/30 to-emerald-400/40 blur-3xl opacity-60 transition-all duration-1000 group-hover:opacity-100" />

        {/* Fondo principal con degradado ultra-vibrante */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-400 via-cyan-500 to-emerald-500 shadow-2xl ring-1 ring-white/30" />

        {/* Capa glassmorphism + ruido premium */}
        <div className="absolute inset-px rounded-3xl bg-white/10 backdrop-blur-2xl">
          <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%225%22/%3E%3CfeComponentTransfer%3E%3CturbulenceResult result=%22out%22/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width=%22256%22 height=%22256%22 filter=%22url(%23noise)%22 opacity=%220.12%22/%3E%3C/svg%3E')] mix-blend-overlay" />
        </div>

        {/* Símbolo F + flecha de crecimiento (ahora PERFECTO y animado) */}
        <svg
          viewBox="0 0 40 40"
          className="relative h-11 w-11 text-white drop-shadow-2xl transition-all duration-700 group-hover:scale-125 md:h-12 md:w-12"
          fill="none"
        >
          {/* F ultra bold */}
          <path d="M11 9h14M11 19h10M14 7v26" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M11 14.5h13" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" />

          {/* Flecha de crecimiento integrada y ANIMADA */}
          <path
            d="M22 21c2-2.5 4-5 6-7.5l4-3"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="origin-left transition-all duration-1000 group-hover:translate-x-3 group-hover:-translate-y-2"
          />
          <path
            d="M29.5 13.5l3.5-2.5-2 4.5"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Inner glow + lens flare brutal */}
        <div className="absolute left-2 top-2 h-8 w-8 rounded-full bg-white/40 blur-xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-70 opacity-30" />
        <div className="absolute -right-4 top-3 h-12 w-20 rounded-full bg-white/20 blur-3xl transition-all duration-700 group-hover:opacity-80 opacity-0" />
      </div>

      {/* Texto (más grande y potente que nunca) */}
      {showText && (
        <div className="flex flex-col leading-none">
          <h1 className="text-3xl font-black tracking-tighter text-foreground md:text-4xl">
            Finanzas{" "}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
              EU
            </span>
          </h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground/80">
            Bancos · Europa · Multidivisa
          </p>
        </div>
      )}
    </div>
  );
}