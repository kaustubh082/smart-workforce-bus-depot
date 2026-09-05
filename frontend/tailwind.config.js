/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ─── Surfaces ─────────────────────────────────────
        bg: { page: '#F7F9FC', white: '#FFFFFF', muted: '#EEF2F7' },
        surface: {
          DEFAULT: '#FFFFFF',
          50: '#F7F9FC',
          100: '#EEF2F7',
          200: '#E5EAF0',
          300: '#D0DAE6',
          400: '#B7C5D6',
        },
        // ─── Borders ──────────────────────────────────────
        border: { DEFAULT: '#E5EAF0', strong: '#D0DAE6', focus: '#19A7A8' },
        // ─── Primary (deep navy) ──────────────────────────
        primary: {
          900: '#0B2239',
          800: '#123B5D',
          700: '#176B87',
          600: '#1A7FA0',
          500: '#2290B5',
        },
        // ─── Accent teal / blue ───────────────────────────
        accent: {
          teal: '#19A7A8',
          'teal-dark': '#178F90',
          'teal-light': '#E6F7F7',
          blue: '#2D8CFF',
          'blue-dark': '#1A6FD4',
          'blue-light': '#E8F2FF',
        },
        // ─── Text ─────────────────────────────────────────
        text: {
          primary: '#14212B',
          secondary: '#425466',
          muted: '#6B7E92',
          faint: '#98A9BB',
          inverse: '#FFFFFF',
        },
        // ─── Semantic ─────────────────────────────────────
        success: { DEFAULT: '#10b981', light: '#d1fae5' },
        danger: { DEFAULT: '#ef4444', light: '#fee2e2' },
        warning: { DEFAULT: '#f59e0b', light: '#fef3c7' },
        info: { DEFAULT: '#19A7A8', light: '#E6F7F7' },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 4px rgba(18,59,93,0.06), 0 4px 16px rgba(18,59,93,0.05)',
        'card-hover': '0 4px 20px rgba(18,59,93,0.12)',
        modal: '0 8px 40px rgba(18,59,93,0.14)',
        'accent-glow': '0 0 20px rgba(25,167,168,0.22)',
        soft: '0 2px 8px rgba(18,59,93,0.05)',
        float: '0 12px 32px rgba(18,59,93,0.12)',
      },
      borderRadius: { card: '14px', btn: '8px', xl2: '20px' },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #123B5D 0%, #176B87 100%)',
        'gradient-accent': 'linear-gradient(135deg, #19A7A8 0%, #2D8CFF 100%)',
        'gradient-page': 'linear-gradient(180deg, #F7F9FC 0%, #FFFFFF 100%)',
      },
      animation: {
        float: 'floatY 6s ease-in-out infinite',
        'float-slow': 'floatY 9s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
      },
      keyframes: {
        floatY: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
    },
  },
  plugins: [],
};
