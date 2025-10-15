/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Octin Sports", "serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        "primary-blue": "#1e3a8a", // IIT KGP Blue (darker blue)
        "accent-orange": "#ea580c", // IIT KGP Orange
        "light-bg": "#f8fafc", // Slate-50
        "dark-text": "#1e293b", // Slate-800
        "light-text": "#64748b", // Slate-500
        "iit-blue": "#1e3a8a", // Official IIT Blue
        "iit-orange": "#ea580c", // Official IIT Orange
      },
      animation: {
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-gentle": "bounce 1s infinite",
      },
      boxShadow: {
        glow: "0 0 20px rgba(30, 64, 175, 0.3)",
        "glow-gold": "0 0 20px rgba(251, 191, 36, 0.3)",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
