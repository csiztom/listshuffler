import { CheckIcon, EditIcon } from '@chakra-ui/icons'
import { Button, Stack, Tooltip, useBoolean, useToast } from '@chakra-ui/react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ListItemButtonInput } from '../components'
import Card from '../components/Card'

const ListItemPage = (): ReactElement => {
    const { id } = useParams()
    const [pairs, setPairs] = useState<{ [key: string]: string }>({})
    const [name, setName] = useState('')
    const [editing, setEditing] = useBoolean(false)
    const [isLoading, setIsLoading] = useBoolean(false)
    const toast = useToast()

    useEffect(() => {
        if (!id) return
        setIsLoading.on()
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
            .then(setIsLoading.off)
    }, [id, toast, setIsLoading])

    useEffect(() => {
        if (!id) return
        if (!name) return
        if (editing) return
        setIsLoading.on()
        fetch(process.env.REACT_APP_API_URL + '/listitem', {
            method: 'PATCH',
            body: JSON.stringify({
                listItemID: id,
                listItem: name,
            }),
        })
            .catch(() =>
                toast({
                    title: 'Error occurred while saving name, please refresh. :/',
                    description:
                        'In order to get the latest saved state refresh the page.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                }),
            )
            .then(setIsLoading.off)
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editing])

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
                            <ListItemButtonInput
                                id={it}
                                name={pairs[it]}
                                disabled
                            />
                        </>
                    }
                </Stack>
            )),
        [pairs],
    )

    return (
        <>
            <Card>
                <Stack
                    direction="column"
                    gap={8}
                    spacing={0}
                    align="center"
                    wrap="wrap"
                    justifyContent="center"
                >
                    {id && (
                        <ListItemButtonInput
                            id={id}
                            name={name}
                            isLoading={isLoading}
                            editing={editing}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}
                    {generatedPairs}
                    {Object.keys(pairs).length === 0 && (
                        <Tooltip hasArrow label={editing ? 'Save' : 'Edit'}>
                            <Button
                                colorScheme="primary"
                                borderRadius="button"
                                p={2}
                                isLoading={isLoading}
                                onClick={setEditing.toggle}
                            >
                                {editing ? <CheckIcon /> : <EditIcon />}
                            </Button>
                        </Tooltip>
                    )}
                </Stack>
            </Card>
        </>
    )
}

export default ListItemPage
