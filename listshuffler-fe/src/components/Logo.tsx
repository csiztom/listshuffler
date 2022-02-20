import { useTheme } from '@mui/material'
import { styled } from '@mui/system'
import { ReactElement } from 'react'
import { logo_light, logo_dark, logo_small } from '../assets'

interface LogoProps {
    size?: 'small'
}

const Image = styled('img')`
    height: 10rem;
`

const Logo = (props: LogoProps): ReactElement => {
    const theme = useTheme()
    return (
        <Image
            src={
                props.size === 'small'
                    ? logo_small
                    : theme.palette.mode === 'light'
                    ? logo_light
                    : logo_dark
            }
            alt="Logo of Listshuffler"
        />
    )
}

export default Logo
