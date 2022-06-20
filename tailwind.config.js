module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#03A9F4",
        secondary: "#F0C90A",
        primarypink: "#ED1576",
        accent: "#1D3442",
        primaryone: "#4609D6",
        primarygray: "#F5F5F5",
        primaryaccent: "#1D3442",
        primarybrown: "#D65B09",
      },
    },
  },
  plugins: [require("daisyui")],
};