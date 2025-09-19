/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // App Router files
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Pages Router (if used)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Components
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#2b6cb0', // Optional custom color
      },
    },
  },
  plugins: [],
};