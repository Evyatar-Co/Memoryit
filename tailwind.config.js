/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1B5E20',
        'primary-light': '#E8F5E9',
        secondary: '#1565C0',
        'secondary-light': '#E3F2FD',
        accent: '#F57C00',
        bg: '#F5F6FA',
        surface: '#FFFFFF',
        'text-main': '#1A1A2E',
        'text-sub': '#4A5568',
        'border-main': '#E2E8F0',
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      fontFamily: {
        sans: ["'Heebo'", "'Assistant'", 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 16px rgba(0,0,0,0.08)',
        strong: '0 8px 32px rgba(0,0,0,0.14)',
      },
    },
  },
  plugins: [],
};
