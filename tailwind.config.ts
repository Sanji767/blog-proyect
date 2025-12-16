import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
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
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        "primary-accent": "var(--primary-accent)",
        "foreground-accent": "var(--foreground-accent)",
        "hero-background": "var(--hero-background)",
        border: "var(--border)",
        "muted-foreground": "var(--muted-foreground)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        card: "0 18px 60px rgba(15,23,42,0.10)",
        soft: "0 16px 40px rgba(15,23,42,0.08)",
      },
    },
  },
  plugins: [
    typography(),
  ],
};

export default config;
