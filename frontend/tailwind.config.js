/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: { 50:'#f0fdf4',100:'#dcfce7',500:'#22c55e',600:'#16a34a',700:'#15803d',900:'#14532d' },
        surface: { 50:'#fafafa',100:'#f4f4f5',200:'#e4e4e7',800:'#27272a',900:'#18181b',950:'#09090b' }
      }
    }
  },
  plugins: []
}
