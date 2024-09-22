import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        'black': '#000000',
      },
      textColor: {
        'white': '#ededed',
      },
      backdropBlur: {
        sm: '4px',
      },
    },
  },
  plugins: [],
};

export default config;
