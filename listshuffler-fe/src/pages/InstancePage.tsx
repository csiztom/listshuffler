import {
    AddIcon,
    EditIcon,
    CheckIcon,
    CloseIcon,
    DeleteIcon,
    StarIcon,
} from '@chakra-ui/icons'
import { Stack, Button, Tooltip, useToast, Grid } from '@chakra-ui/react'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import image from '../assets/drawing.svg'
import { UIList } from '../components'
import Card from '../components/Card'
import UIProbabilityCounter from '../components/UIProbabilityCounter'
import { AbstractInstance, AbstractList, AbstractListItem } from '../types/main'

const InstancePage = (): ReactElement => {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [index, setIndex] = useState(0)
    const [editing, setEditing] = useState(false)
    const [probabilityEditor, setProbabilityEditor] = useState(false)
    const [probabilities, setProbabilities] = useState<{
        [key: string]: { [key: string]: number }
    }>()
    const [lists, setLists] = useState<AbstractList[]>([])
    const [editedLists, setEditedLists] = useState<AbstractList[]>([])
    const toast = useToast()
    const [updateLists, setUpdateLists] = useState(false)
    const [updateEditedLists, setUpdateEditedLists] = useState(false)
    useEffect(() => {
        if (updateLists) {
            setLists(editedLists)
            setUpdateLists(false)
        }
    }, [updateLists, editedLists])
    useEffect(() => {
        if (updateEditedLists) {
            setEditedLists(lists)
            setUpdateEditedLists(false)
        }
    }, [updateEditedLists, lists])
    useEffect(() => {
        setIsLoading(true)
        id &&
            fetch(process.env.REACT_APP_API_URL + '/instance?adminID=' + id, {
                method: 'GET',
            })
                .then((response) => response.ok && response.json())
                .then((response: AbstractInstance) => {
                    setLists(response.lists)
                    setEditedLists(response.lists)
                })
                //.catch(() => console.log('error'))
                .then(() => setIsLoading(false))
    }, [id])

    const multiplicity = useMemo(
        () => lists.reduce((prev, i) => prev + i.multiplicity, 0),
        [lists],
    )

    const listItems: { [key: string]: AbstractListItem } = useMemo(
        () =>
            lists.reduce(
                (prev, li) => ({
                    ...prev,
                    ...li.listItems.reduce(
                        (prev2, it) => ({
                            ...prev2,
                            [it.listItemID]: it,
                        }),
                        {},
                    ),
                }),
                {},
            ),
        [lists],
    )

    const addList = () => {
        setIsLoading(true)
        fetch(process.env.REACT_APP_API_URL + '/list', {
            method: 'POST',
            body: JSON.stringify({
                adminID: id,
                listName: 'New List',
                multiplicity: '1',
            }),
        })
            .then((response) => response.ok && response.json())
            .then((response) => {
                setEditedLists((lists) => [
                    ...lists,
                    {
                        listID: response.listID,
                        listName: 'New List',
                        listItems: [] as AbstractListItem[],
                        inProgress: true,
                        multiplicity: 1,
                    },
                ])
                setLists((lists) => [
                    ...lists,
                    {
                        listID: response.listID,
                        listName: 'New List',
                        listItems: [] as AbstractListItem[],
                        inProgress: true,
                        multiplicity: 1,
                    },
                ])
            })
            .then(() => setIsLoading(false))
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

    const cancelEditing = () => {
        setIsLoading(true)
        Promise.all([
            ...lists.map((li) =>
                li.inProgress
                    ? fetch(process.env.REACT_APP_API_URL + '/list', {
                          method: 'DELETE',
                          body: JSON.stringify({
                              listID: li.listID,
                          }),
                      }).then(() =>
                          setLists((lists) =>
                              lists.filter((li) => !li.inProgress),
                          ),
                      )
                    : Promise.resolve(),
            ),
        ])
            .then(() => setUpdateEditedLists(true))
            .then(() => setEditing(false))
            .then(() => setIsLoading(false))
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

    const saveLists = () => {
        setIsLoading(true)
        setEditedLists((editedLists) =>
            editedLists.map((li) => ({
                ...li,
                inProgress: false,
            })),
        )
        Promise.all([
            ...editedLists
                .map((li) => {
                    const prevList = lists.find(
                        (val) => val.listID === li.listID,
                    )
                    return [
                        li.listName === prevList?.listName &&
                        li.multiplicity === prevList?.multiplicity
                            ? Promise.resolve()
                            : fetch(process.env.REACT_APP_API_URL + '/list', {
                                  method: 'PATCH',
                                  body: JSON.stringify({
                                      listID: li.listID,
                                      listName: li.listName,
                                      multiplicity: li.multiplicity,
                                  }),
                              }),
                        ...(prevList?.listItems.map((it) => {
                            const prevItem = li.listItems.find(
                                (val) => val.listItemID === it.listItemID,
                            )
                            return prevItem
                                ? it.listItem === prevItem?.listItem
                                    ? Promise.resolve()
                                    : fetch(
                                          process.env.REACT_APP_API_URL +
                                              '/listitem',
                                          {
                                              method: 'PATCH',
                                              body: JSON.stringify({
                                                  listItem: prevItem.listItem,
                                                  listItemID: it.listItemID,
                                              }),
                                          },
                                      )
                                : fetch(
                                      process.env.REACT_APP_API_URL +
                                          '/listitem',
                                      {
                                          method: 'DELETE',
                                          body: JSON.stringify({
                                              listItemID: it.listItemID,
                                          }),
                                      },
                                  )
                        }) || []),
                        ...(li.listItems.map((it, ind) =>
                            prevList?.listItems.find(
                                (val) => val.listItemID === it.listItemID,
                            )
                                ? Promise.resolve()
                                : fetch(
                                      process.env.REACT_APP_API_URL +
                                          '/listitem',
                                      {
                                          method: 'POST',
                                          body: JSON.stringify({
                                              listID: li.listID,
                                              listItem: it.listItem,
                                          }),
                                      },
                                  )
                                      .then(
                                          (response) =>
                                              response.ok && response.json(),
                                      )
                                      .then((response) =>
                                          setEditedLists((editedLists) =>
                                              editedLists.map((li) =>
                                                  li.listID === id
                                                      ? {
                                                            ...li,
                                                            listItems:
                                                                li.listItems.map(
                                                                    (val, i) =>
                                                                        i === ind
                                                                            ? {
                                                                                  ...val,
                                                                                  listItemID:
                                                                                      response.listID,
                                                                              }
                                                                            : val,
                                                                ),
                                                        }
                                                      : li,
                                              ),
                                          ),
                                      ),
                        ) || []),
                    ]
                })
                .flat(),
            ...lists.map((li) =>
                editedLists.find((val) => val.listID === li.listID)
                    ? Promise.resolve()
                    : fetch(process.env.REACT_APP_API_URL + '/list', {
                          method: 'DELETE',
                          body: JSON.stringify({
                              listID: li.listID,
                          }),
                      }),
            ),
        ])
            .then(() => setIsLoading(false))
            .then(() => setEditing(false))
            .then(() => setUpdateLists(true))
            .then(() =>
                toast({
                    title: 'Lists successfully saved',
                    description: 'You can shuffle now!',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                }),
            )
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

    const addListItem = useCallback((id: string) => {
        setEditedLists((editedLists) =>
            editedLists.map((li) =>
                li.listID === id
                    ? {
                          ...li,
                          listItems: [
                              ...li.listItems,
                              {
                                  listItem: '',
                                  listItemID: 'editing' + index,
                              },
                          ],
                      }
                    : li,
            ),
        )
        setIndex(index + 1)
    }, [index])

    const editList = (id: string, name: string) => {
        setEditedLists((editedLists) =>
            editedLists.map((it) =>
                it.listID === id
                    ? {
                          ...it,
                          listName: name,
                      }
                    : it,
            ),
        )
    }
    const changeMultiplicity = (id: string, m: number) => {
        setEditedLists((editedLists) =>
            editedLists.map((it) =>
                it.listID === id
                    ? {
                          ...it,
                          multiplicity: m,
                      }
                    : it,
            ),
        )
    }
    const editListItem = (listId: string, id: string, name: string) => {
        setEditedLists((editedLists) =>
            editedLists.map((li) =>
                li.listID === listId
                    ? {
                          ...li,
                          listItems: li.listItems.map((it) =>
                              it.listItemID === id
                                  ? {
                                        ...it,
                                        listItem: name,
                                    }
                                  : it,
                          ),
                      }
                    : li,
            ),
        )
    }
    const deleteList = (id: string) => {
        setEditedLists((editedLists) =>
            editedLists.filter((it) => it.listID !== id),
        )
    }
    const deleteListItem = (listId: string, id: string) => {
        setEditedLists((editedLists) =>
            editedLists.map((li) =>
                li.listID === listId
                    ? {
                          ...li,
                          listItems: li.listItems.filter(
                              (it) => it.listItemID !== id,
                          ),
                      }
                    : li,
            ),
        )
    }

    const saveProbabilities = () => {
        setIsLoading(true)
        setProbabilityEditor(false)
        fetch(
            process.env.REACT_APP_API_URL +
                '/probabilities',
            {
                method: 'PATCH',
                body: JSON.stringify({
                    adminID: id,
                    listID: lists[0].listID,
                    probabilities: probabilities,
                }),
            },
        )
            .then(() =>
                toast({
                    title: 'Probabilities successfully saved',
                    description: 'You can shuffle now!',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                }),
            )
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
            .then(() => setProbabilities({}))
    }

    const loadProbabilities = () => {
        setIsLoading(true)
        setProbabilityEditor(true)
        fetch(
            process.env.REACT_APP_API_URL +
                '/probabilities?adminID=' +
                id +
                '&listID=' +
                lists[0].listID,
            {
                method: 'GET',
            },
        )
            .then((response) => response.ok && response.json())
            .then((response) => {
                setProbabilities(response['probabilities'])
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
    }

    const generatedLists = useMemo(
        () =>
            editedLists.map((it) => (
                <UIList
                    key={it.listID}
                    items={it.listItems}
                    name={it.listName}
                    multiplicity={it.multiplicity}
                    addListItem={() => addListItem(it.listID)}
                    editing={editing}
                    editList={(name) => editList(it.listID, name)}
                    editListItem={(id, name) =>
                        editListItem(it.listID, id, name)
                    }
                    deleteList={() => deleteList(it.listID)}
                    deleteListItem={(id) => deleteListItem(it.listID, id)}
                    changeMultiplicity={(m) => changeMultiplicity(it.listID, m)}
                />
            )),
        [editedLists, editing, addListItem],
    )

    const generatedProbabilities = useMemo(
        () =>
            probabilities &&
            Object.keys(probabilities).map((p1) =>
                Object.keys(probabilities[p1]).map((p2) => (
                    <UIProbabilityCounter
                        listItem1={listItems[p1]}
                        listItem2={listItems[p2]}
                        probability={probabilities[p1][p2]}
                        key={p1 + p2}
                        onChange={(str, num) => {
                            const tmp = probabilities
                            tmp[p1][p2] = num
                            setProbabilities(tmp)
                        }}
                    />
                )),
            ),
        [probabilities, listItems],
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
            {probabilityEditor && generatedProbabilities ? (
                <Card>
                    <Grid templateColumns='3fr 1fr' gap={5} justifyItems='center'
                    >
                        {generatedProbabilities}
                    </Grid>
                </Card>
            ) : (
                generatedLists
            )}
            <Card>
                <Stack
                    direction="row"
                    gap={4}
                    spacing={0}
                    align="center"
                    wrap="wrap"
                    justifyContent="center"
                >
                    {editing && (
                        <Tooltip
                            hasArrow
                            label={editing ? 'Cancel' : 'Delete instance'}
                        >
                            <Button
                                colorScheme="red"
                                borderRadius="button"
                                p={2}
                                isLoading={isLoading}
                                onClick={cancelEditing}
                            >
                                {editing ? <CloseIcon /> : <DeleteIcon />}
                            </Button>
                        </Tooltip>
                    )}
                    {editing && (
                        <Tooltip hasArrow label="Add list">
                            <Button
                                colorScheme="primary"
                                borderRadius="button"
                                p={2}
                                onClick={addList}
                                isLoading={isLoading}
                            >
                                {<AddIcon />}
                            </Button>
                        </Tooltip>
                    )}
                    {probabilityEditor || (
                        <Tooltip
                            hasArrow
                            label={editing ? 'Save' : 'Edit lists'}
                        >
                            <Button
                                colorScheme="primary"
                                borderRadius="button"
                                p={2}
                                isLoading={isLoading}
                                onClick={
                                    editing ? saveLists : () => setEditing(true)
                                }
                            >
                                {editing ? <CheckIcon /> : <EditIcon />}
                            </Button>
                        </Tooltip>
                    )}
                    {editing || (
                        <Tooltip hasArrow label="Edit probabilities">
                            <Button
                                colorScheme="secondary"
                                borderRadius="button"
                                p={2}
                                isLoading={isLoading}
                                disabled={multiplicity < 2}
                                onClick={
                                    probabilityEditor
                                        ? saveProbabilities
                                        : loadProbabilities
                                }
                            >
                                {probabilityEditor ? <CheckIcon/> : <StarIcon />}
                            </Button>
                        </Tooltip>
                    )}
                </Stack>
            </Card>
        </Stack>
    )
}

export default InstancePage
