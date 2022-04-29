import theme from './styles/theme'
import { ChakraProvider, ColorModeScript, Stack } from '@chakra-ui/react'
import { StartPage, InstancePage } from './pages'
import { Routes, Route, useNavigate } from 'react-router-dom'
import '@fontsource/catamaran/200.css'
import image from './assets/drawing.svg'
import PairedPage from './pages/PairedPage'
import ListItemPage from './pages/ListItemPage'
import { Logo } from './components'
import { ReactElement } from 'react'

const App = () => {
    const navigate = useNavigate()
    const background = (children: ReactElement) => (
        <Stack
            direction="column"
            gap={4}
            bgImage={image}
            w="100vw"
            h="100vh"
            p="8"
            overflow="auto"
            align="center"
        >
            <Logo size="small" maxWidth={20} onClick={() => navigate('/')}/>
            {children}
        </Stack>
    )

    return (
        <>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <ChakraProvider theme={theme}>
                <Routes>
                    <Route index element={<StartPage />} />
                    <Route path="instance">
                        <Route path=":id" element={background(<InstancePage />)} />
                        <Route path=":id/pairs" element={background(<PairedPage />)} />
                    </Route>
                    <Route path="listitem">
                        <Route path=":id" element={background(<ListItemPage />)} />
                    </Route>
                    <Route path="*" element={<></>}></Route>
                </Routes>
            </ChakraProvider>
        </>
    )
}

export default App
