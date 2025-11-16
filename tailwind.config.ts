import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  // Soporte para modo oscuro controlado por clase (next-themes, etc.)
  darkMode: "class",

  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    // Contenedor centrado y con paddings razonables para layouts
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2rem",
        "2xl": "3rem",
      },
      screens: {
        "2xl": "1200px", // así no se hace gigante en pantallas enormes
      },
    },

    extend: {
      // Tus variables base + algunos tokens semánticos extra opcionales
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        "primary-accent": "var(--primary-accent)",
        "foreground-accent": "var(--foreground-accent)",
        "hero-background": "var(--hero-background)",

        // (Opcionales) si algún día los defines en :root
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
      },

      // Soporte para fuentes definidas vía CSS variables (Google Fonts, etc.)
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-display)", ...defaultTheme.fontFamily.sans],
      },

      // Radios más suaves para cards / botones (queda muy bien con tu header)
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },

      // Sombras limpias para tarjetas y elementos flotantes
      boxShadow: {
        soft: "0 18px 60px rgba(15,23,42,0.12)",
        card: "0 16px 40px rgba(15,23,42,0.08)",
      },

      // Animaciones reutilizables (para acordeones, fades, etc.)
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.4s ease-out both",
      },
    },
  },

  plugins: [],
};

export default config;
