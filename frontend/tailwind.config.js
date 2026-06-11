/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        cc: {
          bg:           'var(--cc-bg)',
          surface:      'var(--cc-surface)',
          card:         'var(--cc-card)',
          nav:          'var(--cc-nav)',
          border:       'var(--cc-border)',
          accent:       '#f59e0b',
          'accent-hover': '#fbbf24',
          green:        'var(--cc-green)',
          blue:         '#58a6ff',
          purple:       '#a371f7',
          red:          '#f85149',
          orange:       '#fb8f44',
          muted:        'var(--cc-muted)',
          text:         'var(--cc-text)',
          subtle:       'var(--cc-subtle)',
          faint:        'var(--cc-faint)',
        },
      },
      animation: {
        'fade-in':  'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
