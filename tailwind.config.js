module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // adjust this path as needed
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  variants: {
    extend: {
      scrollbar: ['rounded'], // optional if you're using a scrollbar plugin
    },
  },
  corePlugins: {
    // don't disable overflow/scrollbar by default
  }
}
