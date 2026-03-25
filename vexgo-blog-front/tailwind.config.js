/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        light: '#f8fafc',
        dark: '#1e293b',
      },
    },
  },
  plugins: [],
  corePlugins: {
    // Ensure that background color utilities are enabled
    backgroundOpacity: true,
  }
}