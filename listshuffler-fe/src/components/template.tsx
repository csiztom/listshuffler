import { Box, BoxProps } from '@chakra-ui/react'
import { ReactElement, FC } from 'react'

interface ButtonProps extends BoxProps {
    title: string
}

const MyBox = ({ title }: ButtonProps): ReactElement => {
    return <Box>{title}</Box>
}

export default MyBox
