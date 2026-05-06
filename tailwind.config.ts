import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#090A12",
        ink: "#111827",
        lime: "#C8FF3D",
        coral: "#FF5C5C",
        cyan: "#56D6FF"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(200, 255, 61, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
