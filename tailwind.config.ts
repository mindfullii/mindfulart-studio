import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        'space-mono': ['Space Mono', 'monospace'],
      },
      colors: {
        primary: '#4F46E5',
        secondary: '#6B7280',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        border: '#E5E7EB',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
