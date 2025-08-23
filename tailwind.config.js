/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lamaSky: "#c3ebfa",
        lamaSkyLight: "#edf9fd",
        lamaPurple: "#cfceff",
        lamaPurpleLight: "#f1f0ff",
        lamaYellow: "#fae27c",
        lamaYellowLight: "#fefce8",
        lamaGreen: "#0de6db",
        redDark: 'rgba(255, 0, 0, 0.473)',
        purple: '#7514a1'
      },
    },
  },
  plugins: [],
};
