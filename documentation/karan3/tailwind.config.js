/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",
    '*.{html,js}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      colors: {
        primary: '#0B92D2',
        secondary: '#C80404',
        accent: '#EBF9FF',
        'accent-darker': '#C7EBFC',
      }
    },
  },
  plugins: [],
}

