/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* 폰트 세팅 */
      fontFamily: {
        sans: ["Spoqa Han Sans Neo", "Noto Sans KR", "sans-serif"],
      },
      /* 폰트 사이즈 */
      fontSize: {
        xs: "10px",
        sm: "12px",
        base: "14px",
        lg: "16px",
        xl: "18px",
        "2xl": "24px",
        "3xl": "30px",
      },
      /* 폰트 굵기 */
      fontWeight: {
        regular: "400",
        medium: "500",
        bold: "700",
      },
      /* 색상 설정 */
      colors: {
        primary: {
          DEFAULT: "#2E6FF2",
          light: "#5C8EF2",
        },
        activation: "#DEE8FF",
        error: {
          DEFAULT: "#FF3440",
          light: "#fef2f2",
          border: "#fecaca",
        },
        warning: {
          DEFAULT: "#FFC533",
          light: "#FFE187",
        },
        gray: {
          900: "#121314",
          700: "#47494D",
          500: "#8D9299",
          300: "#D9DBE0",
          100: "#F3F5FA",
        },
        background: "#FFFFFF",
        surface: "#121314",
      }
    },
  },
  plugins: [],
}
