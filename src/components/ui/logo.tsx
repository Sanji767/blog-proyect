"use client";

type LogoProps = {
  className?: string;
  showText?: boolean; // por si algún día quieres solo el icono
};

export default function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icono F + flecha */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-sky-500 to-emerald-400 shadow-md dark:from-blue-400 dark:via-sky-400 dark:to-emerald-300">
        {/* Borde interior sutil */}
        <div className="absolute inset-[2px] rounded-[0.85rem] bg-black/5 dark:bg-white/5" />

        <svg
          viewBox="0 0 24 24"
          className="relative h-5 w-5 text-white"
          aria-hidden="true"
        >
          {/* F base */}
          <path
            d="M7 6h9M7 12h6M9 6v11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Flecha de crecimiento */}
          <path
            d="M13 10l2.3-2.3M15.3 7.7H13M15.3 7.7V10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-[1.1rem] font-semibold tracking-wide text-foreground">
            Finanzas <span className="text-blue-600 dark:text-blue-400">EU</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Bancos · Europa · Multidivisa
          </span>
        </div>
      )}
    </div>
  );
}
