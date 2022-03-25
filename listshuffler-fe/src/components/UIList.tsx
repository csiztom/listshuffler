import { AddIcon, EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { Box, Button, Stack, ButtonProps, Text, Input } from '@chakra-ui/react'
import { ReactElement, useMemo, useState } from 'react'
import { AbstractListItem } from '../types/main'
import UIListItem from './UIListItem'

interface UIListProps extends Pick<ButtonProps, 'isLoading'> {
    items: Array<AbstractListItem>
    asyncClickAdd?: () => Promise<AbstractListItem | void>
    editable?: boolean
    name: string
    handleChange?: (
        editedItems: Array<AbstractListItem>,
        editedName: string,
    ) => Promise<void>
}

const UIList = ({
    items,
    asyncClickAdd,
    editable = true,
    isLoading: parentIsLoading,
    name,
    handleChange,
    ...props
}: UIListProps): ReactElement => {
    const [editing, setEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [editedList, setEditedList] = useState(items)
    const [editedName, setEditedName] = useState(name)
    const onAdd = () => {
        if (asyncClickAdd) {
            setIsLoading(true)
            asyncClickAdd()
                .then(
                    (response) =>
                        editedList &&
                        response &&
                        setEditedList((editedList) => [
                            ...editedList,
                            response,
                        ]),
                )
                .then(() => setIsLoading(false))
        }
    }
    const editList = () => {
        console.log(editedList)
        if (editing && handleChange && editedList && editedName) {
            setIsLoading(true)
            handleChange(editedList, editedName).then(() => setIsLoading(false))
        }
        setEditing(!editing)
    }
    const generatedItems = useMemo(
        () =>
            items.map((it) => (
                <UIListItem
                    key={it.listItemID}
                    id={it.listItemID}
                    name={it.listItem}
                    editing={editing}
                    onChange={(e) =>
                        setEditedList(
                            (editedList) =>
                                editedList &&
                                editedList.map((item) =>
                                    item.listItemID === it.listItemID
                                        ? {
                                              listItem: e.target.value,
                                              listItemID: item.listItemID,
                                          }
                                        : item,
                                ),
                        )
                    }
                />
            )),
        [items, editing],
    )
    return (
        <Box
            sx={{
                textAlign: 'center',
                backdropFilter: 'blur(16px) saturate(180%)',
                bgColor: 'card',
                borderRadius: 'card',
                m: '2',
                p: '6',
            }}
            {...props}
        >
            {name && editing ? (
                <Input
                    colorScheme="secondary"
                    borderRadius="button"
                    mt={-5}
                    mb={5}
                    w="fit-content"
                    defaultValue={name}
                    htmlSize={name.length}
                    backdropFilter="blur(16px) saturate(180%)"
                    bgColor="card"
                    onChange={(e) => setEditedName(e.target.value)}
                />
            ) : (
                <Text mt={-5} color="text" fontSize="xsmall">
                    {name}
                </Text>
            )}
            <Stack
                direction="row"
                gap={4}
                spacing={0}
                align="center"
                wrap="wrap"
                justifyContent="center"
            >
                {editing && (
                    <Button
                        colorScheme="red"
                        borderRadius="button"
                        p={2}
                        onClick={() => setEditing((editing) => !editing)}
                        isLoading={parentIsLoading || isLoading}
                    >
                        <CloseIcon />
                    </Button>
                )}
                {generatedItems}
                {editing && (
                    <Button
                        colorScheme="primary"
                        borderRadius="button"
                        p={2}
                        onClick={onAdd}
                        isLoading={parentIsLoading || isLoading}
                    >
                        {isLoading || <AddIcon />}
                    </Button>
                )}
                <Button
                    colorScheme="primary"
                    borderRadius="button"
                    p={2}
                    onClick={() => (editable ? editList() : onAdd())}
                    isLoading={parentIsLoading || isLoading}
                >
                    {isLoading || editable ? (
                        editing ? (
                            <CheckIcon />
                        ) : (
                            <EditIcon />
                        )
                    ) : (
                        <AddIcon />
                    )}
                </Button>
            </Stack>
        </Box>
    )
}

export default UIList
