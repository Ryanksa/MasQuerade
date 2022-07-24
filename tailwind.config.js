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
      },
      animation: {
        wiggle: "wiggle 250ms",
      },
    },
  },
  plugins: [],
};
