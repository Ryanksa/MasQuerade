/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggleOption: {
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
        expandMenu: {
          "0%": {
            maxHeight: "0px",
          },
          "100%": {
            maxHeight: "999px",
          },
        },
        expandSettings: {
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
            left: "8px",
            top: "8px",
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
        slideDown: {
          "0%": {
            translate: "0 -150px",
            opacity: 0,
          },
          "50%": {
            opacity: 1,
          },
          "100%": {
            translate: "0 0",
            opacity: 1,
          },
        },
        slideUp: {
          "0%": {
            translate: "0 150px",
            opacity: 0,
          },
          "50%": {
            opacity: 1,
          },
          "100%": {
            translate: "0 0",
            opacity: 1,
          },
        },
      },
      animation: {
        wiggleOption: "wiggleOption 240ms",
        expandMenu: "expandMenu 180ms cubic-bezier(.57,.02,.57,.02) forwards",
        expandSettings: "expandSettings 300ms linear forwards",
        slideOffCard: "slideOffCard 300ms cubic-bezier(.6,1.5,.6,1.5)",
        loadingSpin: "loadingSpin 3s ease-in-out infinite",
        slideDown: "slideDown 150ms ease-out",
        slideUp: "slideUp 150ms ease-out",
      },
    },
  },
  plugins: [],
};
