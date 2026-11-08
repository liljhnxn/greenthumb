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
        botanical: {
          bg: "#111A13",
          card: "#1E2B20",
          cardHover: "#253628",
          cardBorder: "#2A3C2D",
          accent: "#B4D96B",
          accentHover: "#C4E87D",
          accentDark: "#375023",
          text: "#F3F7EC",
          subtext: "#A1AE9D",
          muted: "#5B6858",
          highlight: "#86B049",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      backgroundImage: {
        'botanical-pattern': "radial-gradient(ellipse at top right, rgba(180, 217, 107, 0.08), transparent 50%), radial-gradient(ellipse at bottom left, rgba(74, 124, 89, 0.12), transparent 50%)",
        'card-gradient': "linear-gradient(135deg, rgba(30, 43, 32, 0.95) 0%, rgba(22, 33, 24, 0.95) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;

