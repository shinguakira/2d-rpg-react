import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        gameboy: ['gameboy', 'monospace'],
      },
      width: {
        'game': 'calc(var(--width) * 1px)',
      },
      height: {
        'game': 'calc(var(--height) * 1px)',
      },
      colors: {
        'font-color': 'var(--font-color)',
      },
    },
  },
  plugins: [],
} satisfies Config;
