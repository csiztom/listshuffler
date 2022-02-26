import theme from './styles/theme'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import Start from './pages/Start'
import { Routes, Route } from 'react-router-dom'
import '@fontsource/catamaran/200.css'

const App = () => {
    return (
        <>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <ChakraProvider theme={theme}>
                <Routes>
                    <Route index element={<Start />} />
                    <Route path="instances" element={<></>}>
                        <Route path=":instanceid" element={<></>} />
                    </Route>
                </Routes>
            </ChakraProvider>
        </>
    )
}

export default App
