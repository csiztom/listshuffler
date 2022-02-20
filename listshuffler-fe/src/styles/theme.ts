import { Catamaran } from '../assets';
import { createTheme } from '@mui/material/styles'
import { green, purple, grey } from '@mui/material/colors'

const defaultPalette = {
    primary: {
        main: '#349999',
        light: '#67B3B3',
        dark: '#277373',
    },
    secondary: {
        main: '#d6d9db',
        light: '#E0E3E4',
        dark: '#A1A3A4',
    },
    error: {
        main: '#993434',
        light: '#B36767',
        dark: '#732727',
    },
}

const defaultTypography = {
    fontFamily: 'Catamaran, sans-serif',
    components: {
        MuiCssBaseline: {
            styleOverrides: `
            @font-face {
              font-family: 'Catamaran';
              font-style: normal;
              font-display: swap;
              font-weight: 200;
              src: local('Catamaran'), local('Raleway-Regular'), url(${Catamaran}) format('truetype');
            }
          `,
        },
    },
}

const lightTheme = createTheme({
    palette: {
        ...defaultPalette,
        text: {
            primary: '#37383a',
            secondary: '',
            disabled: '',
        },
        background: {
            default: '',
            paper: '',
        },
        mode: 'light',
    },
    typography: defaultTypography,
})

const darkTheme = createTheme({
    palette: {
        ...defaultPalette,
        text: {
            primary: '#d6d9db',
            secondary: '',
            disabled: '',
        },
        background: {
            default: '',
            paper: '',
        },
        mode: 'dark',
    },
    typography: defaultTypography,
})

export { lightTheme, darkTheme }
