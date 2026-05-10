import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-red-500',
    'bg-white',
    'min-h-screen',
    'flex',
    'items-center',
    'justify-center',
    'text-white',
    'text-4xl',
    'font-bold',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        sans: ['Instrument Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
