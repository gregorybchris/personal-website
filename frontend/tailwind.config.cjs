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
        "text-1": "#3c3c3c",
        "text-2": "#6b6b6a",
        "text-3": "#0a0a0a",
        "text-4": "#b0b0b0",
        "dark-mask": "rgba(0, 0, 0, 0.4)",
      },
      gridTemplateColumns: {
        1: "repeat(1, minmax(0, 1fr))",
        2: "repeat(2, minmax(0, 1fr))",
        3: "repeat(3, minmax(0, 1fr))",
        4: "repeat(4, minmax(0, 1fr))",
      },
    },
    fontFamily: {
      noto: "Noto Serif TC",
      raleway: "Raleway",
    },
  },
  plugins: [],
};
