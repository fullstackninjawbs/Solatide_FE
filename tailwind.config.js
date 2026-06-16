/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 'Poppins' is now the default sans-serif for the entire project.
        // All Tailwind classes like font-sans, and the base body style, will use Poppins.
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: "#aa3bff",
        brand: {
          blue: "#0079CE",
          cyan: "#00ADEE",
          navy: "#102a5c",
          navyDark: "#0d2255",
        },
      },
      backgroundImage: {
        'cta-gradient': 'linear-gradient(90deg, #00ADEE 0%, #0079CE 100%)',
        'cta-gradient-hover': 'linear-gradient(90deg, #009ed8 0%, #006ab8 100%)',
      },
      boxShadow: {
        'cta': '0 6px 20px -4px rgba(0, 121, 206, 0.40)',
        'cta-hover': '0 8px 28px -4px rgba(0, 121, 206, 0.58)',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
