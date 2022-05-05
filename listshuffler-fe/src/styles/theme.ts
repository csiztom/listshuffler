import { extendTheme } from '@chakra-ui/react'
import '@fontsource/catamaran'

const theme = extendTheme({
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
            100: '#8981c5',
            200: '#7c73bf',
            300: '#6f65b8',
            400: '#6257b2',
            500: '#52489C',
            600: '#50479a',
            700: '#49408c',
            800: '#423a7e',
            900: '#3a3370',
        },
    },
    semanticTokens: {
        colors: {
            background: {
                default: '#CEB3AB',
                _dark: '#141414',
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

export default theme
