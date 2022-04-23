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
import { ReactElement, useMemo } from 'react'
import useListEditor from '../hooks/useListEditor'
import { AbstractList } from '../types/main'
import Card from './Card'
import ListItemButtonInput from './ListItemButtonInput'

interface ListCardProps extends Pick<ButtonProps, 'isLoading'> {
    lists: AbstractList[]
    setLists: (list: AbstractList[]) => void
    listId: string
    editing?: boolean
}

const ListCard = ({
    lists,
    setLists,
    listId,
    editing = false,
    isLoading: parentIsLoading,
    ...props
}: ListCardProps): ReactElement => {
    const {
        editList,
        deleteList,
        addListItem,
        editListItem,
        deleteListItem,
        editMultiplicity,
    } = useListEditor(lists, setLists)
    const list = useMemo(
        () => lists.find((li) => li.listID === listId),
        [lists, listId],
    )
    const generatedItems = useMemo(
        () =>
            list?.listItems.map((it) => (
                <ButtonGroup isAttached variant="solid" key={it.listItemID}>
                    <ListItemButtonInput
                        id={it.listItemID}
                        name={it.listItem}
                        editing={editing}
                        onChange={(e) =>
                            editListItem(list, {
                                ...it,
                                listItem: e.target.value,
                            })
                        }
                        isLoading={parentIsLoading}
                    />
                    {editing && (
                        <Tooltip hasArrow label="Delete list item">
                            <Button
                                colorScheme="red"
                                borderRadius="button"
                                p={2}
                                onClick={() => deleteListItem(list, it)}
                                isLoading={parentIsLoading}
                            >
                                <DeleteIcon />
                            </Button>
                        </Tooltip>
                    )}
                </ButtonGroup>
            )),
        [list, editing, parentIsLoading, deleteListItem, editListItem],
    )
    return (
        <Card {...props}>
            {list?.listName !== undefined && editing ? (
                <Tooltip hasArrow label="Edit list name">
                    <Input
                        colorScheme="secondary"
                        borderRadius="button"
                        mb={4}
                        maxLength={40}
                        fontSize="xsmall"
                        size="sm"
                        w="fit-content"
                        defaultValue={list.listName}
                        htmlSize={list.listName.length}
                        backdropFilter="blur(16px) saturate(180%)"
                        bgColor="card"
                        onChange={(e) =>
                            editList({ ...list, listName: e.target.value })
                        }
                    />
                </Tooltip>
            ) : (
                <Text mt={-4} mb={2} color="text" fontSize="small">
                    {list?.listName}
                </Text>
            )}
            {generatedItems && generatedItems.length > 0 && (
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
            {editing && list && (
                <Stack
                    direction="row"
                    gap={4}
                    spacing={0}
                    align="center"
                    wrap="wrap"
                    mt={generatedItems?.length ? 4 : 0}
                    justifyContent="center"
                >
                    {deleteList && (
                        <Tooltip hasArrow label="Delete list">
                            <Button
                                colorScheme="red"
                                borderRadius="button"
                                p={2}
                                onClick={() => deleteList(list)}
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
                                onClick={() => addListItem(list)}
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
                                defaultValue={list.multiplicity}
                                min={1}
                                max={5}
                                maxW={24}
                                onChange={(str, num) =>
                                    str !== ''
                                        ? editMultiplicity({
                                              ...list,
                                              multiplicity: num,
                                          })
                                        : editMultiplicity({
                                              ...list,
                                              multiplicity: 0,
                                          })
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

export default ListCard
