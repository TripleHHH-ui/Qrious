import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Food-warm palette — terracotta, mango, matcha
        terracotta: {
          DEFAULT: "#E1623F",
          dark: "#C24A29",
          light: "#F6A589",
          soft: "#FBE3DA",
        },
        mango: {
          DEFAULT: "#F7B32B",
          dark: "#E2940A",
          light: "#FDD87A",
          soft: "#FDF1CF",
        },
        matcha: {
          DEFAULT: "#7FB069",
          dark: "#5C8A4A",
          light: "#A9D18E",
          soft: "#E6F2DD",
        },
        ink: "#2B2320",
        cream: "#FFF7EE",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        blob: "28px",
        pill: "999px",
      },
      boxShadow: {
        pop: "0 10px 30px -8px rgba(225, 98, 63, 0.45)",
        card: "0 6px 20px -6px rgba(43, 35, 32, 0.18)",
      },
      keyframes: {
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        popin: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "70%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        bob: "bob 2.4s ease-in-out infinite",
        wiggle: "wiggle 1.2s ease-in-out infinite",
        popin: "popin 0.4s cubic-bezier(.2,.8,.3,1.2) both",
      },
    },
  },
  plugins: [],
};

export default config;
