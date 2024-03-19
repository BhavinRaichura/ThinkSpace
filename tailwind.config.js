/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/*.{html,js,jsx}',
    './src/**/*.{html,js,ts,jsx,vue}',
    './src/**/**/*.{html,js,ts,jsx,vue}',
    './src/**/**/**/*.{html,js,ts,jsx,vue}',
    './src/**/**/**/**/*.{html,js,ts,jsx,vue}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

