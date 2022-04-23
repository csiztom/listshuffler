import {
    AddIcon,
    CheckIcon,
    ChevronDownIcon,
    CloseIcon,
    DeleteIcon,
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
    Switch,
} from '@chakra-ui/react'
import { ReactElement } from 'react'
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
    return (
        <Card zIndex={2}>
            <Stack
                direction="row"
                gap={4}
                spacing={0}
                align="center"
                wrap="wrap"
                justifyContent="center"
            >
                {editing ? (
                    <>
                        <Tooltip
                            hasArrow
                            label={editing ? 'Cancel' : 'Delete instance'}
                        >
                            <Button
                                colorScheme="red"
                                borderRadius="button"
                                p={2}
                                isLoading={isLoading}
                                onClick={cancelEdited}
                            >
                                {editing ? <CloseIcon /> : <DeleteIcon />}
                            </Button>
                        </Tooltip>
                        <Tooltip hasArrow label="Add list">
                            <Button
                                colorScheme="primary"
                                borderRadius="button"
                                p={2}
                                onClick={addList}
                                isLoading={isLoading}
                            >
                                {<AddIcon />}
                            </Button>
                        </Tooltip>
                        <Tooltip hasArrow label="Save">
                            <Button
                                colorScheme="primary"
                                borderRadius="button"
                                p={2}
                                isLoading={isLoading}
                                onClick={saveEdited}
                            >
                                <CheckIcon />
                            </Button>
                        </Tooltip>
                    </>
                ) : probabilityEditor ? (
                    <Tooltip hasArrow label="Edit probabilities">
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
                            <CheckIcon />
                        </Button>
                    </Tooltip>
                ) : (
                    <>
                        <Menu>
                            <Tooltip
                                hasArrow
                                label="Which list will you shuffle for"
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
                                    {instance.shuffledID ?? 'Select'}
                                </MenuButton>
                            </Tooltip>
                            <MenuList>
                                {instance.lists &&
                                    instance.lists.map((li) => (
                                        <MenuItem
                                            key={li.listID}
                                            command={li.listID}
                                            onClick={() =>
                                                setInstance({
                                                    ...instance,
                                                    shuffledID: li.listID,
                                                })
                                            }
                                        >
                                            {li.listName}
                                        </MenuItem>
                                    ))}
                            </MenuList>
                        </Menu>
                        <Tooltip hasArrow label="Edit lists">
                            <Button
                                colorScheme="primary"
                                borderRadius="button"
                                p={2}
                                isLoading={isLoading}
                                onClick={setEditing.on}
                            >
                                <EditIcon />
                            </Button>
                        </Tooltip>

                        <Switch
                            colorScheme="primary"
                            borderRadius="button"
                            p={2}
                            disabled={isLoading}
                            defaultChecked={instance.uniqueInMul}
                            onChange={(e) =>
                                setInstance({
                                    ...instance,
                                    uniqueInMul: e.target.checked,
                                })
                            }
                        />
                        <Tooltip hasArrow label="Edit probabilities">
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
                                <StarIcon />
                            </Button>
                        </Tooltip>
                    </>
                )}
            </Stack>
        </Card>
    )
}

export default EditorCard
