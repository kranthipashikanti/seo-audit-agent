/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Altudo brand colors
        altudo: {
          yellow: '#FFC800',
          'yellow-light': '#FFD633',
          'yellow-dark': '#E6B400',
          gold: '#FFC800',
          black: '#000000',
          gray: {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#E5E5E5',
            300: '#D4D4D4',
            400: '#A3A3A3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
          }
        },
        // Override default colors to match Altudo theme
        primary: {
          50: '#FFFDF0',
          100: '#FFF9C2',
          200: '#FFF088',
          300: '#FFE444',
          400: '#FFC800', // Main Altudo yellow
          500: '#E6B400',
          600: '#CC9900',
          700: '#B37F00',
          800: '#996600',
          900: '#805500',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'display': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'altudo': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'altudo-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'altudo': '8px',
      }
    },
  },
  plugins: [],
}