import { Box, Grid } from '@mui/material'
import { ReactElement } from 'react'
import { styled } from '@mui/material/styles'
import { Logo, TextField, Button, Typography } from '../components'

interface StartProps {}

const OuterBox = styled(Box)(
    ({ theme }) => `
    background-color: ${theme.palette.background.default};
`,
)

const Start = ({}: StartProps): ReactElement => {
    return (
        <OuterBox>
            <Grid container direction="column" alignItems="center">
                <Grid item xs>
                    <Logo />
                </Grid>
                <Grid item container direction="row" justifyContent="center">
                    <Grid
                        item
                        container
                        xs
                        direction="column"
                        alignItems="center"
                    >
                        <Grid item xs>
                            <Typography variant="h3">
                                Create lists to shuffle
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <Button size="large" variant="contained">Create lists</Button>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        container
                        xs
                        direction="column"
                        alignItems="center"
                    >
                        <Grid item xs>
                            <Typography variant="h3">
                                Invited to join?
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <TextField
                                id="list-id-join"
                                label="Code"
                                variant="filled"
                            />
                        </Grid>
                        <Grid item xs>
                            <Button>Join list</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </OuterBox>
    )
}

export default Start
