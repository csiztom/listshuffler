import { useToast } from '@chakra-ui/react'
import { useState, useEffect, Dispatch, SetStateAction, useMemo } from 'react'
import { AbstractInstance, AbstractList, AbstractListItem } from '../types/main'

const useLists = (
    id: string | undefined,
    setLoading: Dispatch<SetStateAction<boolean>>,
): {
    lists: AbstractList[],
    setLists: Dispatch<SetStateAction<AbstractList[]>>,
    listItems: { [key: string]: AbstractListItem },
    editing: boolean,
    setEditing: Dispatch<SetStateAction<boolean>>,
    addList: () => void,
    multiplicity: number,
    cancelEdited: () => void,
    saveEdited: () => void,
    shuffled: boolean,
    shuffledId: string | undefined,
    setShuffledId: (shuffledId: string) => void,
} => {
    const [lists, setLists] = useState<AbstractList[]>([])
    const [shuffled, setShuffled] = useState(false)
    const [shuffledId, setShuffledId] = useState<string>()
    const [editedLists, setEditedLists] = useState<AbstractList[]>(lists)
    const [updateLists, setUpdateLists] = useState(false)
    const [updateEditedLists, setUpdateEditedLists] = useState(false)
    const [editing, setEditing] = useState(false)
    const toast = useToast()

    useEffect(() => {
        if (!id) return
        setLoading(true)
        fetch(process.env.REACT_APP_API_URL + '/instance?adminID=' + id, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((response: AbstractInstance) => {
                setLists(response.lists)
                setEditedLists(response.lists)
                setShuffled(response.shuffled)
                setShuffledId(response.shuffledID)
            })
            .then(() => setLoading(false))
            .catch(() =>
                toast({
                    title: 'Error, ID not found. :/',
                    description: 'Log in with the link provided in your email',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                }),
            )
    }, [id, toast, setLoading, updateLists, updateEditedLists])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => setLists(editedLists), [updateLists])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => setEditedLists(lists), [updateEditedLists])

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

    const updateShuffledId = (shuffledId: string) => {
        setShuffledId(shuffledId)
        setLoading(true)
        fetch(process.env.REACT_APP_API_URL + '/instance', {
            method: 'PATCH',
            body: JSON.stringify({
                adminID: id,
                shuffledID: shuffledId,
            }),
        })
            .then(() => setLoading(false))
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

    const addList = () => {
        setLoading(true)
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
            .then(() => setLoading(false))
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

    const cancelEdited = () => {
        setLoading(true)
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
            .then(() => setLoading(false))
            .then(() => setEditing(false))
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

    const saveEdited = () => {
        setLoading(true)
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
                        ...(li.listItems.map((it) =>
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
                                  ).then(
                                      (response) =>
                                          response.ok && response.json(),
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
            .then(() => setLoading(false))
            .then(() => setUpdateLists(true))
            .then(() => setEditing(false))
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

    return {
        lists: editedLists,
        setLists: setEditedLists,
        listItems: listItems,
        editing: editing,
        setEditing: setEditing,
        addList: addList,
        multiplicity: multiplicity,
        cancelEdited: cancelEdited,
        saveEdited: saveEdited,
        shuffled: shuffled,
        shuffledId: shuffledId,
        setShuffledId: updateShuffledId,
    }
}

export default useLists
