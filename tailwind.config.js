/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oussa: {
          primary: '#FF6B35',
          secondary: '#2C3E50',
          gold: '#FFD700',
          dark: '#0d1117',
        }
      }
    },
  },
  plugins: [],
}
