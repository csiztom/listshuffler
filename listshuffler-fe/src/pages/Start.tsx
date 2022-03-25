import { Grid, GridItem } from '@chakra-ui/react'
import { ReactElement, useState } from 'react'
import { Logo, ActionCard } from '../components'
import image from '../assets/drawing.svg'
import { useNavigate } from 'react-router-dom'

const Start = (): ReactElement => {
    const navigate = useNavigate()
    const [createIsLoading, setCreateIsLoading] = useState(false)
    const createList = async () => {
        setCreateIsLoading(true)
        fetch(process.env.REACT_APP_API_URL + '/instance', {
            method: 'POST',
        })
            .then((response) => response.ok && response.json())
            .then((resp) => {
                setCreateIsLoading(false)
                resp.adminID && navigate('./instance' + resp.adminID, { replace: true })
            })
            .catch(() => {
                console.log('error')
                setCreateIsLoading(false)
            })
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
                    isLoading={createIsLoading}
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
