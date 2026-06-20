/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E5F8A',
          light: '#3A8BC2',
          dark: '#0F4870',
          50: '#E8F4FB',
          100: '#D1E9F6',
          200: '#A3D3ED',
          300: '#75BDE4',
          400: '#47A7DB',
          500: '#1E5F8A',
          600: '#1A4D70',
          700: '#153A55',
          800: '#10283B',
          900: '#0B1620',
        },
        mint: {
          DEFAULT: '#4ECDC4',
          light: '#7EDDD6',
          dark: '#3AA89F',
          50: '#E8FAF8',
          100: '#D1F5F2',
          200: '#A3EBE5',
          300: '#75E1D8',
          400: '#4ECDC4',
          500: '#3AB8AF',
          600: '#2E938B',
          700: '#236E68',
          800: '#174945',
          900: '#0C2523',
        },
        coral: {
          DEFAULT: '#FF6B6B',
          light: '#FF9E9E',
          dark: '#E85555',
          50: '#FFF0F0',
          100: '#FFE1E1',
          200: '#FFC3C3',
          300: '#FFA5A5',
          400: '#FF8787',
          500: '#FF6B6B',
          600: '#E85555',
          700: '#B84242',
          800: '#883030',
          900: '#581F1F',
        },
        ivory: {
          DEFAULT: '#F7F7F2',
          dark: '#E8E8DD',
        },
        slate: {
          DEFAULT: '#2C3E50',
          light: '#5D7083',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(30, 95, 138, 0.08)',
        'card-hover': '0 8px 30px rgba(30, 95, 138, 0.15)',
        'card-active': '0 2px 10px rgba(30, 95, 138, 0.1)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
