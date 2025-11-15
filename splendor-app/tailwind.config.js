/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        board: {
          bg: '#04060a',
          card: '#111827',
        },
        gem: {
          diamond: '#f2f2f2',
          sapphire: '#38bdf8',
          emerald: '#4ade80',
          ruby: '#f87171',
          onyx: '#64748b',
          gold: '#fbbf24',
        },
      },
      boxShadow: {
        focus: '0 0 0 3px rgba(248, 250, 252, 0.35)',
      },
    },
  },
  plugins: [],
}

