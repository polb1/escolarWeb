/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta por asignatura (via CSS vars para permitir tema)
        subject: {
          math: 'var(--color-subject-math)',
          spanish: 'var(--color-subject-spanish)',
          catalan: 'var(--color-subject-catalan)',
          science: 'var(--color-subject-science)',
          english: 'var(--color-subject-english)'
        },
        surface: 'var(--color-surface)',
        surfaceElevated: 'var(--color-surface-elevated)',
        ink: 'var(--color-ink)',
        inkSoft: 'var(--color-ink-soft)',
        brand: 'var(--color-brand)'
      },
      fontFamily: {
        sans: ['"Nunito"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.06)',
        cardHover: '0 8px 30px rgba(0,0,0,0.10)'
      }
    }
  },
  plugins: []
};
