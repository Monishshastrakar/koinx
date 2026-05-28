export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#121212",
        cardDark: "#1E1E1E",
        cardBlue: "#0B1D36", // For the after harvesting card
        primaryBlue: "#3B82F6", // tailwind blue-500
        accentGreen: "#10B981", // tailwind emerald-500 for profit
        accentRed: "#EF4444", // tailwind red-500 for loss
        textMuted: "#9CA3AF",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
