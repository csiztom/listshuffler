import { useBoolean, useToast } from '@chakra-ui/react'
import { useState, useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { AbstractInstance, AbstractList, AbstractListItem } from '../types/main'

const useInstance = (
    id?: string,
    setLoading?: { on: () => void; off: () => void },
    setEditing?: { on: () => void; off: () => void },
    preset?: AbstractInstance['preset'],
    onChangePreset?: (p: AbstractInstance['preset']) => void,
): {
    instance: AbstractInstance | undefined
    setInstance: (instance: AbstractInstance) => void
    deleteInstance: () => void
    addList: () => void
    revertLists: () => void
    saveLists: () => void
    allListItems: { [key: string]: AbstractListItem }
    multiplicitySum: number
} => {
    const [instance, setInstance] = useState<AbstractInstance>()
    const [editedLists, setEditedLists] = useState<AbstractList[]>([])
    const [updateLists, setUpdateLists] = useBoolean()
    const [updateEditedLists, setUpdateEditedLists] = useBoolean()
    const toast = useToast()
    const navigate = useNavigate()
    const intl = useIntl()

    useEffect(() => {
        if (!id) return
        setLoading && setLoading.on()
        fetch(process.env.REACT_APP_API_URL + '/instance?adminID=' + id, {
            method: 'GET',
        })
            .then((response) => {
                if (response.ok) return response.json()
                else throw Error('not 2xx answer')
            })
            .then((response: AbstractInstance) => {
                setInstance(response)
                setEditedLists(response.lists)
                onChangePreset && onChangePreset(response.preset)
            })
            .then(setLoading && setLoading.off)
            .catch(() =>
                toast({
                    title: intl.formatMessage({
                        id: 'error-id-not-found',
                        defaultMessage: 'Error, ID not found. :/',
                    }),
                    description: intl.formatMessage({
                        id: 'instance-if-ever',
                        defaultMessage:
                            'Instance does not exist now, if it ever had.',
                    }),
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                }),
            )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, updateLists, updateEditedLists])

    useEffect(
        () => instance && setEditedLists(instance.lists),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [updateEditedLists],
    )

    useEffect(() => {
        if (!instance) return
        if (!preset) return
        if (preset === instance.preset) return
        setLoading && setLoading.on()
        fetch(process.env.REACT_APP_API_URL + '/instance', {
            method: 'PATCH',
            body: JSON.stringify({
                adminID: id,
                preset: preset,
            }),
        })
            .then((response) => {
                if (!response.ok) throw Error('not 2xx answer')
            })
            .then(() =>
                setInstance((instance) =>
                    preset === undefined
                        ? instance
                        : instance && { ...instance, preset: preset },
                ),
            )
            .catch(() =>
                toast({
                    title: intl.formatMessage({
                        id: 'error occurred',
                        defaultMessage: 'Error occurred. :/',
                    }),
                    description: intl.formatMessage({
                        id: 'couldnt-save-preset',
                        defaultMessage:
                            'Couldn’t save preset, maybe try reloading the page and trying again.',
                    }),
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                }),
            )
            .then(setLoading && setLoading.off)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preset, id])

    const multiplicitySum = useMemo(
        () =>
            instance
                ? instance.lists.reduce((prev, i) => prev + i.multiplicity, 0)
                : 0,
        [instance],
    )

    const allListItems: { [key: string]: AbstractListItem } = useMemo(
        () =>
            instance
                ? instance?.lists.reduce(
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
                  )
                : [],
        [instance],
    )

    const deleteInstance = () => {
        setLoading && setLoading.on()
        fetch(process.env.REACT_APP_API_URL + '/instance', {
            method: 'DELETE',
            body: JSON.stringify({
                adminID: id,
            }),
        })
            .then((response) => {
                if (!response.ok) throw Error('not 2xx answer')
            })
            .catch(() =>
                toast({
                    title: intl.formatMessage({
                        id: 'error-deleting-instance',
                        defaultMessage:
                            'Error occurred while deleting instance. :/',
                    }),
                    description: intl.formatMessage({
                        id: 'sorry-inconvenience',
                        defaultMessage: 'Sorry for the inconvenience.',
                    }),
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                }),
            )
            .then(setLoading && setLoading.off)
            .then(() => navigate('/'))
    }

    const updateInstance = (editedInstance: AbstractInstance) => {
        if (
            editedInstance.shuffleTime !== instance?.shuffleTime ||
            editedInstance.uniqueInMul !== instance?.uniqueInMul ||
            editedInstance.shuffledID !== instance?.shuffledID
        ) {
            setLoading && setLoading.on()
            fetch(process.env.REACT_APP_API_URL + '/instance', {
                method: 'PATCH',
                body: JSON.stringify({
                    adminID: id,
                    ...(editedInstance.shuffledID !== instance?.shuffledID
                        ? { shuffledID: editedInstance.shuffledID }
                        : {}),
                    ...(editedInstance.shuffleTime !== instance?.shuffleTime
                        ? { shuffleTime: editedInstance.shuffleTime }
                        : {}),
                    ...(editedInstance.uniqueInMul !== instance?.uniqueInMul
                        ? { uniqueInMul: editedInstance.uniqueInMul }
                        : {}),
                }),
            })
                .then((response) => {
                    if (!response.ok) throw Error('not 2xx answer')
                })
                .catch(() =>
                    toast({
                        title: intl.formatMessage({
                            id: 'error-saving-changes',
                            defaultMessage:
                                'Error occurred while saving changes. :/',
                        }),
                        description: intl.formatMessage({
                            id: 'sorry-inconvenience',
                            defaultMessage: 'Sorry for the inconvenience.',
                        }),
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    }),
                )
                .then(setLoading && setLoading.off)
                .then(setUpdateLists.toggle)
            setInstance(
                instance
                    ? {
                          ...instance,
                          ...(editedInstance.shuffledID !== instance?.shuffledID
                              ? { shuffledID: editedInstance.shuffledID }
                              : {}),
                          ...(editedInstance.shuffleTime !==
                          instance?.shuffleTime
                              ? { shuffleTime: editedInstance.shuffleTime }
                              : {}),
                          ...(editedInstance.uniqueInMul !==
                          instance?.uniqueInMul
                              ? { uniqueInMul: editedInstance.uniqueInMul }
                              : {}),
                      }
                    : undefined,
            )
        }
        editedInstance.lists && setEditedLists(editedInstance.lists)
        editedInstance.shuffled &&
            instance &&
            setInstance({ ...instance, shuffled: editedInstance.shuffled })
    }

    const addList = () => {
        setLoading && setLoading.on()
        fetch(process.env.REACT_APP_API_URL + '/list', {
            method: 'POST',
            body: JSON.stringify({
                adminID: id,
                listName: intl.formatMessage({
                    id: 'new-list',
                    defaultMessage: 'New List',
                }),
                multiplicity: '1',
            }),
        })
            .then((response) => {
                if (response.ok) return response.json()
                else throw Error('not 2xx answer')
            })
            .then((response) => {
                setEditedLists((lists) => [
                    ...lists,
                    {
                        listID: response.listID,
                        listName: intl.formatMessage({
                            id: 'new-list',
                            defaultMessage: 'New List',
                        }),
                        listItems: [] as AbstractListItem[],
                        inProgress: true,
                        multiplicity: 1,
                    },
                ])
                setInstance(
                    (instance) =>
                        instance && {
                            ...instance,
                            lists: [
                                ...instance.lists,
                                {
                                    listID: response.listID,
                                    listName: intl.formatMessage({
                                        id: 'new-list',
                                        defaultMessage: 'New List',
                                    }),
                                    listItems: [] as AbstractListItem[],
                                    inProgress: true,
                                    multiplicity: 1,
                                },
                            ],
                        },
                )
            })
            .catch(() =>
                toast({
                    title: intl.formatMessage({
                        id: 'error-adding-list',
                        defaultMessage:
                            'Error occurred while adding new list. :/',
                    }),
                    description: intl.formatMessage({
                        id: 'sorry-inconvenience',
                        defaultMessage: 'Sorry for the inconvenience.',
                    }),
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                }),
            )
            .then(setLoading && setLoading.off)
    }

    const saveList = (list: AbstractList) =>
        fetch(process.env.REACT_APP_API_URL + '/list', {
            method: 'PATCH',
            body: JSON.stringify({
                listID: list.listID,
                listName: list.listName,
                multiplicity: list.multiplicity,
            }),
        }).then((response) => {
            if (!response.ok) throw Error('not 2xx answer')
        })

    const deleteList = (list: AbstractList) =>
        fetch(process.env.REACT_APP_API_URL + '/list', {
            method: 'DELETE',
            body: JSON.stringify({
                listID: list.listID,
            }),
        }).then((response) => {
            if (!response.ok) throw Error('not 2xx answer')
        })

    const addListItem = (list: AbstractList, item: AbstractListItem) =>
        fetch(process.env.REACT_APP_API_URL + '/listitem', {
            method: 'POST',
            body: JSON.stringify({
                listID: list.listID,
                listItem: item.listItem,
            }),
        }).then((response) => {
            if (!response.ok) throw Error('not 2xx answer')
        })

    const saveListItem = (item: AbstractListItem) =>
        fetch(process.env.REACT_APP_API_URL + '/listitem', {
            method: 'PATCH',
            body: JSON.stringify({
                listItem: item.listItem,
                listItemID: item.listItemID,
            }),
        }).then((response) => {
            if (!response.ok) throw Error('not 2xx answer')
        })

    const deleteListItem = (item: AbstractListItem) =>
        fetch(process.env.REACT_APP_API_URL + '/listitem', {
            method: 'DELETE',
            body: JSON.stringify({
                listItemID: item.listItemID,
            }),
        }).then((response) => {
            if (!response.ok) throw Error('not 2xx answer')
        })

    const saveLists = () => {
        setLoading && setLoading.on()
        instance &&
            Promise.all([
                ...editedLists
                    .map((curList) => {
                        const prevList = instance.lists.find(
                            (val) => val.listID === curList.listID,
                        )
                        return [
                            curList.listName === prevList?.listName &&
                            curList.multiplicity === prevList?.multiplicity
                                ? Promise.resolve()
                                : saveList(curList),
                            ...(prevList?.listItems.map((prevItem) => {
                                const curItem = curList.listItems.find(
                                    (val) =>
                                        val.listItemID === prevItem.listItemID,
                                )
                                return curItem
                                    ? curItem.listItem === prevItem.listItem
                                        ? Promise.resolve()
                                        : saveListItem(curItem)
                                    : deleteListItem(prevItem)
                            }) || []),
                            ...(curList.listItems.map((curItem) =>
                                prevList?.listItems.find(
                                    (val) =>
                                        val.listItemID === curItem.listItemID,
                                )
                                    ? Promise.resolve()
                                    : addListItem(curList, curItem),
                            ) || []),
                        ]
                    })
                    .flat(),
                ...instance.lists.map((prevList) =>
                    editedLists.find((val) => val.listID === prevList.listID)
                        ? Promise.resolve()
                        : deleteList(prevList),
                ),
            ])
                .then(() =>
                    toast({
                        title: intl.formatMessage({
                            id: 'lists-saved',
                            defaultMessage: 'Lists successfully saved',
                        }),
                        description: intl.formatMessage({
                            id: 'you-can-shuffle',
                            defaultMessage: 'You can shuffle now!',
                        }),
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    }),
                )
                .catch(() =>
                    toast({
                        title: intl.formatMessage({
                            id: 'error-saving',
                            defaultMessage: 'Error occurred while saving. :/',
                        }),
                        description: intl.formatMessage({
                            id: 'sorry-inconvenience',
                            defaultMessage: 'Sorry for the inconvenience.',
                        }),
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    }),
                )
                .then(setLoading && setLoading.off)
                .then(setUpdateLists.toggle)
                .then(setEditing && setEditing.off)
    }

    const revertLists = () => {
        setLoading && setLoading.on()
        instance &&
            Promise.all([
                ...instance.lists.map((curList) =>
                    curList.inProgress
                        ? deleteList(curList)
                        : Promise.resolve(),
                ),
            ])
                .catch(() =>
                    toast({
                        title: intl.formatMessage({
                            id: 'error-discarding',
                            defaultMessage:
                                'Error occurred while discarding changes. :/',
                        }),
                        description: intl.formatMessage({
                            id: 'sorry-inconvenience',
                            defaultMessage: 'Sorry for the inconvenience.',
                        }),
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    }),
                )
                .then(setUpdateEditedLists.toggle)
                .then(setLoading && setLoading.off)
                .then(setEditing && setEditing.off)
    }

    return {
        instance: instance && { ...instance, lists: editedLists },
        deleteInstance,
        allListItems,
        addList,
        multiplicitySum,
        revertLists,
        saveLists,
        setInstance: updateInstance,
    }
}

export default useInstance
