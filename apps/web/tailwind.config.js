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
      },
      animation: {
        'modal-fade': 'modal-fade 200ms',
        'modal-zoom':
          'modal-zoom 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        'modal-fade': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'modal-zoom': {
          '0%': { transform: 'scale(0.8)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      gridTemplateColumns: {
        '3-auto': 'repeat(3,auto)',
      },
    },
  },
  plugins: [require('tailwindcss-react-aria-components')],
};
