/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5BC0DE",
        secondary: "#31A6C4",
      },
    },
  },
  plugins: [],
};
