/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '400px',
        'tablet': '900px',
      },
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'border': 'var(--border-color)',
        'card': 'var(--card-bg)',
        'card-border': 'var(--card-border)',
        'sidebar': 'var(--sidebar-bg)',
        'sidebar-text': 'var(--sidebar-text)',
        'sidebar-text-secondary': 'var(--sidebar-text-secondary)',
        'sidebar-hover': 'var(--sidebar-text-hover)',
        'sidebar-active-bg': 'var(--sidebar-active-bg)',
        'sidebar-active-text': 'var(--sidebar-active-text)',
        'sidebar-hover-bg': 'var(--sidebar-item-hover-bg)',
        'accent': 'var(--accent-color)',
        'accent-hover': 'var(--accent-hover)',
        'error': 'var(--error-color)',
        'success': 'var(--success-color)',
        'warning': 'var(--warning-color)',
        'info': 'var(--info-color)',
      },
    },
  },
  plugins: [],
};
