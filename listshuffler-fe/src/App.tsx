import theme from './styles/theme'
import {
    Box,
    ChakraProvider,
    ColorModeScript,
    Select,
    Stack,
} from '@chakra-ui/react'
import { StartPage, InstancePage } from './pages'
import { Routes, Route, useNavigate } from 'react-router-dom'
import '@fontsource/catamaran/200.css'
import christmasTree from './assets/christmas.png'
import pattern from './assets/pattern.png'
import PairedPage from './pages/PairedPage'
import ListItemPage from './pages/ListItemPage'
import { Logo } from './components'
import { ReactElement, useState } from 'react'
import { FormattedMessage, IntlProvider } from 'react-intl'
import enMessages from './compiled-lang/en.json'
import huMessages from './compiled-lang/hu.json'
import { AbstractInstance, Preset } from './types/main'
import christmasTheme from './styles/christmasTheme'

const App = () => {
    const navigate = useNavigate()
    const [lang, setLang] = useState<'en' | 'hu'>(
        (localStorage.getItem('lang') ?? 'en') as 'en' | 'hu',
    )
    const [preset, setPreset] = useState<AbstractInstance['preset']>(
        (localStorage.getItem('preset') ??
            'default') as AbstractInstance['preset'],
    )
    const settingsStack = (
        <Stack
            direction="row"
            justifyContent="flex-end"
            ml='auto'
            padding={3}
            gap={2}
        >
            {!window.location.pathname.includes('instance') &&
                !window.location.pathname.includes('listitem') && (
                    <Select
                        variant="filled"
                        borderWidth={2}
                        borderRadius="button"
                        value={preset ?? 'default'}
                        onChange={(e) => {
                            setPreset(e.target.value as Preset)
                            localStorage.setItem('preset', e.target.value)
                        }}
                        width="fit-content"
                    >
                        <FormattedMessage
                            id="default"
                            defaultMessage="Extended"
                        >
                            {(message) => (
                                <option value="default">{message}</option>
                            )}
                        </FormattedMessage>
                        <FormattedMessage
                            id="christmas"
                            defaultMessage="Secret Santa"
                        >
                            {(message) => (
                                <option value="christmas">{message}</option>
                            )}
                        </FormattedMessage>
                    </Select>
                )}
            <Select
                variant="filled"
                borderWidth={2}
                defaultValue={lang}
                borderRadius="button"
                onChange={(e) => {
                    setLang(e.target.value as 'en' | 'hu')
                    localStorage.setItem('lang', e.target.value as 'en' | 'hu')
                }}
                width="fit-content"
            >
                <option value="en">English</option>
                <option value="hu">magyar</option>
            </Select>
        </Stack>
    )
    const background = (children: ReactElement) => (
        <Stack direction="column" gap={4} p="8" overflow="auto" align="center">
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
            <ChakraProvider
                theme={preset === 'christmas' ? christmasTheme : theme}
            >
                <IntlProvider
                    locale={lang}
                    messages={lang === 'hu' ? huMessages : enMessages}
                >
                    <Box
                        bgImage={
                            preset === 'christmas' ? christmasTree : pattern
                        }
                        bgRepeat="repeat"
                        bgColor="background"
                        w="100%"
                        maxWidth="100%"
                        minHeight="100vh"
                        padding={3}
                    >
                        {settingsStack}
                        <Routes>
                            <Route
                                index
                                element={<StartPage preset={preset} />}
                            />
                            <Route path="instance">
                                <Route
                                    path=":id"
                                    element={background(
                                        <InstancePage
                                            preset={preset}
                                            onChangePreset={(p) => setPreset(p)}
                                        />,
                                    )}
                                />
                                <Route
                                    path=":id/pairs"
                                    element={background(
                                        <PairedPage
                                            onChangePreset={(p) => setPreset(p)}
                                        />,
                                    )}
                                />
                            </Route>
                            <Route path="listitem">
                                <Route
                                    path=":id"
                                    element={background(
                                        <ListItemPage
                                            onChangePreset={(p) => setPreset(p)}
                                        />,
                                    )}
                                />
                            </Route>
                            <Route path="*" element={<></>}></Route>
                        </Routes>
                    </Box>
                </IntlProvider>
            </ChakraProvider>
        </>
    )
}

export default App
