/** @type {import('tailwindcss').Config} */
export default {
   content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
   ],
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
   plugins: [require("daisyui")],
}
