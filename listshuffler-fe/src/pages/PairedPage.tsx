import { Button, Spinner, Stack, Text, Tooltip, useBoolean } from '@chakra-ui/react'
import { ReactElement, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'
import { ListItemButtonInput } from '../components'
import Card from '../components/Card'
import useInstance from '../hooks/useInstance'
import usePairs from '../hooks/usePairs'

const PairedPage = (): ReactElement => {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useBoolean(false)
    const { instance, allListItems } = useInstance(id ?? '', setIsLoading)
    const [pairs] = usePairs(id, instance?.shuffled, setIsLoading)
    const intl = useIntl()
    const navigate = useNavigate()

    const generatedPairs = useMemo(
        () =>
            Object.keys(pairs).map(
                (it) =>
                    allListItems && (
                        <Card>
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
                                            primary
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
                                                        allListItems[that]
                                                            .listItem
                                                    }
                                                />
                                            ))}
                                        </Stack>
                                    </>
                                )}
                            </Stack>
                        </Card>
                    ),
            ),
        [pairs, allListItems],
    )

    return (
        <>
            <Card>
                <Text fontSize="lg">
                    {intl.formatMessage({
                        id: 'these-are-pairs',
                        defaultMessage: 'These are your pairs.',
                    })}
                </Text>
            </Card>
            {(isLoading || Object.keys(pairs).length === 0) && (
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
            {!isLoading && generatedPairs.length > 0 && (
                <Stack
                    direction="column"
                    gap={8}
                    spacing={0}
                    align="center"
                    wrap="wrap"
                    justifyContent="center"
                >
                    {generatedPairs}
                    <Card>
                    <Tooltip
                        hasArrow
                        label={intl.formatMessage({
                            id: 'back',
                            defaultMessage: 'Go back',
                        })}
                    >
                        <Button
                            colorScheme="primary"
                            borderRadius="button"
                            p={2}
                            isLoading={isLoading}
                            onClick={() => navigate('/instance/'+id)}
                        >
                            {intl.formatMessage({
                                id: 'back',
                                defaultMessage: 'Go back',
                            })}
                        </Button>
                    </Tooltip></Card>
                </Stack>
            )}
        </>
    )
}

export default PairedPage
