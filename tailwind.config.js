/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/**/*.{js,ts,jsx,tsx}",
    "./src/splash/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        folia: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
          brand: '#2E7D32',
          deep: '#1B4332',
          light: '#E8F5E9',
          accent: '#52B788'
        },
        paper: {
          50: '#FFFFFF',
          100: '#FAFAF8',
          150: '#F7F6F3',
          200: '#F1EFEA',
          300: '#E8E5DF',
          400: '#D5D1C7',
          500: '#9E9A90',
          600: '#706C64',
          700: '#4A4741',
          800: '#2B2925',
          900: '#171614',
        }
      },
      fontFamily: {
        brand: ['"Plus Jakarta Sans"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        magoa: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        serif: ['"Lora"', '"Cormorant Garamond"', '"Merriweather"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'page': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'page-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
        'card-hover': '0 8px 16px -4px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
