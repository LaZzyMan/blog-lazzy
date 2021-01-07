module.exports = {
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'accent-1': '#333',
      },
      spacing: {
        bkl: '2.6vw',
        bkw: '5.5vw',
        bklw: '8.1vw',
        bk2wl: '13.6vw',
        line: '1px',
        h1: '1vh',
        h2: '2vh',
        h5: '5vh',
        h10: '10vh',
      },
      zIndex: {
        bottom: '-1',
      },
      sizing: {
        bkw: '5.5vw',
        bkl: '2.6vw',
        bklw: '8.1vw',
        bk2wl: '13.6vw',
        line: '1px',
        h1: '1vh',
        h2: '2vh',
        h5: '5vh',
        h10: '10vh',
      },
      fontSize: {
        h1: '2.5em',
        h2: '1.5em',
        h3: '1.25em',
        h4: '1.125em',
        content: '1em',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
