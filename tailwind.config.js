/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        vvm: {
          bg: "#F7F7F5",
          card: "#FFFFFF",
          soft: "#ECEDEA",
          border: "#E2E4E0",
          text: "#151515",
          muted: "#737373",
          silver: "#BFC3C7",
          graphite: "#292D32",
          accent: "#6C63FF",
          accentHover: "#5850EC",
          accentSubtle: "#A9B9FF",
          accentLight: "rgba(108, 99, 255, 0.08)",
          glass: "rgba(255, 255, 255, 0.72)",
          glassBorder: "rgba(255, 255, 255, 0.5)",
          dark: "#0F1012"
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Inter",
          "Geist",
          "sans-serif"
        ],
        mono: ["GeistMono", "SFMono-Regular", "Menlo", "monospace"]
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.02)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'elevated': '0 20px 50px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 40px rgba(108, 99, 255, 0.25)',
        'apple': '0 12px 32px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(0, 0, 0, 0.03)'
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
        tight: '-0.015em'
      }
    },
  },
  plugins: [],
};
