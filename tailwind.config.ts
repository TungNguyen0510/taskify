import type { Config } from 'tailwindcss';

const { nextui } = require('@nextui-org/react');

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          10: '#1677ff',
        },
        secondary: {},
        tertiary: {},
        gray: {
          10: '#E0E3E3',
          20: '#C4C7C7',
          30: '#A9ACAC',
          40: '#8E9192',
        },
        error: '#E53E3E',
        success: '#27AE60',
        warning: '#FFCB3D',
        info: '#72C8CC',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
} satisfies Config;
