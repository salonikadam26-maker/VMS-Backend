/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ye line ensure karti hai ki Tailwind src folder ko check kare
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
