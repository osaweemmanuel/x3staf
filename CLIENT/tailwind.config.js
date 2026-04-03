/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Outfit", "Inter", "sans-serif"],
      "Outfit": ["Outfit", "sans-serif"],
      Raleway: ["Outfit", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#048372",
        secondary: "#AECF5A",
        light: "#AECF5A",
        textblack:"#1A1C1E",
        textgray:"#42474E",
      },
      screens: {
        wideScreen: "1400px",
        smallest: "375px",
        xmd: "920px",
        // => @media (min-width: 1400px) { ... }
      },
    },
  },
  plugins: [],
};
