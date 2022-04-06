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
import { AbstractListItem } from '../types/main'
import Card from './Card'
import UIListItem from './UIListItem'

interface UIListProps extends Pick<ButtonProps, 'isLoading'> {
    items: Array<AbstractListItem>
    addListItem?: () => void
    editList?: (name: string) => void
    deleteList?: () => void
    editListItem?: (id: string, name: string) => void
    deleteListItem?: (id: string) => void
    changeMultiplicity?: (m: number) => void
    editable?: boolean
    editing?: boolean
    name: string
    multiplicity?: number
}

const UIList = ({
    items,
    addListItem,
    editList,
    deleteList,
    editListItem,
    deleteListItem,
    changeMultiplicity,
    editable = true,
    editing = false,
    isLoading: parentIsLoading,
    name,
    multiplicity = 1,
    ...props
}: UIListProps): ReactElement => {
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
                            editListItem(it.listItemID, e.target.value)
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
                                    deleteListItem(it.listItemID)
                                }
                                isLoading={parentIsLoading}
                            >
                                <DeleteIcon />
                            </Button>
                        </Tooltip>
                    )}
                </ButtonGroup>
            )),
        [items, editing, parentIsLoading, deleteListItem, editListItem],
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
                        htmlSize={name.length + 6}
                        backdropFilter="blur(16px) saturate(180%)"
                        bgColor="card"
                        onChange={(e) => editList && editList(e.target.value)}
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
                                onClick={deleteList}
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
                                onClick={addListItem}
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
                                        ? changeMultiplicity(num)
                                        : changeMultiplicity(0))
                                }
                            >
                                <NumberInputField />
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
