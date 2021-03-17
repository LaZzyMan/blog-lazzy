module.exports = {
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        'card-cover': 'linear-gradient(to bottom left, rgba(26,32,44,0),  rgba(26,32,44,0.9), rgba(26,32,44,1.0))',
      }),
      colors: {
        'accent-1': '#333',
      },
      spacing: {
        half: '50%',
        bkl: '2.6vw',
        bklfixed: '2.8vw',
        bkw: '5.5vw',
        bklw: '8.1vw',
        '2bklw': '16.2vw',
        bk2wl: '13.6vw',
        line: '1px',
        w1: '1vw',
        w2: '2vw',
        w5: '5vw',
        w10: '10vw',
        wsection: '72.9vw',
        wpost: '62.2vw;',
        h1: '1vh',
        h2: '2vh',
        h5: '5vh',
        h10: '10vh',
        h27: '27vh',
        hcard: '45vh',
        hmain: '35vh',
        hsection: '68vh',
        hpost: '85vh',
      },
      zIndex: {
        bottom: '-1',
      },
      sizing: {
        half: '50%',
        bkw: '5.5vw',
        bkl: '2.6vw',
        bklw: '8.1vw',
        '2bklw': '16.2vw',
        bk2wl: '13.6vw',
        line: '1px',
        w1: '1vw',
        w2: '2vw',
        w5: '5vw',
        w10: '10vw',
        wsection: '72.9vw',
        wpost: '62.2vw;',
        h1: '1vh',
        h2: '2vh',
        h5: '5vh',
        h10: '10vh',
        hcard: '45vh',
        hsection: '68vh',
        hpost: '85vh',
      },
      fontSize: {
        title: '5vw',
        h1: '4vw',
        h2: '2.5vw',
        h3: '2vw',
        h4: '1.5vw',
        content: '1.25vw',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
