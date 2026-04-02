/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:       '#1A237E',
        'primary-hover':'#121858',
        'primary-light':'#E8EAF6',
        secondary:     '#6A1B9A',
        'secondary-light':'#F3E5F5',
        accent:        '#E65100',
        'accent-light':'#FFF3E0',
        bg:            '#F5F6FA',
        surface:       '#FFFFFF',
        'text-main':   '#111827',
        'text-sub':    '#374151',
        'border-main': '#D1D5DB',
        success:       '#166534',
        'success-bg':  '#DCFCE7',
        error:         '#991B1B',
        'error-bg':    '#FEE2E2',
      },
      borderRadius: {
        sm:  '10px',
        md:  '16px',
        lg:  '24px',
        xl:  '32px',
        '2xl':'40px',
      },
      fontFamily: {
        sans: ["'Heebo'", "'Assistant'", 'sans-serif'],
      },
      fontSize: {
        // Bump every size +1 step for elderly readability
        base: ['1.125rem', { lineHeight: '1.7' }],   // 18px
        lg:   ['1.25rem',  { lineHeight: '1.7' }],   // 20px
        xl:   ['1.375rem', { lineHeight: '1.6' }],   // 22px
        '2xl':['1.625rem', { lineHeight: '1.5' }],   // 26px
        '3xl':['1.875rem', { lineHeight: '1.4' }],   // 30px
        '4xl':['2.25rem',  { lineHeight: '1.3' }],   // 36px
        '5xl':['2.75rem',  { lineHeight: '1.2' }],   // 44px
        '6xl':['3.25rem',  { lineHeight: '1.15' }],  // 52px
        '7xl':['4rem',     { lineHeight: '1.1' }],   // 64px
        '8xl':['5rem',     { lineHeight: '1' }],     // 80px
      },
      spacing: {
        touch: '56px',   // minimum touch target
        'touch-lg': '72px',
      },
      boxShadow: {
        card:   '0 2px 12px rgba(0,0,0,0.08)',
        strong: '0 6px 28px rgba(0,0,0,0.14)',
        focus:  '0 0 0 4px rgba(27,94,32,0.35)',
      },
      screens: {
        xs: '380px',
      },
    },
  },
  plugins: [],
};
