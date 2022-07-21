const plugin = require("tailwindcss/plugin");

const rotateY = plugin(function ({ addUtilities }) {
  addUtilities({
    ".rotate-y-25": {
      transform: "rotateY(25deg)",
    },
    ".rotate-y-35": {
      transform: "rotateY(35deg)",
    },
  });
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "sidebar-option-overflow": {
          "100%": {
            overflow: "visible",
          },
        },
        "sidebar-option-home": {
          "75%": {
            left: "-4rem",
            top: "-2rem",
            transform: "scaleX(0.25)",
          },
          "100%": {
            left: "-6rem",
            top: "-2rem",
            transform: "scaleX(1)",
          },
        },
        "sidebar-option-chats": {
          "75%": {
            right: "-6rem",
            top: "-3rem",
            transform: "scale(0.3, 0.9)",
          },
          "100%": {
            right: "-8rem",
            top: "-3rem",
            transform: "scale(1)",
          },
        },
        "sidebar-option-profile": {
          "75%": {
            left: "-3rem",
            top: "6rem",
            transform: "scaleX(0.25)",
          },
          "100%": {
            left: "-5rem",
            top: "6rem",
            transform: "scaleX(1)",
          },
        },
        "sidebar-option-logout": {
          "75%": {
            right: "-6rem",
            top: "4rem",
            transform: "scale(0.3, 0.9)",
          },
          "100%": {
            right: "-8rem",
            top: "4rem",
            transform: "scale(1)",
          },
        },
      },
      animation: {
        "sidebar-option-overflow":
          "sidebar-option-overflow 250ms linear 0ms forwards",
        "sidebar-option-home":
          "sidebar-option-home 200ms linear 150ms forwards",
        "sidebar-option-chats":
          "sidebar-option-chats 200ms linear 200ms forwards",
        "sidebar-option-profile":
          "sidebar-option-profile 200ms linear 200ms forwards",
        "sidebar-option-logout":
          "sidebar-option-logout 200ms linear 150ms forwards",
      },
    },
  },
  plugins: [rotateY],
};
