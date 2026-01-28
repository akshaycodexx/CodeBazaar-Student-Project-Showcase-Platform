/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5', // Indigo 600
          dark: '#4338ca', // Indigo 700
          light: '#6366f1', // Indigo 500
        },
        secondary: {
          DEFAULT: '#14b8a6', // Teal 500
          dark: '#0f766e', // Teal 700
        },
        neutral: {
          100: '#f3f4f6', // Gray 100
          200: '#e5e7eb', // Gray 200
          300: '#d1d5db', // Gray 300
          800: '#1f2937', // Gray 800
          900: '#111827', // Gray 900
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
