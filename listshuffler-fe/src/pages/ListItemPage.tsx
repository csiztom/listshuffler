import { CheckIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
    Button,
    Stack,
    Text,
    Tooltip,
    useBoolean,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'
import { ListItemButtonInput } from '../components'
import Card from '../components/Card'
import DeleteModal from '../components/DeleteModal'
import { AbstractInstance } from '../types/main'

const ListItemPage = (props: {
    onChangePreset: (p: AbstractInstance['preset']) => void
}): ReactElement => {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const { id } = useParams()
    const [pairs, setPairs] = useState<{ [key: string]: string }>({})
    const [name, setName] = useState('')
    const [editing, setEditing] = useBoolean(false)
    const [isLoading, setIsLoading] = useBoolean(false)
    const toast = useToast()
    const navigate = useNavigate()
    const intl = useIntl()

    useEffect(() => {
        if (!id) return
        setIsLoading.on()
        fetch(process.env.REACT_APP_API_URL + '/listitem?listItemID=' + id, {
            method: 'GET',
        })
            .then((response) => {
                if (response.ok) return response.json()
                else throw Error('not 2xx answer')
            })
            .then((response) => {
                setPairs(response['pairs'])
                setName(response['listItem'])
                props.onChangePreset(response['preset'] ?? 'default')
            })
            .catch(() =>
                toast({
                    title: intl.formatMessage({
                        id: 'error-loading-item',
                        defaultMessage: 'Error occurred while loading item. :/',
                    }),
                    description: intl.formatMessage({
                        id: 'try-reloading',
                        defaultMessage: 'Try reloading the page.',
                    }),
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                }),
            )
            .then(setIsLoading.off)
    }, [id, toast, setIsLoading, intl, props])

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
            .then((response) => {
                if (!response.ok) throw Error('not 2xx answer')
            })
            .catch(() =>
                toast({
                    title: intl.formatMessage({
                        id: 'error-saving',
                        defaultMessage: 'Error occurred while saving. :/',
                    }),
                    description: intl.formatMessage({
                        id: 'try-reloading',
                        defaultMessage: 'Try reloading the page.',
                    }),
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                }),
            )
            .then(setIsLoading.off)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editing])

    const deleteItem = () => {
        if (!id) return
        if (!name) return
        if (!editing) return
        setIsLoading.on()
        fetch(process.env.REACT_APP_API_URL + '/listitem', {
            method: 'DELETE',
            body: JSON.stringify({
                listItemID: id,
            }),
        })
            .then((response) => {
                if (!response.ok) throw Error('not 2xx answer')
            })
            .then(() => navigate('/'))
            .catch(() => {
                toast({
                    title: intl.formatMessage({
                        id: 'error-deleting',
                        defaultMessage: 'Error occurred while deleting. :/',
                    }),
                    description: intl.formatMessage({
                        id: 'try-reloading',
                        defaultMessage: 'Try reloading the page.',
                    }),
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
                setIsLoading.off()
            })
    }

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
            <DeleteModal
                isOpen={isOpen}
                onClose={onClose}
                onSecondaryClick={onClose}
                onPrimaryClick={() => {
                    onClose()
                    deleteItem()
                }}
                header={intl.formatMessage({
                    id: 'delete-item',
                    defaultMessage: 'Delete item',
                })}
                text={intl.formatMessage({
                    id: 'do-you-delete-item',
                    defaultMessage:
                        'Do you really want to delete this item? You will be returned to the homepage.',
                })}
            />
            {
                <Card>
                    <Text fontSize="lg">
                        {intl.formatMessage({
                            id: 'bookmark-this-page',
                            defaultMessage:
                                'Bookmark this page if you want to come back later.',
                        })}
                        <br />{' '}
                        {intl.formatMessage({
                            id: 'this-list-item',
                            defaultMessage: 'This is a list item page.',
                        })}
                    </Text>
                </Card>
            }
            <Card>
                <Stack
                    direction="column"
                    gap={4}
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
                    <Stack direction="row" gap={4}>
                        {Object.keys(pairs).length === 0 && editing && (
                            <Tooltip
                                hasArrow
                                label={intl.formatMessage({
                                    id: 'delete',
                                    defaultMessage: 'Delete',
                                })}
                            >
                                <Button
                                    colorScheme="red"
                                    borderRadius="button"
                                    p={2}
                                    isLoading={isLoading}
                                    onClick={onOpen}
                                >
                                    <DeleteIcon mr={2} />
                                    {intl.formatMessage({
                                        id: 'delete',
                                        defaultMessage: 'Delete',
                                    })}
                                </Button>
                            </Tooltip>
                        )}
                        {Object.keys(pairs).length === 0 && !editing && (
                            <Tooltip
                                hasArrow
                                label={intl.formatMessage({
                                    id: 'edit',
                                    defaultMessage: 'Edit',
                                })}
                            >
                                <Button
                                    colorScheme="primary"
                                    borderRadius="button"
                                    p={2}
                                    isLoading={isLoading}
                                    onClick={setEditing.toggle}
                                >
                                    <EditIcon mr={2} />
                                    {intl.formatMessage({
                                        id: 'edit',
                                        defaultMessage: 'Edit',
                                    })}
                                </Button>
                            </Tooltip>
                        )}
                        {Object.keys(pairs).length === 0 && editing && (
                            <Tooltip
                                hasArrow
                                label={intl.formatMessage({
                                    id: 'save',
                                    defaultMessage: 'Save',
                                })}
                            >
                                <Button
                                    colorScheme="primary"
                                    borderRadius="button"
                                    p={2}
                                    isLoading={isLoading}
                                    onClick={setEditing.toggle}
                                >
                                    <CheckIcon mr={2} />
                                    {intl.formatMessage({
                                        id: 'save',
                                        defaultMessage: 'Save',
                                    })}
                                </Button>
                            </Tooltip>
                        )}
                    </Stack>
                </Stack>
            </Card>
        </>
    )
}

export default ListItemPage
