/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF4500",
        dark: {
          bg: "#121212",
          surface: "#1E1E1E",
          border: "#2D2D2D",
          text: "#E0E0E0",
        },
      },
    },
  },
  plugins: [],
};
