import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        accent: "var(--accent)",
        separator: "var(--separator)",
      },
      fontFamily: {
        system: ["var(--font-system)"],
        mono: ["var(--font-mono)"],
      },
      backdropBlur: {
        macos: "20px",
        "macos-heavy": "40px",
      },
      boxShadow: {
        window:
          "0 22px 70px 4px rgba(0,0,0,0.56), 0 0 0 1px rgba(255,255,255,0.08)",
        dock: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
        menubar: "0 1px 0 rgba(0,0,0,0.1)",
      },
      height: {
        menubar: "var(--menubar-height)",
        dock: "var(--dock-height)",
      },
      spacing: {
        menubar: "var(--menubar-height)",
        dock: "var(--dock-height)",
      },
      borderRadius: {
        window: "12px",
        dock: "20px",
      },
      transitionTimingFunction: {
        macos: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
