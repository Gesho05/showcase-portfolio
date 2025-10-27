/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        'helvetica-compressed': ['Helvetica Compressed', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        spacemono: ['SpaceMono', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        spacemonobold: ['SpaceMonoBold', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        myfont: ['Helvetica Compressed', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

