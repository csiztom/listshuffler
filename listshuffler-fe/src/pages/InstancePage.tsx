import {
    AddIcon,
    EditIcon,
    CheckIcon,
    CloseIcon,
    DeleteIcon,
    StarIcon,
    ChevronDownIcon,
} from '@chakra-ui/icons'
import {
    Stack,
    Button,
    Tooltip,
    Grid,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    ButtonGroup,
} from '@chakra-ui/react'
import { ReactElement, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import image from '../assets/drawing.svg'
import { UIList } from '../components'
import Card from '../components/Card'
import UIProbabilityCounter from '../components/UIProbabilityCounter'
import useLists from '../hooks/useLists'
import useProbabilities from '../hooks/useProbabilities'

const InstancePage = (): ReactElement => {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [
        lists,
        setLists,
        listItems,
        editing,
        setEditing,
        addList,
        multiplicity,
        cancelEdited,
        saveEdited,
        shuffled,
        shuffledId,
        setShuffledId,
    ] = useLists(id, setIsLoading)
    const [probabilities, setProbabilities, saveProbabilities] =
        useProbabilities(id, shuffledId, listItems, setIsLoading)
    const [probabilityEditor, setProbabilityEditor] = useState(false)

    const generatedLists = useMemo(
        () =>
            lists.map((it) => (
                <UIList
                    key={it.listID}
                    items={it.listItems}
                    name={it.listName}
                    editing={editing}
                    multiplicity={it.multiplicity}
                    listId={it.listID}
                    setLists={setLists}
                />
            )),
        [lists, editing, setLists],
    )

    const generatedProbabilities = useMemo(
        () =>
            probabilities &&
            probabilityEditor &&
            Object.keys(probabilities).map((p1) =>
                Object.keys(probabilities[p1]).map((p2) => (
                    <UIProbabilityCounter
                        listItem1={listItems[p1]}
                        listItem2={listItems[p2]}
                        probability={probabilities[p1][p2]}
                        key={p1 + p2}
                        onChange={(str, num) => {
                            const tmp = probabilities
                            tmp[p1][p2] = num
                            setProbabilities(tmp)
                        }}
                    />
                )),
            ),
        [probabilities, listItems, setProbabilities, probabilityEditor],
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
            {probabilityEditor && generatedProbabilities ? (
                <Card>
                    <Grid
                        templateColumns="3fr 1fr"
                        gap={5}
                        justifyItems="center"
                    >
                        {generatedProbabilities}
                    </Grid>
                </Card>
            ) : (
                generatedLists
            )}
            <Card zIndex={2}>
                <Stack
                    direction="row"
                    gap={4}
                    spacing={0}
                    align="center"
                    wrap="wrap"
                    justifyContent="center"
                >
                    {editing || (
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
                                    disabled={multiplicity < 2}
                                    p={2}
                                >
                                    {shuffledId ?? 'Select'}
                                </MenuButton>
                            </Tooltip>
                            <MenuList>
                                {lists.map((li) => (
                                    <MenuItem
                                        key={li.listID}
                                        command={li.listID}
                                        onClick={() => setShuffledId(li.listID)}
                                    >
                                        {li.listName}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    )}
                    {editing && (
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
                    )}
                    {editing && (
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
                    )}
                    {probabilityEditor || (
                        <Tooltip
                            hasArrow
                            label={editing ? 'Save' : 'Edit lists'}
                        >
                            <Button
                                colorScheme="primary"
                                borderRadius="button"
                                p={2}
                                isLoading={isLoading}
                                onClick={
                                    editing
                                        ? saveEdited
                                        : () => setEditing(true)
                                }
                            >
                                {editing ? <CheckIcon /> : <EditIcon />}
                            </Button>
                        </Tooltip>
                    )}
                    {editing || (
                        <Tooltip hasArrow label="Edit probabilities">
                            <Button
                                colorScheme="secondary"
                                borderRadius="button"
                                p={2}
                                isLoading={isLoading}
                                disabled={!shuffledId || multiplicity < 2}
                                onClick={
                                    probabilityEditor
                                        ? () => {
                                              saveProbabilities()
                                              setProbabilityEditor(false)
                                          }
                                        : () => setProbabilityEditor(true)
                                }
                            >
                                {probabilityEditor ? (
                                    <CheckIcon />
                                ) : (
                                    <StarIcon />
                                )}
                            </Button>
                        </Tooltip>
                    )}
                </Stack>
            </Card>
            <Card zIndex={1}>
                <ButtonGroup>
                    <Tooltip hasArrow label="Shuffle lists">
                        <Button
                            colorScheme="primary"
                            borderRadius="button"
                            p={2}
                            isLoading={isLoading}
                            disabled={multiplicity < 2}
                        >
                            Shuffle now
                        </Button>
                    </Tooltip>
                    <Tooltip hasArrow label="Time your shuffle or shuffle now">
                        <Button
                            colorScheme="secondary"
                            borderRadius="button"
                            p={2}
                            isLoading={isLoading}
                            disabled={multiplicity < 2 || shuffled}
                        >
                            Time
                        </Button>
                    </Tooltip>
                </ButtonGroup>
            </Card>
        </Stack>
    )
}

export default InstancePage
