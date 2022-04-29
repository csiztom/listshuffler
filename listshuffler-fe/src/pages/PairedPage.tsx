import { Spinner, Stack, Text, useBoolean } from '@chakra-ui/react'
import { ReactElement, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ListItemButtonInput } from '../components'
import Card from '../components/Card'
import useInstance from '../hooks/useInstance'
import usePairs from '../hooks/usePairs'

const PairedPage = (): ReactElement => {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useBoolean(false)
    const { instance, allListItems } = useInstance(id ?? '', setIsLoading)
    const [pairs] = usePairs(id, instance?.shuffled, setIsLoading)

    const generatedPairs = useMemo(
        () =>
            Object.keys(pairs).map(
                (it) =>
                    allListItems && (
                        <Stack
                            direction="column"
                            gap={4}
                            spacing={0}
                            align="center"
                            wrap="wrap"
                            justifyContent="center"
                            key={it}
                        >
                            {allListItems[it] && (
                                <>
                                    <ListItemButtonInput
                                        id={it}
                                        name={allListItems[it].listItem}
                                    />
                                    <Stack
                                        direction="row"
                                        gap={4}
                                        spacing={0}
                                        align="center"
                                        wrap="wrap"
                                        justifyContent="center"
                                    >
                                        {pairs[it].map((that) => (
                                            <ListItemButtonInput
                                                id={that}
                                                key={that}
                                                name={
                                                    allListItems[that].listItem
                                                }
                                            />
                                        ))}
                                    </Stack>
                                </>
                            )}
                        </Stack>
                    ),
            ),
        [pairs, allListItems],
    )

    return (
        <>
            {(isLoading || Object.keys(pairs).length === 0) && (
                <Card>
                    <Stack direction="column" align="center">
                        <Text>Please wait</Text>
                        <Spinner color="primary.500" />
                    </Stack>
                </Card>
            )}
            {!isLoading && generatedPairs.length > 0 && (
                <Card>
                    <Stack
                        direction="column"
                        gap={8}
                        spacing={0}
                        align="center"
                        wrap="wrap"
                        justifyContent="center"
                    >
                        {generatedPairs}
                    </Stack>
                </Card>
            )}
        </>
    )
}

export default PairedPage
