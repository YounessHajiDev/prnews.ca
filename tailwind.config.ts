// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'wire-charcoal': '#14161C',
        'wire-amber': '#D4A017',
        'wire-amber-light': '#EAB82A',
        'wire-amber-dark': '#B8860B',
        'wire-bg': '#FAFAF8',
        'wire-surface': '#FFFFFF',
        'wire-border': '#E5E7EB',
        'wire-muted': '#6B7280',
        'wire-success': '#059669',
        'wire-warning': '#D97706',
        'wire-error': '#DC2626',
      },
      fontFamily: {
        display: ['var(--font-display)', ...fontFamily.serif],
        body: ['var(--font-body)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'slide-in': 'slide-in 30s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
