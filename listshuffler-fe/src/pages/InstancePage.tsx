import { Stack, Grid, useBoolean, Spinner, Text } from '@chakra-ui/react'
import { ReactElement, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ListCard } from '../components'
import Card from '../components/Card'
import EditorCard from '../components/EditorCard'
import ShuffleCard from '../components/ShuffleCard'
import ProbabilityInput from '../components/ProbabilityInput'
import useInstance from '../hooks/useInstance'
import useProbabilities from '../hooks/useProbabilities'
import usePairs from '../hooks/usePairs'
import { useIntl } from 'react-intl'
import { AbstractInstance } from '../types/main'

const InstancePage = (props: {
    preset: AbstractInstance['preset']
    onChangePreset: (p: AbstractInstance['preset']) => void
}): ReactElement => {
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
        deleteInstance,
    } = useInstance(
        id ?? 'null',
        setIsLoading,
        setEditing,
        props.preset,
        props.onChangePreset,
    )
    const { probs, setProbs, saveProbs } = useProbabilities(
        id,
        instance?.shuffledID || undefined,
        allListItems,
        setIsLoading,
    )
    const [openProbs, setOpenProbs] = useBoolean(false)
    const shuffle = usePairs(
        id,
        instance?.shuffled,
        setIsLoading,
        instance,
        setInstance,
    )[1]
    const intl = useIntl()

    useEffect(() => {
        window.onbeforeunload = editing || openProbs ? () => '' : null
    }, [editing, openProbs])

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
                    preset={instance.preset}
                />
            )),
        [instance, isLoading, editing, setInstance],
    )

    const generatedProbabilities = useMemo(
        () =>
            probs &&
            openProbs &&
            Object.keys(probs).map(
                (p1) =>
                    (Object.keys(probs[p1]).length > 1 ||
                        props.preset !== 'christmas') && (
                        <Card key={p1 + 'probs'}>
                            <Grid
                                templateColumns="1fr 1fr 1fr"
                                gap={4}
                                justifyItems="center"
                            >
                                {Object.keys(probs[p1]).map(
                                    (p2) =>
                                        (p1 !== p2 ||
                                            props.preset !== 'christmas') && (
                                            <ProbabilityInput
                                                listItem1={allListItems[p1]}
                                                listItem2={allListItems[p2]}
                                                probability={probs[p1][p2]}
                                                key={p1 + p2 + 'probs'}
                                                onChange={(str, num) => {
                                                    const tmp = probs
                                                    tmp[p1][p2] = num
                                                    setProbs(tmp)
                                                }}
                                            />
                                        ),
                                )}
                            </Grid>
                        </Card>
                    ),
            ),
        [probs, allListItems, setProbs, openProbs, props.preset],
    )

    return (
        <>
            {instance && !openProbs && (
                <Card>
                    <Text fontSize="lg">
                        {intl.formatMessage({
                            id: 'bookmark-this-page',
                            defaultMessage:
                                'Bookmark this page if you want to come back later.',
                        })}
                        <br />
                        {intl.formatMessage({
                            id: 'this-admin-page',
                            defaultMessage:
                                'This is the admin page. You can edit lists, probabilities and shuffle here.',
                        })}
                    </Text>
                </Card>
            )}
            {instance && !openProbs && multiplicitySum < 2 && (
                <Card>
                    <Text fontSize="md" color="error">
                        {intl.formatMessage({
                            id: 'you-need-multiplicity',
                            defaultMessage:
                                'You need at least two lists or a list with at least 2 multiplicity to shuffle',
                        })}
                    </Text>
                </Card>
            )}
            {instance && openProbs && (
                <Card>
                    <Text fontSize="lg">
                        {intl.formatMessage({
                            id: 'you-can-set-multipliers',
                            defaultMessage:
                                'You can set multipliers that affect the shuffle process',
                        })}
                        <br />
                        {intl.formatMessage({
                            id: 'item-pair-multiplier',
                            defaultMessage: 'item | pair | multiplier',
                        })}
                        <br />
                        {intl.formatMessage({
                            id: 'zero-cannot',
                            defaultMessage: 'zero = cannot be paired',
                        })}
                        <br />
                        {intl.formatMessage({
                            id: 'more-can-muliplier',
                            defaultMessage:
                                'The higher the number the more likely the pair.',
                        })}
                    </Text>
                </Card>
            )}
            {!instance && (
                <Card>
                    <Stack direction="column" align="center">
                        <Text>
                            {intl.formatMessage({
                                id: 'please-wait',
                                defaultMessage: 'Please wait',
                            })}
                        </Text>
                        <Spinner color="primary.500" />
                    </Stack>
                </Card>
            )}
            {openProbs && generatedProbabilities
                ? generatedProbabilities
                : generatedLists}
            {!instance?.shuffled && instance && (
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
            )}
            {!openProbs && instance && (
                <ShuffleCard
                    isLoading={isLoading}
                    instance={instance}
                    setInstance={setInstance}
                    disabled={
                        multiplicitySum < 2 ||
                        instance.lists.some(
                            (li) => li.listItems.length === 0,
                        ) ||
                        (instance.uniqueInMul &&
                            instance.lists.some(
                                (li) =>
                                    li.listItems.length <
                                    (instance.lists.find(
                                        (li) =>
                                            li.listID === instance.shuffledID,
                                    )?.listItems.length ?? 0),
                            ))
                    }
                    shuffle={shuffle}
                    deleteInstance={deleteInstance}
                />
            )}
        </>
    )
}

export default InstancePage
