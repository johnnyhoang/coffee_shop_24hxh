import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const tailwindcssReactAria = require('tailwindcss-react-aria-components');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
  ],
  theme: {
    extend: {
      colors: {
        black4: 'rgba(0, 0, 0, 0.04)',
        black25: 'rgba(0, 0, 0, 0.25)',
        paper: '#faf6f0',
        cream: {
          50: '#fdfbf7',
          100: '#faf6f0',
          200: '#f0e8dc',
          300: '#e5d9c8',
        },
        espresso: {
          50: '#f7f4f1',
          100: '#e8dfd4',
          200: '#d4c2b0',
          300: '#b89f86',
          400: '#9a7b62',
          500: '#7d5e48',
          600: '#5c4335',
          700: '#3d2d24',
          800: '#2a1f1a',
          900: '#1a1410',
        },
        caramel: '#c4956a',
        sage: '#8b9a7a',
        rust: '#b54a35',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(42, 31, 26, 0.06), 0 1px 2px rgba(42, 31, 26, 0.04)',
        lift: '0 8px 24px rgba(42, 31, 26, 0.08), 0 2px 6px rgba(42, 31, 26, 0.05)',
        nav: '0 -4px 20px rgba(42, 31, 26, 0.06)',
      },
      animation: {
        'modal-fade': 'modal-fade 200ms',
        'modal-zoom':
          'modal-zoom 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'grain': 'grain 8s steps(10) infinite',
      },
      keyframes: {
        'modal-fade': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'modal-zoom': {
          '0%': { transform: 'scale(0.96)' },
          '100%': { transform: 'scale(1)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '30%': { transform: 'translate(3%, -15%)' },
          '50%': { transform: 'translate(12%, 9%)' },
          '70%': { transform: 'translate(9%, 4%)' },
          '90%': { transform: 'translate(-1%, 7%)' },
        },
      },
      gridTemplateColumns: {
        '3-auto': 'repeat(3,auto)',
      },
      minHeight: {
        screen: ['100vh', '100dvh'],
      },
    },
  },
  plugins: [tailwindcssReactAria.default ?? tailwindcssReactAria],
};
