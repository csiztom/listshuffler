import { AddIcon, CopyIcon, DeleteIcon } from '@chakra-ui/icons'
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
    useToast,
    useDisclosure,
} from '@chakra-ui/react'
import { ReactElement, useMemo } from 'react'
import { useIntl } from 'react-intl'
import useListEditor from '../hooks/useListEditor'
import { AbstractList } from '../types/main'
import Card from './Card'
import DeleteModal from './DeleteModal'
import ListItemButtonInput from './ListItemButtonInput'

interface ListCardProps extends Pick<ButtonProps, 'isLoading'> {
    lists: AbstractList[]
    setLists: (list: AbstractList[]) => void
    listId: string
    editing?: boolean
    shuffled?: boolean
}

const ListCard = ({
    lists,
    setLists,
    listId,
    editing = false,
    isLoading: parentIsLoading,
    shuffled = false,
    ...props
}: ListCardProps): ReactElement => {
    const { editList, deleteList, addListItem, editListItem, deleteListItem } =
        useListEditor(lists, setLists)
    const toast = useToast()
    const list = useMemo(
        () => lists.find((li) => li.listID === listId),
        [lists, listId],
    )
    const { isOpen, onClose, onOpen } = useDisclosure()
    const intl = useIntl()
    const onClickCopy = () => {
        var data = [
            new ClipboardItem({
                'text/plain': new Blob([listId], { type: 'text/plain' }),
            }),
        ]
        navigator.clipboard.write(data).then(() =>
            toast({
                title: intl.formatMessage({
                    id: 'code-copied',
                    defaultMessage: 'Code copied to clipboard',
                }),
                description: intl.formatMessage({
                    id: 'you-can-share',
                    defaultMessage:
                        'You can now share this with the to-be list pairs',
                }),
                status: 'success',
                duration: 9000,
                isClosable: true,
            }),
        )
    }
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
                        <Tooltip
                            hasArrow
                            label={intl.formatMessage({
                                id: 'delete-list-item',
                                defaultMessage: 'Delete list item',
                            })}
                        >
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
        [list, editing, parentIsLoading, deleteListItem, editListItem, intl],
    )
    return (
        <Card {...props}>
            {list?.listName !== undefined && editing ? (
                <Tooltip
                    hasArrow
                    label={intl.formatMessage({
                        id: 'edit-list-name',
                        defaultMessage: 'Edit list name',
                    })}
                >
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
            {list && (
                <DeleteModal
                    isOpen={isOpen}
                    onClose={onClose}
                    onSecondaryClick={onClose}
                    onPrimaryClick={() => {
                        onClose()
                        deleteList(list)
                    }}
                    header={intl.formatMessage({
                        id: 'delete-list',
                        defaultMessage: 'Delete list',
                    })}
                    text={intl.formatMessage({
                        id: 'do-you-delete-list',
                        defaultMessage:
                            'Do you really want to delete this list?',
                    })}
                />
            )}
            {generatedItems && (
                <Stack
                    direction="row"
                    gap={4}
                    spacing={0}
                    align="center"
                    wrap="wrap"
                    justifyContent="center"
                >
                    {generatedItems}
                    {!editing && !shuffled && (
                        <Tooltip
                            hasArrow
                            label={intl.formatMessage({
                                id: 'copy-list-code',
                                defaultMessage: 'Copy list invite code',
                            })}
                        >
                            <Button
                                colorScheme="primary"
                                borderRadius="button"
                                onClick={onClickCopy}
                                p={2}
                                {...props}
                            >
                                <CopyIcon mr={2} />
                                {intl.formatMessage({
                                    id: 'copy-invite-code',
                                    defaultMessage: 'Copy invite code',
                                })}
                            </Button>
                        </Tooltip>
                    )}
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
                    {
                        <Tooltip
                            hasArrow
                            label={intl.formatMessage({
                                id: 'delete-list',
                                defaultMessage: 'Delete list',
                            })}
                        >
                            <Button
                                colorScheme="red"
                                borderRadius="button"
                                p={2}
                                onClick={onOpen}
                                isLoading={parentIsLoading}
                            >
                                <DeleteIcon mr={2} />
                                {intl.formatMessage({
                                    id: 'delete-list',
                                    defaultMessage: 'Delete list',
                                })}
                            </Button>
                        </Tooltip>
                    }
                    {addListItem && (
                        <Tooltip
                            hasArrow
                            label={intl.formatMessage({
                                id: 'add-list-item',
                                defaultMessage: 'Add list item',
                            })}
                        >
                            <Button
                                colorScheme="primary"
                                borderRadius="button"
                                p={2}
                                onClick={() => addListItem(list)}
                                isLoading={parentIsLoading}
                            >
                                <AddIcon mr={2} />
                                {intl.formatMessage({
                                    id: 'add-item',
                                    defaultMessage: 'Add item',
                                })}
                            </Button>
                        </Tooltip>
                    )}
                    {
                        <Tooltip
                            hasArrow
                            label={intl.formatMessage({
                                id: 'change-multiplicity',
                                defaultMessage: 'Change multiplicity',
                            })}
                        >
                            <NumberInput
                                isRequired
                                step={1}
                                defaultValue={list.multiplicity}
                                min={1}
                                max={5}
                                maxW={24}
                                onChange={(str, num) =>
                                    str !== ''
                                        ? editList({
                                              ...list,
                                              multiplicity: num,
                                          })
                                        : editList({
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
