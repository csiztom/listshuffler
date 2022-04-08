import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import {
    Button,
    Stack,
    ButtonProps,
    Text,
    Input,
    ButtonGroup,
    NumberInput,
    NumberIncrementStepper,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberInputField,
    Tooltip,
} from '@chakra-ui/react'
import { Dispatch, ReactElement, SetStateAction, useMemo } from 'react'
import useEditLists from '../hooks/useEditLists'
import { AbstractList, AbstractListItem } from '../types/main'
import Card from './Card'
import UIListItem from './UIListItem'

interface UIListProps extends Pick<ButtonProps, 'isLoading'> {
    items: Array<AbstractListItem>
    setLists: Dispatch<SetStateAction<AbstractList[]>>
    editable?: boolean
    editing?: boolean
    name: string
    multiplicity?: number
    listId: string
}

const UIList = ({
    items,
    setLists,
    editable = true,
    editing = false,
    isLoading: parentIsLoading,
    name,
    multiplicity = 1,
    listId,
    ...props
}: UIListProps): ReactElement => {
    const [
        editList,
        deleteList,
        addListItem,
        editListItem,
        deleteListItem,
        changeMultiplicity,
    ] = useEditLists(setLists)
    const generatedItems = useMemo(
        () =>
            items.map((it) => (
                <ButtonGroup isAttached variant="solid" key={it.listItemID}>
                    <UIListItem
                        id={it.listItemID}
                        name={it.listItem}
                        editing={editing}
                        onChange={(e) =>
                            editListItem &&
                            editListItem(listId, it.listItemID, e.target.value)
                        }
                        isLoading={parentIsLoading}
                    />
                    {editing && (
                        <Tooltip hasArrow label="Delete list item">
                            <Button
                                colorScheme="red"
                                borderRadius="button"
                                p={2}
                                onClick={() =>
                                    deleteListItem &&
                                    deleteListItem(listId, it.listItemID)
                                }
                                isLoading={parentIsLoading}
                            >
                                <DeleteIcon />
                            </Button>
                        </Tooltip>
                    )}
                </ButtonGroup>
            )),
        [items, listId, editing, parentIsLoading, deleteListItem, editListItem],
    )
    return (
        <Card {...props}>
            {name !== undefined && editing ? (
                <Tooltip hasArrow label="Edit list name">
                    <Input
                        colorScheme="secondary"
                        borderRadius="button"
                        mb={4}
                        maxLength={40}
                        fontSize="xsmall"
                        size="sm"
                        w="fit-content"
                        defaultValue={name}
                        htmlSize={name.length}
                        backdropFilter="blur(16px) saturate(180%)"
                        bgColor="card"
                        onChange={(e) =>
                            editList && editList(listId, e.target.value)
                        }
                    />
                </Tooltip>
            ) : (
                <Text mt={-4} mb={2} color="text" fontSize="small">
                    {name}
                </Text>
            )}
            {generatedItems.length > 0 && (
                <Stack
                    direction="row"
                    gap={4}
                    spacing={0}
                    align="center"
                    wrap="wrap"
                    justifyContent="center"
                >
                    {generatedItems}
                </Stack>
            )}
            {editing && (
                <Stack
                    direction="row"
                    gap={4}
                    spacing={0}
                    align="center"
                    wrap="wrap"
                    mt={generatedItems.length ? 4 : 0}
                    justifyContent="center"
                >
                    {deleteList && (
                        <Tooltip hasArrow label="Delete list">
                            <Button
                                colorScheme="red"
                                borderRadius="button"
                                p={2}
                                onClick={() => deleteList(listId)}
                                isLoading={parentIsLoading}
                            >
                                {<DeleteIcon />}
                            </Button>
                        </Tooltip>
                    )}
                    {addListItem && (
                        <Tooltip hasArrow label="Add list item">
                            <Button
                                colorScheme="primary"
                                borderRadius="button"
                                p={2}
                                onClick={() => addListItem(listId)}
                                isLoading={parentIsLoading}
                            >
                                {<AddIcon />}
                            </Button>
                        </Tooltip>
                    )}
                    {
                        <Tooltip hasArrow label="Change multiplicity">
                            <NumberInput
                                isRequired
                                step={1}
                                defaultValue={multiplicity}
                                min={1}
                                max={5}
                                maxW={24}
                                onChange={(str, num) =>
                                    changeMultiplicity &&
                                    (str !== ''
                                        ? changeMultiplicity(listId, num)
                                        : changeMultiplicity(listId, 0))
                                }
                            >
                                <NumberInputField bgColor="card" />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Tooltip>
                    }
                </Stack>
            )}
        </Card>
    )
}

export default UIList
