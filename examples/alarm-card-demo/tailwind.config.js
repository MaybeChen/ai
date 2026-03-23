/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        panel: '#0f172a',
        surface: '#111827',
        accent: '#38bdf8',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(148, 163, 184, 0.12), 0 20px 60px rgba(15, 23, 42, 0.45)',
      },
    },
  },
  plugins: [],
};
