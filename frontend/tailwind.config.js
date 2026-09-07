/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Noto Sans Devanagari'", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["'Plus Jakarta Sans'", "'Noto Sans Devanagari'", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        reading: ["'Plus Jakarta Sans'", "'Noto Sans Devanagari'", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        sage: {
          50: "#f4f7f5",
          100: "#e5ece7",
          200: "#cedcd3",
          300: "#abc3b5",
          400: "#81a491",
          500: "#608772",
          600: "#4c6e5c",
          700: "#3d574a",
          800: "#33463c",
          900: "#2a3a33",
          950: "#16201c",
        },
        emerald: {
          850: "#064635",
          950: "#022c22",
        },
        dark: {
          bg: "#090E11",
          surface: "#0F181C",
          elevated: "#162329",
          border: "#1F333B",
        }
      },
      boxShadow: {
        'glow-emerald': '0 0 40px -10px rgba(16, 185, 129, 0.25)',
        'glow-sage': '0 0 50px -12px rgba(96, 135, 114, 0.25)',
        'glass': '0 20px 50px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
