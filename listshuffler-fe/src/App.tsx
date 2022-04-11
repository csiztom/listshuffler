import theme from './styles/theme'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { Start, InstancePage } from './pages'
import { Routes, Route } from 'react-router-dom'
import '@fontsource/catamaran/200.css'
import PairedPage from './pages/PairedPage'
import ListItemPage from './pages/ListItemPage'

const App = () => {
    return (
        <>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <ChakraProvider theme={theme}>
                <Routes>
                    <Route index element={<Start />} />
                    <Route path='instance'>
                        <Route path=":id" element={<InstancePage/>}/>
                        <Route path=":id/pairs" element={<PairedPage/>}/>
                    </Route>
                    <Route path='listitem'>
                        <Route path=":id" element={<ListItemPage />}/>
                    </Route>
                    <Route path="*" element={<></>}></Route>
                </Routes>
            </ChakraProvider>
        </>
    )
}

export default App
