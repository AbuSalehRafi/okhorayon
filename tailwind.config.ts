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
        ink: {
          950: "#080c14", // Deepest midnight ink
          900: "#0c131f", // Surface ink dark
          850: "#121b2b", // Card background dark
          800: "#1a253a", // Border / highlight dark
          700: "#273854",
          400: "#7b8ea6",
          300: "#a1b1c6",
          200: "#c7d3e2",
          100: "#e9edf3",
        },
        paper: {
          50: "#faf8f5",  // Pure warm paper
          100: "#f4efe6", // Soft parchment
          200: "#eae2d2", // Borders light
          300: "#ded2be",
          400: "#b5a894",
          700: "#5a5043",
          800: "#383129",
          900: "#1a1815", // Deep ink text on paper
        },
        sepia: {
          50: "#fbf6eb",
          100: "#f3ebda",
          200: "#e5d9c2",
          800: "#54432c",
          900: "#342817",
        },
        accent: {
          DEFAULT: "#b5873a", // Quiet, scholarly antique gold/brass
          hover: "#9c722e",
          light: "#d4a95d",
          muted: "rgba(181, 135, 58, 0.15)",
        },
      },
      fontFamily: {
        serif: ["var(--font-merriweather)", "Georgia", "var(--font-noto-serif-bengali)", "serif"],
        sans: ["var(--font-inter)", "var(--font-noto-sans-bengali)", "system-ui", "sans-serif"],
        bengaliSerif: ["var(--font-noto-serif-bengali)", "serif"],
        bengaliSans: ["var(--font-noto-sans-bengali)", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "72ch",
            lineHeight: "1.75",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
