/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        cyan: { 400: '#00F5FF', 500: '#00D4E5' },
        neon: { purple: '#9D00FF', cyan: '#00F5FF' },
      },
    },
  },
  plugins: [],
}
