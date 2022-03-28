import {
    AddIcon,
    EditIcon,
    CheckIcon,
    CloseIcon,
    DeleteIcon,
} from '@chakra-ui/icons'
import {
    Box,
    Button,
    Stack,
    ButtonProps,
    Text,
    Input,
    ButtonGroup,
} from '@chakra-ui/react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { AbstractListItem } from '../types/main'
import UIListItem from './UIListItem'

interface UIListProps extends Pick<ButtonProps, 'isLoading'> {
    items: Array<AbstractListItem>
    asyncClickAdd?: () => Promise<void>
    asyncClickDeleteList?: () => Promise<void>
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
    asyncClickDeleteList,
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
    useEffect(() => setEditedList(items), [items])
    const onAdd = () => {
        if (asyncClickAdd) {
            setIsLoading(true)
            asyncClickAdd().then(() => setIsLoading(false))
        }
    }
    const onDelete = () => {
        if (asyncClickDeleteList) {
            setIsLoading(true)
            asyncClickDeleteList()
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
            editedList.map((it) => (
                <ButtonGroup isAttached variant="solid" key={it.listItemID}>
                    <UIListItem
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
                        isLoading={parentIsLoading || isLoading}
                    />
                    {editing && (
                        <Button
                            colorScheme="red"
                            borderRadius="button"
                            p={2}
                            onClick={() =>
                                setEditedList((editedList) =>
                                    editedList.filter(
                                        (val) =>
                                            val.listItemID !== it.listItemID,
                                    ),
                                )
                            }
                            isLoading={parentIsLoading || isLoading}
                        >
                            <DeleteIcon />
                        </Button>
                    )}
                </ButtonGroup>
            )),
        [editedList, editing, isLoading, parentIsLoading],
    )
    return (
        <Box
            sx={{
                textAlign: 'center',
                backdropFilter: 'blur(16px) saturate(180%)',
                bgColor: 'card',
                borderRadius: 'card',
                m: '2',
                p: '8',
                pt: '2',
            }}
            {...props}
        >
            {name && editing ? (
                <Input
                    colorScheme="secondary"
                    borderRadius="button"
                    mt={0.5}
                    mb={2}
                    fontSize="xsmall"
                    size="sm"
                    w="fit-content"
                    defaultValue={name}
                    htmlSize={editedName.length}
                    backdropFilter="blur(16px) saturate(180%)"
                    bgColor="card"
                    onChange={(e) => setEditedName(e.target.value)}
                    textAlign='center'
                />
            ) : (
                <Text mt={2} mb={2} color="text" fontSize="small">
                    {editedName}
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
                {editable && (editing || asyncClickDeleteList) && (
                    <Button
                        colorScheme="red"
                        borderRadius="button"
                        p={2}
                        onClick={
                            editing
                                ? () => {
                                      setEditing(false)
                                      setEditedList((items) => items)
                                      setEditedName((name) => name)
                                  }
                                : onDelete
                        }
                        isLoading={parentIsLoading || isLoading}
                    >
                        {editing ? <CloseIcon /> : <DeleteIcon />}
                    </Button>
                )}
                {generatedItems}
                {editable && (
                    <Button
                        colorScheme="primary"
                        borderRadius="button"
                        p={2}
                        onClick={() => editList()}
                        isLoading={parentIsLoading || isLoading}
                    >
                        {isLoading || editing ? <CheckIcon /> : <EditIcon />}
                    </Button>
                )}
                {(!editing || !editable) && asyncClickAdd && (
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
            </Stack>
        </Box>
    )
}

export default UIList
