/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 30px -12px rgba(15, 23, 42, 0.25)",
        card: "0 10px 30px -18px rgba(2, 6, 23, 0.35)"
      }
    }
  },
  plugins: []
};
