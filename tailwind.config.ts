import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: "#E2603A",
        mango: "#F5A623",
        matcha: "#7A9E7E",
      },
    },
  },
  plugins: [],
};
export default config;
