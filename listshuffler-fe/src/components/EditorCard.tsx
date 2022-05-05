import {
    AddIcon,
    CheckIcon,
    ChevronDownIcon,
    CloseIcon,
    EditIcon,
    StarIcon,
} from '@chakra-ui/icons'
import {
    Button,
    Stack,
    ButtonProps,
    Tooltip,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text,
    Select,
    Portal,
} from '@chakra-ui/react'
import { ReactElement } from 'react'
import { useIntl } from 'react-intl'
import { AbstractInstance } from '../types/main'
import Card from './Card'

interface EditorCardProps extends Pick<ButtonProps, 'isLoading'> {
    instance: AbstractInstance
    setInstance: (instance: AbstractInstance) => void
    editing: boolean
    setEditing: { on: () => void; off: () => void }
    isLoading?: boolean
    multiplicity?: number
    cancelEdited?: () => void
    addList?: () => void
    saveEdited?: () => void
    probabilityEditor?: boolean
    setProbabilityEditor?: { on: () => void; off: () => void }
    saveProbabilities?: () => void
}

const EditorCard = ({
    instance,
    setInstance,
    editing,
    setEditing,
    isLoading,
    multiplicity = 0,
    cancelEdited,
    addList,
    saveEdited,
    probabilityEditor,
    setProbabilityEditor,
    saveProbabilities,
}: EditorCardProps): ReactElement => {
    const intl = useIntl()
    return (
        <Card>
            <Stack
                direction="row"
                gap={2}
                spacing={0}
                align="center"
                wrap="wrap"
                justifyContent="center"
            >
                {editing ? (
                    <>
                        {editing && (
                            <Tooltip
                                hasArrow
                                label={intl.formatMessage({
                                    id: 'cancel',
                                    defaultMessage: 'Cancel',
                                })}
                            >
                                <Button
                                    colorScheme="red"
                                    borderRadius="button"
                                    p={2}
                                    isLoading={isLoading}
                                    onClick={cancelEdited}
                                >
                                    <CloseIcon mr={2} />
                                    {intl.formatMessage({
                                        id: 'cancel',
                                        defaultMessage: 'Cancel',
                                    })}
                                </Button>
                            </Tooltip>
                        )}
                        {instance.preset !== 'christmas' && (
                            <Tooltip
                                hasArrow
                                label={intl.formatMessage({
                                    id: 'add-list',
                                    defaultMessage: 'Add list',
                                })}
                            >
                                <Button
                                    colorScheme="primary"
                                    borderRadius="button"
                                    p={2}
                                    onClick={addList}
                                    isLoading={isLoading}
                                >
                                    <AddIcon mr={2} />
                                    {intl.formatMessage({
                                        id: 'add-list',
                                        defaultMessage: 'Add list',
                                    })}
                                </Button>
                            </Tooltip>
                        )}
                        <Tooltip
                            hasArrow
                            label={intl.formatMessage({
                                id: 'save',
                                defaultMessage: 'Save',
                            })}
                        >
                            <Button
                                colorScheme="primary"
                                borderRadius="button"
                                p={2}
                                isLoading={isLoading}
                                onClick={saveEdited}
                            >
                                <CheckIcon mr={2} />
                                {intl.formatMessage({
                                    id: 'save',
                                    defaultMessage: 'Save',
                                })}
                            </Button>
                        </Tooltip>
                    </>
                ) : probabilityEditor ? (
                    <Tooltip
                        hasArrow
                        label={intl.formatMessage({
                            id: 'save-probs',
                            defaultMessage: 'Save probabilities',
                        })}
                    >
                        <Button
                            colorScheme="secondary"
                            borderRadius="button"
                            p={2}
                            isLoading={isLoading}
                            disabled={
                                !instance.shuffledID ||
                                multiplicity < 2 ||
                                isLoading
                            }
                            onClick={() => {
                                saveProbabilities && saveProbabilities()
                                setProbabilityEditor &&
                                    setProbabilityEditor.off()
                            }}
                        >
                            <CheckIcon mr={2} />
                            {intl.formatMessage({
                                id: 'save-probs',
                                defaultMessage: 'Save probabilities',
                            })}
                        </Button>
                    </Tooltip>
                ) : (
                    <>
                        {instance.preset !== 'christmas' && (
                            <Menu>
                                <Tooltip
                                    hasArrow
                                    label={intl.formatMessage({
                                        id: 'which-will-shuffle-for',
                                        defaultMessage:
                                            'Which list do you want to shuffle pairs for?',
                                    })}
                                >
                                    <MenuButton
                                        as={Button}
                                        rightIcon={<ChevronDownIcon />}
                                        isLoading={isLoading}
                                        colorScheme="secondary"
                                        borderRadius="button"
                                        disabled={multiplicity < 2 || isLoading}
                                        p={2}
                                    >
                                        <div>
                                            <Text fontSize="small">
                                                {instance.lists.find(
                                                    (li) =>
                                                        li.listID ===
                                                        instance.shuffledID,
                                                )?.listName ??
                                                    intl.formatMessage({
                                                        id: 'select-list',
                                                        defaultMessage:
                                                            'Select list',
                                                    })}
                                            </Text>
                                            <Text fontSize="x-small">
                                                {intl.formatMessage({
                                                    id: 'which-will-shuffle-for',
                                                    defaultMessage:
                                                        'Which list do you want to shuffle pairs for?',
                                                })}
                                            </Text>
                                        </div>
                                    </MenuButton>
                                </Tooltip>
                                <Portal>
                                    <MenuList borderRadius="button">
                                        {instance.lists &&
                                            instance.lists.map((li) => (
                                                <MenuItem
                                                    key={li.listID}
                                                    command={li.listID}
                                                    onClick={() =>
                                                        setInstance({
                                                            ...instance,
                                                            shuffledID:
                                                                li.listID,
                                                        })
                                                    }
                                                >
                                                    {li.listName}
                                                </MenuItem>
                                            ))}
                                    </MenuList>
                                </Portal>
                            </Menu>
                        )}
                        <Tooltip
                            hasArrow
                            label={intl.formatMessage({
                                id: 'edit-lists',
                                defaultMessage: 'Edit lists',
                            })}
                        >
                            <Button
                                colorScheme="primary"
                                borderRadius="button"
                                p={2}
                                isLoading={isLoading}
                                onClick={setEditing.on}
                            >
                                <EditIcon mr={2} />
                                {intl.formatMessage({
                                    id: 'edit-lists',
                                    defaultMessage: 'Edit lists',
                                })}
                            </Button>
                        </Tooltip>
                        {instance.preset !== 'christmas' && (
                            <Tooltip
                                hasArrow
                                label={intl.formatMessage({
                                    id: 'unique-pairs',
                                    defaultMessage:
                                        'Unique pairs per list multiplicity',
                                })}
                            >
                                <Select
                                    value={
                                        instance.uniqueInMul
                                            ? 'unique'
                                            : 'repetitive'
                                    }
                                    borderColor="primary.500"
                                    borderWidth={2}
                                    borderRadius="button"
                                    disabled={isLoading}
                                    variant="outline"
                                    width="fit-content"
                                    onChange={(e) =>
                                        setInstance({
                                            ...instance,
                                            uniqueInMul:
                                                e.target.value === 'unique',
                                        })
                                    }
                                >
                                    <option value="unique">
                                        {intl.formatMessage({
                                            id: 'unique',
                                            defaultMessage: 'Unique',
                                        })}
                                    </option>
                                    <option value="repetitive">
                                        {intl.formatMessage({
                                            id: 'repetitive',
                                            defaultMessage: 'Repetitive',
                                        })}
                                    </option>
                                </Select>
                            </Tooltip>
                        )}
                        <Tooltip
                            hasArrow
                            label={intl.formatMessage({
                                id: 'edit-probs',
                                defaultMessage: 'Edit probabilities',
                            })}
                        >
                            <Button
                                colorScheme="secondary"
                                borderRadius="button"
                                p={2}
                                isLoading={isLoading}
                                disabled={
                                    !instance.shuffledID ||
                                    multiplicity < 2 ||
                                    isLoading
                                }
                                onClick={setProbabilityEditor?.on}
                            >
                                <StarIcon mr={2} />
                                {intl.formatMessage({
                                    id: 'edit-probs',
                                    defaultMessage: 'Edit probabilities',
                                })}
                            </Button>
                        </Tooltip>
                    </>
                )}
            </Stack>
        </Card>
    )
}

export default EditorCard
