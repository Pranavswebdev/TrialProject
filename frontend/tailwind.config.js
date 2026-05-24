/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'indigo': {
          '500': '#4F46E5',
          '600': '#4338CA',
        },
        'purple': {
          '500': '#7C3AED',
        },
      },
      backgroundColor: {
        'app-bg': '#F5F3FF',
      }
    },
  },
  plugins: [],
}
