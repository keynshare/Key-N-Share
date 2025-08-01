/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
    extend: {
       fontFamily: {
        poppins: ['var(--font-poppins)'],
        bricola: ['var(--font-bricolage-grotesque)'],
        body: ['inherit'],
      },
    },
  },
  plugins: [],
}

