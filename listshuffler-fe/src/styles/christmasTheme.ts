import { extendTheme } from '@chakra-ui/react'
import '@fontsource/catamaran'

const christmasTheme = extendTheme({
    colors: {
        error: '#993434',
        success: '#679934',
        primary: {
            100: '#58c6c6',
            200: '#49c1c1',
            300: '#3eb6b6',
            400: '#39a7a7',
            500: '#349999',
            600: '#2f8989',
            700: '#2a7a7a',
            800: '#246a6a',
            900: '#1f5b5b',
        },
        secondary: {
            100: '#897d8c',
            200: '#7f7382',
            300: '#746977',
            400: '#6a606c',
            500: '#564E58',
            600: '#554d56',
            700: '#4a434c',
            800: '#3f3a41',
            900: '#353036',
        },
    },
    semanticTokens: {
        colors: {
            background: {
                default: '#CDA2A7',
                _dark: '#6A393E',
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
