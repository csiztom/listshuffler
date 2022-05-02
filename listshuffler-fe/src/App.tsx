import theme from './styles/theme'
import {
    ChakraProvider,
    ColorModeScript,
    Select,
    Stack,
} from '@chakra-ui/react'
import { StartPage, InstancePage } from './pages'
import { Routes, Route, useNavigate } from 'react-router-dom'
import '@fontsource/catamaran/200.css'
import image from './assets/drawing.svg'
import PairedPage from './pages/PairedPage'
import ListItemPage from './pages/ListItemPage'
import { Logo } from './components'
import { ReactElement, useState } from 'react'
import { IntlProvider } from 'react-intl'
import enMessages from './compiled-lang/en.json'
import huMessages from './compiled-lang/hu.json'

const App = () => {
    const navigate = useNavigate()
    const [lang, setLang] = useState<'en' | 'hu'>('en')
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
            <Logo
                size="small"
                maxWidth={20}
                onClick={() => {
                    navigate('/')
                }}
            />
            {children}
        </Stack>
    )

    return (
        <>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <ChakraProvider theme={theme}>
                <IntlProvider
                    locale={lang}
                    messages={lang === 'hu' ? huMessages : enMessages}
                >
                    <Routes>
                        <Route index element={<StartPage />} />
                        <Route path="instance">
                            <Route
                                path=":id"
                                element={background(<InstancePage />)}
                            />
                            <Route
                                path=":id/pairs"
                                element={background(<PairedPage />)}
                            />
                        </Route>
                        <Route path="listitem">
                            <Route
                                path=":id"
                                element={background(<ListItemPage />)}
                            />
                        </Route>
                        <Route path="*" element={<></>}></Route>
                    </Routes>
                    <Select
                        variant="filled"
                        defaultValue={lang}
                        onChange={(e) => setLang(e.target.value as 'en' | 'hu')}
                        pos="absolute"
                        top={3}
                        right={3}
                        width="fit-content"
                    >
                        <option value="en">English</option>
                        <option value="hu">magyar</option>
                    </Select>
                </IntlProvider>
            </ChakraProvider>
        </>
    )
}

export default App
