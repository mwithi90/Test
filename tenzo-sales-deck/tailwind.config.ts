import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tenzo: {
          primary: "#1a73e8",
          secondary: "#8ab4f8",
          accent: "#fbbc04",
        },
      },
    },
  },
  plugins: [],
};

export default config;
