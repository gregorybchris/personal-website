/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#f5f5f0",
        sky: "#6283c0",
        royal: "#1f43b6",
      },
    },
    fontFamily: {
      raleway: "Raleway",
      iowa: "Iowa Old Style BT",
      sanchez: "Sanchez",
    },
  },
  plugins: [],
};
