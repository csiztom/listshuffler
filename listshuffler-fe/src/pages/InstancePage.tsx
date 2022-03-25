import { Stack } from '@chakra-ui/react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import image from '../assets/drawing.svg'
import { UIList } from '../components'
import { AbstractInstance, AbstractList, AbstractListItem } from '../types/main'

const InstancePage = (): ReactElement => {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [lists, setLists] = useState<AbstractList[]>([])
    useEffect(() => {
        setIsLoading(true)
        fetch(process.env.REACT_APP_API_URL + '/instance?adminID=' + id, {
            method: 'GET',
        })
            .then((response) => response.ok && response.json())
            .then((response: AbstractInstance) => setLists(response.lists))
            .catch(() => console.log('error'))
            .then(() => setIsLoading(false))
    }, [id])

    const addList = () =>
        fetch(
            process.env.REACT_APP_API_URL +
                '/list?adminID=' +
                id +
                '&listName=' +
                'New List',
            {
                method: 'POST',
            },
        )
            .then((response) => response.ok && response.json())
            .catch(() => console.log('error'))
            .then((response) =>
                setLists((lists) => [
                    ...lists,
                    {
                        listID: response.listID,
                        listName: 'New List',
                        listItems: [] as AbstractListItem[],
                    },
                ]),
            )
            .then(() => undefined)

    const editList = (
        list: Array<AbstractListItem>,
        name: string,
        editedList: Array<AbstractListItem>,
        editedName: string,
        id: string,
        ind: number,
    ) =>
        (name === editedName
            ? Promise.resolve()
            : fetch(
                  process.env.REACT_APP_API_URL +
                      '/list?listID=' +
                      id +
                      '&listName=' +
                      editedName,
                  {
                      method: 'PATCH',
                  },
              )
        )
            .catch(() => console.log('error'))
            .then(() =>
                Promise.all(
                    list.map((it, i) =>
                        it.listItemID === editedList[i].listItemID &&
                        it.listItem != editedList[i].listItem
                            ? fetch(
                                  process.env.REACT_APP_API_URL +
                                      '/listitem?listItemID=' +
                                      it.listItemID +
                                      '&listItem=' +
                                      editedList[i].listItem,
                                  {
                                      method: 'PATCH',
                                  },
                              ).catch(() => console.log('error'))
                            : Promise.resolve(),
                    ),
                ).then(() =>
                    setLists((lists) =>
                        lists.map((val, i) =>
                            i === ind
                                ? {
                                      listID: id,
                                      listItems: editedList,
                                      listName: editedName,
                                  }
                                : val,
                        ),
                    ),
                ),
            )

    const addListItem = (listId: string) =>
        fetch(
            process.env.REACT_APP_API_URL +
                '/listitem?listID=' +
                listId +
                '&listItem=' +
                'hello',
            {
                method: 'POST',
            },
        )
            .then((response) => response.ok && response.json())
            .then(function (response) {
                console.log(response.listItemID)
                setLists((lists) =>
                    lists.map((val) =>
                        val.listID === listId
                            ? {
                                  ...val,
                                  listItems: [
                                      ...val.listItems,
                                      {
                                          listItem: 'hello',
                                          listItemID: response.listItemID,
                                      },
                                  ],
                              }
                            : val,
                    ),
                )
                return {
                    listItem: 'hello',
                    listItemID: response.listItemID,
                }
            })
            .catch(() => console.log('error'))

    const generatedLists = useMemo(
        () =>
            lists.map((it, ind) => (
                <UIList
                    key={it.listID}
                    items={it.listItems}
                    name={it.listName}
                    asyncClickAdd={() => addListItem(it.listID)}
                    handleChange={(el, en) =>
                        editList(
                            it.listItems,
                            it.listName,
                            el,
                            en,
                            it.listID,
                            ind,
                        )
                    }
                />
            )),
        [lists],
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
            {generatedLists}
            <UIList
                items={[]}
                asyncClickAdd={addList}
                isLoading={isLoading}
                name="Add list"
                editable={false}
            />
        </Stack>
    )
}

export default InstancePage
