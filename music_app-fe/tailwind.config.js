/** @type {import('tailwindcss').Config} */

// tailwind.config.js (ESM)
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
    },
    extend: {
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
      colors: {
        brand: {
          600: "#2563eb", // blue-600
          700: "#1d4ed8",
        },
      },
    },
  },
  plugins: [forms, typography, aspectRatio],
};
