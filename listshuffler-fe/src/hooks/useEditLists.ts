import { useState, Dispatch, SetStateAction, useCallback } from 'react'
import { AbstractList } from '../types/main'

const useEditLists = (
    setLists: Dispatch<SetStateAction<AbstractList[]>>,
): [
    (id: string, name: string) => void,
    (id: string) => void,
    (id: string) => void,
    (listId: string, id: string, name: string) => void,
    (listId: string, name: string) => void,
    (id: string, m: number) => void,
] => {
    const [index, setIndex] = useState(0)

    const addListItem = useCallback(
        (id: string) => {
            setLists((lists) =>
                lists.map((li) =>
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
        },
        [index, setLists],
    )

    const editList = (id: string, name: string) => {
        setLists((lists) =>
            lists.map((it) =>
                it.listID === id
                    ? {
                          ...it,
                          listName: name,
                      }
                    : it,
            ),
        )
    }
    const editListItem = (listId: string, id: string, name: string) => {
        setLists((lists) =>
            lists.map((li) =>
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
        setLists((lists) => lists.filter((it) => it.listID !== id))
    }
    const deleteListItem = (listId: string, id: string) => {
        setLists((lists) =>
            lists.map((li) =>
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

    const changeMultiplicity = (id: string, m: number) => {
        setLists((editedLists) =>
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

    return [
        editList,
        deleteList,
        addListItem,
        editListItem,
        deleteListItem,
        changeMultiplicity,
    ]
}

export default useEditLists
