/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,js}"],
  theme: {
    extend: {
      colors: {
        ink: "#05070a",
        frost: "#eaf4fb",
        glacier: "#9cc7e0",
        ice: "#cfe8f5",
      },
      fontFamily: {
        sans: ["Suisse Intl", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["Editorial New", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
