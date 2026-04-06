/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0eeff',
          100: '#e0ddff',
          200: '#c4baff',
          300: '#a08fff',
          400: '#8373ff',
          500: '#6c63ff',
          600: '#5a4de6',
          700: '#4639bf',
          800: '#352d99',
          900: '#28227a',
        },
        dark: {
          50: '#f5f5f6',
          100: '#e6e6e8',
          200: '#d0d0d4',
          300: '#afafb6',
          400: '#868690',
          500: '#6b6b76',
          600: '#5b5b64',
          700: '#4e4e55',
          800: '#1e1e2e',
          900: '#13131d',
          950: '#0b0b12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(108, 99, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(108, 99, 255, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
