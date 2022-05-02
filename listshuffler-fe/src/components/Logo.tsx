import { ReactElement } from 'react'
import { Image, ImageProps, useColorMode } from '@chakra-ui/react'
import { logo_light, logo_dark, logo_small } from '../assets'
import { useIntl } from 'react-intl'

interface LogoProps extends ImageProps {
    size?: 'small'
}

const Logo = (props: LogoProps): ReactElement => {
    const { colorMode } = useColorMode()
    const intl = useIntl()
    return (
        <Image
            src={
                props.size === 'small'
                    ? logo_small
                    : colorMode === 'light'
                    ? logo_light
                    : logo_dark
            }
            maxWidth="100%"
            maxHeight="100%"
            marginInline="auto"
            alignContent="center"
            alt={intl.formatMessage({
                id: 'logo-of',
                defaultMessage: 'Logo of Listshuffler',
            })}
            {...props}
        />
    )
}

export default Logo
