/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6DB889',
          hover: '#5EA677',
          active: '#4F8F65',
        },
        secondary: {
          DEFAULT: '#88B3BA',
          hover: '#779EA5',
          active: '#658990',
        },
        text: {
          primary: '#1A1A1A',
          secondary: '#4A4A4A',
          tertiary: '#717171',
        },
        bg: {
          primary: '#FFFFFF',
          subtle: '#F5F7F6',
        },
        status: {
          success: '#4CAF50',
          warning: '#FFA726',
          error: '#EF5350',
          info: '#42A5F5',
        },
      },
      fontFamily: {
        heading: ['EB Garamond', 'serif'],
        subheading: ['Spectral', 'serif'],
        body: ['Quattrocento Sans', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}; 