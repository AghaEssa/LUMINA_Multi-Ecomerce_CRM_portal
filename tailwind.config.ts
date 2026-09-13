import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#f0f8fa",
          100: "#d7eff5",
          200: "#b3e0eb",
          300: "#7fcaad",
          400: "#44adca",
          500: "#1a8ea9",
          600: "#096986",
          700: "#075570",
          800: "#06465c",
          900: "#05394b",
          950: "#03232f",
        },
        ink: {
          DEFAULT: "#0f172a",
          50: "#f8fafc",
          100: "#f1f5f9",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(7, 85, 112, 0.08)",
        glow: "0 0 35px rgba(9, 105, 134, 0.25)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 4px 10px -4px rgba(0, 0, 0, 0.03)",
        "card-hover": "0 20px 40px -15px rgba(7, 85, 112, 0.18)",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-left": "slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.2s ease-out forwards",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        slideLeft: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
