/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
     "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			bricola: [
  				'var(--font-bricolage-grotesque)'
  			],
  			cinzel: [
  				'var(--font-cinzel-decorative)'
  			],
  			body: [
  				'inherit'
  			]
  		},  
		screens: {
            '3xl': '2000px',  // Another custom breakpoint
          },
  		
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

