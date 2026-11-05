/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f0f0f',
          surface: '#16161c',
          border: '#22222a',
        },
        tanishuv: {
          purple: '#8A2BE2',
          pink: '#DA70D6',
        },
      },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(135deg, #8A2BE2 0%, #DA70D6 100%)',
        'purple-dark-gradient': 'linear-gradient(180deg, #181224 0%, #0f0f0f 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
