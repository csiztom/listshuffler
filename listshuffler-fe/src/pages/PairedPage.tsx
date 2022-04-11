import { Stack } from '@chakra-ui/react'
import { ReactElement, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import image from '../assets/drawing.svg'
import { UIListItem } from '../components'
import Card from '../components/Card'
import useLists from '../hooks/useLists'
import useShuffle from '../hooks/useShuffle'

const PairedPage = (): ReactElement => {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const { shuffled, listItems } = useLists(id, setIsLoading)
    const [pairs] = useShuffle(id, setIsLoading, shuffled)

    const generatedPairs = useMemo(
        () =>
            Object.keys(pairs).map(
                (it) =>
                    listItems && (
                        <Stack
                            direction="column"
                            gap={4}
                            spacing={0}
                            align="center"
                            wrap="wrap"
                            justifyContent="center"
                            key={it}
                        >
                            {listItems[it] && (
                                <>
                                    <UIListItem
                                        id={it}
                                        name={listItems[it].listItem}
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
                                            <UIListItem
                                                id={that}
                                                key={that}
                                                name={listItems[that].listItem}
                                            />
                                        ))}
                                    </Stack>
                                </>
                            )}
                        </Stack>
                    ),
            ),
        [pairs, listItems],
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
