/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        card: 'var(--card)',
        card2: 'var(--card2)',
        purple: 'var(--purple)',
        violet: 'var(--violet)',
        pink: 'var(--pink)',
        blue: 'var(--blue)',
        cyan: 'var(--cyan)',
        green: 'var(--green)',
        amber: 'var(--amber)',
        red: 'var(--red)',
        textMain: 'var(--text)',
        textSec: 'var(--text2)',
        borderBase: 'var(--border)',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        'mini': '10px',
        'btn': '14px',
        'card': '18px',
        'hero': '24px',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
      }
    },
  },
  plugins: [],
}
