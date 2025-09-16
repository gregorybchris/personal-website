/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#6283c0",
        "accent-light": "#a6b8d8",
        "accent-focus": "#1f43b6",
        background: "#f5f5f0",
        "background-dark": "#d7d7d2",
        "background-highlight": "#d5d3d3",
        "background-highlight-active": "#c7c5c5",
        "background-highlight-light": "#e5e3e3",
        shadow: "#b4b4b4",
        "text-2": "#6b6b6a",
        "text-3": "#0a0a0a",
        "text-4": "#b0b0b0",
        "dark-mask": "rgba(0, 0, 0, 0.4)",
      },
    },
    fontFamily: {
      noto: "Noto Serif TC",
      raleway: "Raleway",
      iowa: "Iowa Old Style BT",
      sanchez: "Sanchez",
    },
  },
  plugins: [],
};
