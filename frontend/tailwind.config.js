/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#3B5BFF',
          50: '#F3F5FF',
          100: '#EEF1F9',
          200: '#DDE4F7',
          300: '#C5CEF2',
          400: '#9DB0FF',
          500: '#3B5BFF',
          600: '#2A46DB',
          700: '#1E35B8',
          dark: '#101828',
          accent: '#2EE6A6',
          'accent-light': '#7CF2C8',
        },
      },
    },
  },
  plugins: [],
}
