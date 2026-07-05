/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary accent — indigo/violet, used for CTAs, active states, focus rings.
        brand: {
          50: "#f1f0ff",
          100: "#e5e3ff",
          200: "#cdc9ff",
          300: "#aca3ff",
          400: "#8b78ff",
          500: "#7452f7",
          600: "#6432ec",
          700: "#5424c9",
          800: "#451fa3",
          900: "#3a1e82",
          950: "#221055",
        },
        // Secondary accent — used sparingly for gradient pairing (fuchsia/pink).
        accent: {
          400: "#f472e0",
          500: "#e84cd0",
          600: "#c72cb0",
        },
        // Calm neutral surface scale for dark-first "calm design" chrome.
        surface: {
          0: "#ffffff",
          50: "#f8f8fb",
          100: "#f0f0f6",
          200: "#e3e3ed",
          300: "#cbcbd9",
          400: "#9d9db0",
          500: "#77778c",
          600: "#5b5b70",
          700: "#43434f",
          800: "#1c1c27",
          850: "#16161f",
          900: "#111118",
          950: "#0b0b12",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["\"Plus Jakarta Sans\"", "Inter", "ui-sans-serif", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)",
        card: "0 1px 2px rgb(15 15 25 / 0.04), 0 8px 24px -8px rgb(15 15 25 / 0.10)",
        "card-hover": "0 2px 4px rgb(15 15 25 / 0.06), 0 16px 40px -12px rgb(15 15 25 / 0.18)",
        glow: "0 0 0 1px rgb(116 82 247 / 0.15), 0 8px 30px -4px rgb(116 82 247 / 0.35)",
        "glow-lg": "0 0 0 1px rgb(116 82 247 / 0.2), 0 20px 60px -8px rgb(116 82 247 / 0.45)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7452f7 0%, #c72cb0 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(116,82,247,0.14) 0%, rgba(199,44,176,0.12) 100%)",
        "aurora": "radial-gradient(ellipse 80% 50% at 20% -10%, rgba(116,82,247,0.35), transparent), radial-gradient(ellipse 60% 50% at 90% 10%, rgba(232,76,208,0.25), transparent)",
        "grid-fade": "linear-gradient(to bottom, transparent, rgb(11 11 18)), linear-gradient(to right, rgb(255 255 255 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.04) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "slide-up": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        "scale-in": { from: { opacity: 0, transform: "scale(0.97)" }, to: { opacity: 1, transform: "scale(1)" } },
        shimmer: { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        "spin-slow": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "slide-up": "slide-up 0.45s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 0.2s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 12s linear infinite",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
