import React from 'react'
import { darkTheme, lightTheme } from './styles/theme'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { Outlet } from 'react-router-dom'

const App = () => {
    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Outlet/>
            </ThemeProvider>
        </>
    )
}

export default App
