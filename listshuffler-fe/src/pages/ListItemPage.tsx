import { Stack, useToast } from '@chakra-ui/react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import image from '../assets/drawing.svg'
import { ListItemButtonInput } from '../components'
import Card from '../components/Card'

const ListItemPage = (): ReactElement => {
    const { id } = useParams()
    const [pairs, setPairs] = useState<{ [key: string]: string }>({})
    const [name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    useEffect(() => {
        if (!id) return
        setIsLoading(true)
        fetch(process.env.REACT_APP_API_URL + '/listitem?listItemID=' + id, {
            method: 'GET',
        })
            .then((response) => response.ok && response.json())
            .then((response) => {
                setPairs(response['pairs'])
                setName(response['listItem'])
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
            .then(() => setIsLoading(false))
    }, [id, toast, setIsLoading])

    const generatedPairs = useMemo(
        () =>
            Object.keys(pairs).map((it) => (
                <Stack
                    direction="row"
                    gap={4}
                    spacing={0}
                    align="center"
                    wrap="wrap"
                    justifyContent="center"
                >
                    {
                        <>
                            <ListItemButtonInput id={it} name={pairs[it]} disabled />
                        </>
                    }
                </Stack>
            )),
        [pairs],
    )

    return (
        <Stack
            direction="column"
            gap={4}
            bgImage={image}
            w="100vw"
            h="100vh"
            p="8"
            overflow="auto"
            align="center"
        >
            <Card>
                <Stack
                    direction="column"
                    gap={8}
                    spacing={0}
                    align="center"
                    wrap="wrap"
                    justifyContent="center"
                >
                    {id && <ListItemButtonInput id={id} name={name} isLoading={isLoading}/>}
                    {generatedPairs}
                </Stack>
            </Card>
        </Stack>
    )
}

export default ListItemPage
