import theme from './styles/theme'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { Start, InstancePage } from './pages'
import { Routes, Route } from 'react-router-dom'
import '@fontsource/catamaran/200.css'

const App = () => {
    return (
        <>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <ChakraProvider theme={theme}>
                <Routes>
                    <Route index element={<Start />} />
                    <Route path="instance:id" element={<InstancePage/>}/>
                    <Route path="list:id" element={<></>} />
                    <Route path="*" element={<></>}></Route>
                </Routes>
            </ChakraProvider>
        </>
    )
}

export default App
