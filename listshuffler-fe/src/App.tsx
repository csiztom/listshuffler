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
            <ChakraProvider
                theme={preset === 'christmas' ? christmasTheme : theme}
            >
                <IntlProvider
                    locale={lang}
                    messages={lang === 'hu' ? huMessages : enMessages}
                >
                    <Routes>
                        <Route index element={<StartPage preset={preset} />} />
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
                    <Stack
                        direction="column"
                        pos="absolute"
                        top={6}
                        right={6}
                        align="end"
                    >
                        {!window.location.pathname.includes('instance') &&
                            !window.location.pathname.includes('listitem') && (
                                <Select
                                    variant="filled"
                                    value={preset ?? 'default'}
                                    onChange={(e) => {
                                        setPreset(e.target.value as Preset)
                                        localStorage.setItem(
                                            'preset',
                                            e.target.value,
                                        )
                                    }}
                                    width="fit-content"
                                >
                                    <FormattedMessage
                                        id="default"
                                        defaultMessage="Extended"
                                    >
                                        {(message) => (
                                            <option value="default">
                                                {message}
                                            </option>
                                        )}
                                    </FormattedMessage>
                                    <FormattedMessage
                                        id="christmas"
                                        defaultMessage="Secret Santa"
                                    >
                                        {(message) => (
                                            <option value="christmas">
                                                {message}
                                            </option>
                                        )}
                                    </FormattedMessage>
                                </Select>
                            )}
                        <Select
                            variant="filled"
                            defaultValue={lang}
                            onChange={(e) => {
                                setLang(e.target.value as 'en' | 'hu')
                                localStorage.setItem(
                                    'lang',
                                    e.target.value as 'en' | 'hu',
                                )
                            }}
                            width="fit-content"
                        >
                            <option value="en">English</option>
                            <option value="hu">magyar</option>
                        </Select>
                    </Stack>
                </IntlProvider>
            </ChakraProvider>
        </>
    )
}

export default App
