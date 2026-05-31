import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wedge: {
          50:  "#f0f5f8",
          100: "#d9e8f0",
          200: "#b3d1e1",
          300: "#8db9d2",
          400: "#5581a6",
          500: "#4b738d",
          600: "#3d5f75",
          700: "#2e4a5c",
          800: "#1f3444",
          900: "#111e2b",
          950: "#080e14",
        },
        glass: {
          white:  "rgba(255,255,255,0.06)",
          light:  "rgba(255,255,255,0.10)",
          medium: "rgba(255,255,255,0.15)",
          dark:   "rgba(0,0,0,0.40)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-dark":  "radial-gradient(ellipse at top left, #0d1f2d 0%, #060d13 60%)",
        "hero-light": "radial-gradient(ellipse at top left, #e8f4fd 0%, #f5f9fc 60%)",
      },
      boxShadow: {
        "neo-dark":    "8px 8px 16px #04090d, -4px -4px 12px #1a3347",
        "neo-dark-sm": "4px 4px 8px #04090d, -2px -2px 6px #1a3347",
        "neo-dark-inset": "inset 4px 4px 8px #04090d, inset -2px -2px 6px #1a3347",
        "neo-light":   "6px 6px 14px #c5d8e8, -4px -4px 10px #ffffff",
        "neo-light-sm":"3px 3px 8px #c5d8e8, -2px -2px 6px #ffffff",
        "neo-light-inset":"inset 4px 4px 8px #c5d8e8, inset -2px -2px 6px #ffffff",
        "glow-wedge":  "0 0 20px rgba(75,115,141,0.5), 0 0 40px rgba(75,115,141,0.2)",
        "glow-wedge-sm":"0 0 10px rgba(75,115,141,0.4), 0 0 20px rgba(75,115,141,0.15)",
        "glow-white":  "0 0 20px rgba(255,255,255,0.15)",
        "card-dark":   "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)",
        "card-light":  "0 8px 32px rgba(75,115,141,0.12), 0 2px 8px rgba(75,115,141,0.08)",
      },
      backdropBlur: {
        xs: "2px",
        "4xl": "72px",
      },
      animation: {
        "pulse-slow":    "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "float":         "float 6s ease-in-out infinite",
        "glow-pulse":    "glowPulse 2s ease-in-out infinite",
        "shimmer":       "shimmer 2s linear infinite",
        "slide-in-left": "slideInLeft 0.4s ease-out",
        "slide-in-right":"slideInRight 0.4s ease-out",
        "fade-up":       "fadeUp 0.5s ease-out",
        "spin-slow":     "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(75,115,141,0.3)" },
          "50%":      { boxShadow: "0 0 25px rgba(75,115,141,0.7), 0 0 50px rgba(75,115,141,0.3)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        slideInLeft: {
          "0%":   { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)",     opacity: "1" },
        },
        slideInRight: {
          "0%":   { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)",    opacity: "1" },
        },
        fadeUp: {
          "0%":   { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
      },
    },
  },
  plugins: [],
};

export default config;