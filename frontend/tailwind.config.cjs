/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(245, 245, 240)",
        accent: "rgb(98, 131, 192)",
        "accent-focus": "rgb(31, 67, 182)",
        "background-highlight": "rgb(213, 211, 211)",
        "background-highlight-active": "rgb(199, 197, 197)",
        shadow: "rgb(180, 180, 180)",
        "text-1": "rgb(60, 60, 60)",
        "text-2": "rgb(107, 107, 106)",
        "text-3": "rgb(10, 10, 10)",
        "dark-background": "rgb(215, 215, 210)",
      },
      gridTemplateColumns: {
        1: "repeat(1, minmax(0, 1fr))",
        2: "repeat(2, minmax(0, 1fr))",
        3: "repeat(3, minmax(0, 1fr))",
        4: "repeat(4, minmax(0, 1fr))",
      },
    },
    fontFamily: {
      raleway: "Raleway",
      noto: "Noto Serif TC",
    },
  },
  plugins: [],
};
