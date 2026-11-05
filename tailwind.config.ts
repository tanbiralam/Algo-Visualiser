import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        surface: token("surface"),
        sunk: token("sunk"),
        ink: token("ink"),
        muted: token("muted"),
        line: token("line"),
        shu: token("shu"),
        ai: token("ai"),
        gold: token("gold"),
        moss: token("moss"),
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        // Ink bleed: a visited tile lands as a vermilion dot and settles into its wash.
        traversed: {
          "0%": { transform: "scale(0.3)", backgroundColor: "rgb(var(--c-shu) / 0.7)", borderRadius: "100%" },
          "100%": { transform: "scale(1)" },
        },
        path: {
          "0%": { transform: "scale(0.4)", backgroundColor: "rgb(var(--c-shu))", borderRadius: "100%" },
          "100%": { transform: "scale(1)" },
        },
        wall: {
          "0%": { transform: "scale(0.7)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        traversed: "traversed 0.45s cubic-bezier(0.23, 1, 0.32, 1)",
        path: "path 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
        wall: "wall 0.25s cubic-bezier(0.23, 1, 0.32, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
