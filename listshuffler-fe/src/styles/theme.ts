import { extendTheme } from '@chakra-ui/react'
import '@fontsource/catamaran'

const theme = extendTheme({
    colors: {
        error: '#679934',
        success: '#679934',
        primary: {
            100: '#349999',
            200: '#349999',
            300: '#349999',
            400: '#349999',
            500: '#349999',
            600: '#349999',
            700: '#349999',
            800: '#349999',
            900: '#349999',
        },
        secondary: {
            100: '#d6d9db',
            200: '#d6d9db',
            300: '#d6d9db',
            400: '#d6d9db',
            500: '#d6d9db',
            600: '#d6d9db',
            700: '#d6d9db',
            800: '#d6d9db',
            900: '#d6d9db',
        },
    },
    semanticTokens: {
        colors: {
            background: {
                default: '#F9FCFC',
                _dark: '#0A1D1D',
            },
            card: {
                default: '#E6F2F280',
                _dark: '#2B414180',
            },
            text: {
                default: '#37383a',
                _dark: '#d6d9db',
            },
        },
    },
    fonts: {
        heading: 'Catamaran, sans-serif',
        body: 'Catamaran, sans-serif',
    },
    fontSizes: {
        xsmall: '0.75rem',
        small: '0.8rem',
        medium: '1rem',
        large: '1.3rem',
        xlarge: '2rem',
    },
    fontWeights: {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
    },
    space: {
        px: '1px',
        0.5: '2px',
        1: '4px',
        1.5: '6px',
        2: '8px',
        2.5: '10px',
        3: '12px',
        3.5: '14px',
        4: '16px',
        4.5: '18px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
    },
    breakpoints: {
        sm: '30em',
        md: '48em',
        lg: '62em',
        xl: '80em',
    },
    radii: {
        button: '2px',
        card: '5px',
    },
    config: {
        initialColorMode: 'system',
    },
})

export default theme
