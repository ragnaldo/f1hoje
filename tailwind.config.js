/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'f1-red': '#e10600',
        'f1-dark': '#15151e',
        'f1-gray': '#f0f2f5',
      },
    },
  },
  plugins: [],
};
