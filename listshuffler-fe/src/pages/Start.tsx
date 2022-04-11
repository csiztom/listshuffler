import { Grid, GridItem, useToast } from '@chakra-ui/react'
import { ReactElement, useState } from 'react'
import { Logo, ActionCard } from '../components'
import image from '../assets/drawing.svg'
import { useNavigate } from 'react-router-dom'

const Start = (): ReactElement => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const createInstance = () => {
        setIsLoading(true)
        fetch(process.env.REACT_APP_API_URL + '/instance', {
            method: 'POST',
        })
            .then((response) => response.ok && response.json())
            .then((resp) => {
                setIsLoading(false)
                resp.adminID && navigate('./instance/' + resp.adminID, { replace: true })
            })
            .catch(() =>
                toast({
                    title: 'Error occurred, please refresh. :/',
                    description:
                        'In order to get the latest saved state refresh the page.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                }),
            )
    }

    const signIn = (str: string) => {
        setIsLoading(true)
        fetch(process.env.REACT_APP_API_URL + '/listitem?listItemID='+ str, {
            method: 'GET',
        })
            .then((response) => response.ok && response.json())
            .then((resp) => {
                setIsLoading(false)
                resp.listItemID && navigate('./listitem/' + resp.listItemID, { replace: true })
            })
            .catch(() =>
                toast({
                    title: 'Error occurred, please refresh. :/',
                    description:
                        'In order to get the latest saved state refresh the page.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                }),
            )
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
                    onButtonClick={createInstance}
                    isLoading={isLoading}
                />
            </GridItem>
            <GridItem rowSpan={1} colSpan={2}>
                <ActionCard
                    title="Join other lists"
                    buttonText="Join list"
                    hasInput
                    inputPlaceholder="Code"
                    isLoading={isLoading}
                    onButtonClick={signIn}
                />
            </GridItem>
        </Grid>
    )
}

export default Start
