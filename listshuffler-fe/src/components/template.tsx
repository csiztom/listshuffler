import {
    Button as MUIButton,
    ButtonProps as MUIButtonProps,
} from '@mui/material'
import { ReactElement, FC } from 'react'
import { styled } from '@mui/material/styles'

interface ButtonProps extends MUIButtonProps {
    title: string
}

const PlainButton = ({ title }: ButtonProps): ReactElement => {
    return <MUIButton>{title}</MUIButton>
}

const Button = styled(PlainButton)`
    background-color: ${(props) => props.theme.palette.primary.light};
    &:hover {
        background-color: ${(props) => props.theme.palette.primary.dark};
    }
`

export default Button
