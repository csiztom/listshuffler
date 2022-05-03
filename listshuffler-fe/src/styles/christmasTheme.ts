import { extendTheme } from '@chakra-ui/react'
import '@fontsource/catamaran'

const christmasTheme = extendTheme({
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
    radii: {
        button: '2px',
        card: '5px',
    },
    config: {
        initialColorMode: 'system',
    },
})

export default christmasTheme
