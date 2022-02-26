import { Grid, GridItem, Heading, Button, Input } from '@chakra-ui/react'
import { ReactElement } from 'react'
import { Logo } from '../components'
import ActionCard from '../components/ActionCard'
import image from '../assets/drawing.svg'

interface StartProps {}

const Start = ({}: StartProps): ReactElement => {
    const createList = async () => {
        fetch(
            'https://2tjqqggjwi.execute-api.eu-central-1.amazonaws.com/Prod/hello',
            {
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            },
        ).then((response) => console.log(response))
    }

    return (
        <Grid
            templateColumns={{ base: '', md: 'repeat(4, 1fr)' }}
            templateRows={{ base: '', md: 'auto 1fr 1fr' }}
            gap={4}
            bgImage={image}
            w="100vw"
            h="100vh"
            p="8"
            overflow="auto"
            justifyItems="center"
            alignItems="center"
        >
            <GridItem
                rowSpan={1}
                colStart={{ base: 1, md: 2 }}
                colEnd={{ base: 3, md: 4 }}
                w="100%"
            >
                <Logo />
            </GridItem>
            <GridItem rowSpan={1} colSpan={2}>
                <ActionCard
                    title="Create your own list"
                    buttonText="Create lists"
                    onButtonClick={createList}
                />
            </GridItem>
            <GridItem rowSpan={1} colSpan={2}>
                <ActionCard
                    title="Join other lists"
                    buttonText="Join list"
                    hasInput
                    inputPlaceholder="Code"
                />
            </GridItem>
        </Grid>
    )
}

export default Start