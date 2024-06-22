import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        customWhite:"#ffff",
        customPurpleBg: '#734B93',
        customeDarkPurpleTexts: "#4C1882",
        customlightBlue: "#017AFF",
        customSungloLight: "#FC9390",
        customSungloPeach: "#EC6D69",
        customSungloDark: "#BC3835",
        customBlueText: "#002355",
        customBlueHover: "#0067E4",
        customGoldTips: "#DDBA2E",

      },
    },
  },
  plugins: [],
};
export default config;
