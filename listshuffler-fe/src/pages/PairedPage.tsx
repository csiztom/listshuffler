import { Stack, useBoolean } from '@chakra-ui/react'
import { ReactElement, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import image from '../assets/drawing.svg'
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
                                                name={allListItems[that].listItem}
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
            {!isLoading && (
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
        </Stack>
    )
}

export default PairedPage
