import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Deep editorial / institutional palette.
        // ink = primary dark sections; paper = light sections.
        ink: {
          50: "#f5f7fa",
          100: "#e7ecf2",
          200: "#c7d0dd",
          300: "#94a2b8",
          400: "#5b6b86",
          500: "#34425c",
          600: "#1f2a44",
          700: "#141d33",
          800: "#0c1426",
          900: "#070d1c",
          950: "#04081a",
        },
        // Accent — high-contrast electric / signal blue
        accent: {
          50: "#eafaff",
          100: "#cdf3ff",
          200: "#a3e9ff",
          300: "#5fdcff",
          400: "#1ec8ff",
          500: "#00afe6",
          600: "#008abf",
          700: "#066d96",
          800: "#0b577a",
          900: "#0d4a68",
        },
        // Secondary accent — warm gold for highlights / risk meters
        gold: {
          400: "#f6c453",
          500: "#e9aa2b",
          600: "#c98a18",
        },
        // Functional
        success: { 400: "#34d399", 500: "#10b981", 600: "#059669" },
        warn: { 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706" },
        danger: { 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48" },
        // Legacy brand alias kept for compatibility with any leftover refs
        brand: {
          50: "#eafaff",
          100: "#cdf3ff",
          200: "#a3e9ff",
          300: "#5fdcff",
          400: "#1ec8ff",
          500: "#00afe6",
          600: "#008abf",
          700: "#066d96",
          800: "#0b577a",
          900: "#0d4a68",
          950: "#07254a",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: [
          "Fraunces",
          "Georgia",
          "ui-serif",
          "serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
        "card-hover":
          "0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
        elevated:
          "0 8px 24px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
        glow: "0 0 28px rgba(30,200,255,0.25)",
        "glow-soft": "0 0 18px rgba(30,200,255,0.15)",
        "inner-line": "inset 0 1px 0 rgba(255,255,255,0.04)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "noise":
          "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "44px 44px",
        noise: "3px 3px",
      },
      keyframes: {
        floatSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(30,200,255,0.45)" },
          "50%": { boxShadow: "0 0 0 8px rgba(30,200,255,0)" },
        },
      },
      animation: {
        "float-soft": "floatSoft 6s ease-in-out infinite",
        scanline: "scanline 14s linear infinite",
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
