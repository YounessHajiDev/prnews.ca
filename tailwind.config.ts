// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'wire-ink': '#14161C',
        'wire-paper': '#F7F5EF',
        'wire-surface': '#FFFFFF',
        'wire-brass': '#B8924A',
        'wire-brass-light': '#D1B27A',
        'wire-brass-dark': '#8F7238',
        'wire-red': '#B23A2E',
        'wire-slate': '#6B7280',
        'wire-rule': '#E4E0D6',
        // Legacy aliases
        'wire-charcoal': '#14161C',
        'wire-bg': '#F7F5EF',
        'wire-amber': '#B8924A',
        'wire-amber-light': '#D1B27A',
        'wire-amber-dark': '#8F7238',
        'wire-border': '#E4E0D6',
        'wire-muted': '#6B7280',
        'wire-success': '#0F5C3E',
        'wire-warning': '#A66A18',
        'wire-error': '#B23A2E',
      },
      fontFamily: {
        display: ['var(--font-display)', ...fontFamily.serif],
        body: ['var(--font-body)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-node': {
          '0%, 100%': { opacity: '0.9' },
          '50%': { opacity: '0.25' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-left': {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-right': {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        'pulse-node': 'pulse-node 2.5s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out both',
        'fade-in': 'fade-in 0.8s ease-out both',
        'fade-up': 'fade-up 0.7s ease-out both',
        'slide-left': 'slide-left 0.7s ease-out both',
        'slide-right': 'slide-right 0.7s ease-out both',
        'scale-in': 'scale-in 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
