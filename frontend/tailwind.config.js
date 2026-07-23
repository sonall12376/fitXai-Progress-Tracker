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
        bg: '#0A0A0A',
        card: '#161616',
        card2: '#101010',
        gold: '#F5C400',
        'gold-bright': '#FFD60A',
        'gold-amber': '#FFB300',
        'gold-dark': '#CA8A04',
        'gold-pale': '#FDE68A',
        lime: '#A3E635',
        amber: '#F59E0B',
        danger: '#EF4444',
        text1: '#FFFFFF',
        text2: '#B0AA9A',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'sm': '10px',
        'md': '14px',
        'lg': '18px',
        'xl': '22px',
        '2xl': '24px',
      },
      boxShadow: {
        'gold': '0 8px 20px -8px rgba(245,196,0,.6)',
        'card': '0 4px 24px rgba(0,0,0,.4)',
      },
    },
  },
  plugins: [],
};
