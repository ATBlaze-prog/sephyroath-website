import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import animate from 'tailwindcss-animate';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SephyrOath Brand Colors
        'so-dark': '#0A0E27',
        'so-darker': '#050812',
        'so-primary': '#FF6B35',
        'so-primary-light': '#FF8C00',
        'so-gold': '#D4AF37',
        'so-gold-light': '#E8C547',
        'so-purple': '#9D4EDD',
        'so-neon-red': '#FF5722',
        'so-gray-100': '#F0F0F0',
        'so-gray-200': '#E0E0E0',
        'so-gray-300': '#C0C0C0',
        'so-gray-400': '#808080',
        'so-gray-500': '#606060',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        heading: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
        '5xl': '8rem',
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(255, 107, 53, 0.5)',
        'glow-red-lg': '0 0 40px rgba(255, 107, 53, 0.8)',
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.5)',
        'glow-purple': '0 0 20px rgba(157, 78, 221, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-down': 'slide-down 0.3s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(255, 107, 53, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(255, 107, 53, 0.8)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom, #0A0E27, #050812)',
        'gradient-fire': 'linear-gradient(135deg, #FF6B35 0%, #FF8C00 100%)',
      },
      transitionDuration: {
        250: '250ms',
        350: '350ms',
      },
    },
  },
  plugins: [animate],
};

export default config;
