import { TextField as MUITextField } from '@mui/material'
import { styled } from '@mui/material/styles'

const TextField = styled(MUITextField)`
    background-color: ${(props) => props.theme.palette.primary.main};
    &:hover {
        background-color: ${(props) => props.theme.palette.primary.dark};
    }
`

export default TextField
