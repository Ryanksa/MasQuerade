/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "25%": {
            transform: "rotate(-3deg)",
          },
          "50%": {
            transform: "rotate(8deg)",
          },
          "75%": {
            transform: "rotate(5deg)",
          },
          "100%": {
            transform: "rotate(5deg) skew(-2deg, -4deg)",
          },
        },
        expand: {
          "0%": {
            width: 0,
            height: 0,
          },
          "100%": {
            width: "200%",
            height: "200%",
          },
        },
        slideOffCard: {
          "0%": {
            left: 0,
            top: 0,
            rotate: 0,
          },
          "100%": {
            left: "0.5rem",
            top: "0.5rem",
            rotate: "6deg",
          },
        },
        loadingSpin: {
          "0%": {
            rotate: "y 0deg",
          },
          "80%": {
            rotate: "y 750deg",
          },
          "90%": {
            rotate: "y 720deg",
          },
          "100%": {
            rotate: "y 720deg",
          },
        },
      },
      animation: {
        wiggle: "wiggle 250ms",
        expand: "expand 300ms linear forwards",
        slideOffCard: "slideOffCard 300ms cubic-bezier(.6,1.5,.6,1.5)",
        loadingSpin: "loadingSpin 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
