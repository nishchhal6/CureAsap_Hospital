/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#b30000',
          light: '#ff3333',
          dark: '#8f0000'
        },
        navy: '#001F3F',
        'medical-blue': '#007BFF'
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 25px rgba(0,0,0,0.1)',
        'emergency': '0 0 20px rgba(179, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
