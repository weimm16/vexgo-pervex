/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
        secondary: '#64748b',
        light: '#f8fafc',
        dark: '#1e293b',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  corePlugins: {
    // Ensure that background color utilities are enabled
    backgroundOpacity: true,
  }
}