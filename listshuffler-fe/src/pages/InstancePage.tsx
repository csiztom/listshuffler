import { Stack, Grid, useBoolean, Spinner, Text } from '@chakra-ui/react'
import { ReactElement, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ListCard } from '../components'
import Card from '../components/Card'
import EditorCard from '../components/EditorCard'
import ShuffleCard from '../components/ShuffleCard'
import ProbabilityInput from '../components/ProbabilityInput'
import useInstance from '../hooks/useInstance'
import useProbabilities from '../hooks/useProbabilities'
import usePairs from '../hooks/usePairs'

const InstancePage = (): ReactElement => {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useBoolean(false)
    const [editing, setEditing] = useBoolean(false)
    const {
        instance,
        allListItems,
        addList,
        multiplicitySum,
        revertLists,
        saveLists,
        setInstance,
    } = useInstance(id ?? 'null', setIsLoading, setEditing)
    const { probs, setProbs, saveProbs } = useProbabilities(
        id,
        instance?.shuffledID || undefined,
        allListItems,
        setIsLoading,
    )
    const [openProbs, setOpenProbs] = useBoolean(false)
    const shuffle = usePairs(id, instance?.shuffled, setIsLoading, instance, setInstance)[1]

    const generatedLists = useMemo(
        () =>
            instance?.lists.map((it) => (
                <ListCard
                    key={it.listID}
                    editing={editing}
                    listId={it.listID}
                    lists={instance.lists}
                    isLoading={isLoading}
                    setLists={(lists) =>
                        setInstance({ ...instance, lists: lists })
                    }
                    shuffled={instance.shuffled}
                />
            )),
        [instance, isLoading, editing, setInstance],
    )

    const generatedProbabilities = useMemo(
        () =>
            probs &&
            openProbs &&
            Object.keys(probs).map((p1) =>
                Object.keys(probs[p1]).map((p2) => (
                    <ProbabilityInput
                        listItem1={allListItems[p1]}
                        listItem2={allListItems[p2]}
                        probability={probs[p1][p2]}
                        key={p1 + p2}
                        onChange={(str, num) => {
                            const tmp = probs
                            tmp[p1][p2] = num
                            setProbs(tmp)
                        }}
                    />
                )),
            ),
        [probs, allListItems, setProbs, openProbs],
    )

    return (
        <>
            {!instance && (
                <Card>
                    <Stack direction="column" align="center">
                        <Text>Please wait</Text>
                        <Spinner color="primary.500" />
                    </Stack>
                </Card>
            )}
            {openProbs && generatedProbabilities ? (
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
            {!instance?.shuffled &&
                (instance && (
                    <EditorCard
                        editing={editing}
                        setEditing={setEditing}
                        isLoading={isLoading}
                        instance={instance}
                        setInstance={setInstance}
                        multiplicity={multiplicitySum}
                        cancelEdited={revertLists}
                        addList={addList}
                        saveEdited={saveLists}
                        probabilityEditor={openProbs}
                        setProbabilityEditor={setOpenProbs}
                        saveProbabilities={saveProbs}
                    />
                ))}
            {!openProbs && instance && (
                <ShuffleCard
                    isLoading={isLoading}
                    instance={instance}
                    setInstance={setInstance}
                    disabled={multiplicitySum < 2}
                    shuffle={shuffle}
                />
            )}
        </>
    )
}

export default InstancePage
