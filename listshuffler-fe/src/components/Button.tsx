import { Button as MUIButton } from '@mui/material'
import { styled } from '@mui/material/styles'

const Button = styled(MUIButton)(
    ({ theme }) => `
    border-radius: 2px;
    padding: 7px 12px;
    .MuiButton-contained {
    }
    .MuiButton-outlined {
        
    }
`,
)

export default Button
