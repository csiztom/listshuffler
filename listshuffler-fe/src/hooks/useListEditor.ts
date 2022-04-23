import { useState, useCallback } from 'react'
import { AbstractList, AbstractListItem } from '../types/main'

const useListEditor = (
    lists: AbstractList[],
    setLists: (lists: AbstractList[]) => void,
): {
    editList: (list: AbstractList) => void
    deleteList: (list: AbstractList) => void
    addListItem: (list: AbstractList) => void
    editListItem: (list: AbstractList, item: AbstractListItem) => void
    deleteListItem: (list: AbstractList, item: AbstractListItem) => void
    editMultiplicity: (list: AbstractList) => void
} => {
    const [index, setIndex] = useState(0)

    const addListItem = useCallback(
        (list: AbstractList) => {
            setLists(
                lists.map((li) =>
                    li.listID === list.listID
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
        [index, setLists, lists],
    )

    const editList = (list: AbstractList) => {
        setLists(
            lists.map((it) =>
                it.listID === list.listID
                    ? {
                          ...it,
                          listName: list.listName,
                      }
                    : it,
            ),
        )
    }
    const editListItem = (list: AbstractList, item: AbstractListItem) => {
        setLists(
            lists.map((li) =>
                li.listID === list.listID
                    ? {
                          ...li,
                          listItems: li.listItems.map((it) =>
                              it.listItemID === item.listItemID
                                  ? {
                                        ...it,
                                        listItem: item.listItem,
                                    }
                                  : it,
                          ),
                      }
                    : li,
            ),
        )
    }
    const deleteList = (list: AbstractList) => {
        setLists(lists.filter((it) => it.listID !== list.listID))
    }
    const deleteListItem = (list: AbstractList, item: AbstractListItem) => {
        setLists(
            lists.map((li) =>
                li.listID === list.listID
                    ? {
                          ...li,
                          listItems: li.listItems.filter(
                              (it) => it.listItemID !== item.listItemID,
                          ),
                      }
                    : li,
            ),
        )
    }

    const editMultiplicity = (list: AbstractList) => {
        setLists(
            lists.map((it) =>
                it.listID === list.listID
                    ? {
                          ...it,
                          multiplicity: list.multiplicity,
                      }
                    : it,
            ),
        )
    }

    return {
        editList,
        deleteList,
        addListItem,
        editListItem,
        deleteListItem,
        editMultiplicity,
    }
}

export default useListEditor
