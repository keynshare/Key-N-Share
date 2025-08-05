/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
    extend: {
       fontFamily: {
        bricola: ['var(--font-bricolage-grotesque)'],
        cinzel: ['var(--font-cinzel-decorative)'],
        body: ['inherit'],
      },
    },
  },
  plugins: [],
}

