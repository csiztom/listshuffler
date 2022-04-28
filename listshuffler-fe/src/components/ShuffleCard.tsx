import {
    Button,
    ButtonProps,
    Tooltip,
    ButtonGroup,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    Input,
    useDisclosure,
    Stack,
} from '@chakra-ui/react'
import { ReactElement, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AbstractInstance } from '../types/main'
import Card from './Card'

interface ShuffleCardProps extends Pick<ButtonProps, 'isLoading'> {
    instance: AbstractInstance
    setInstance: (instance: AbstractInstance) => void
    isLoading?: boolean
    disabled?: boolean
    shuffle: () => void
}

const ShuffleCard = ({
    instance,
    setInstance,
    isLoading,
    disabled,
    shuffle,
}: ShuffleCardProps): ReactElement => {
    const navigate = useNavigate()
    const { onOpen, onClose, isOpen } = useDisclosure()
    const [value, setValue] = useState<string>()
    return (
        <Card zIndex={1}>
            {instance?.shuffled ? (
                <Tooltip hasArrow label="See the pairs">
                <Button
                    colorScheme="primary"
                    borderRadius="button"
                    p={2}
                    isLoading={isLoading}
                    onClick={() => navigate('./pairs')}
                >
                    Pairs
                </Button>
            </Tooltip>
            ) : (
                <ButtonGroup>
                    <Tooltip hasArrow label="Shuffle lists">
                        <Button
                            colorScheme="primary"
                            borderRadius="button"
                            p={2}
                            isLoading={isLoading}
                            disabled={
                                !instance?.shuffledID || disabled || isLoading
                            }
                            onClick={() => {
                                instance?.shuffledID && shuffle()
                            }}
                        >
                            Shuffle now
                        </Button>
                    </Tooltip>
                    <Popover
                        isOpen={isOpen}
                        returnFocusOnClose={false}
                        onOpen={onOpen}
                        onClose={onClose}
                        closeOnBlur={true}
                    >
                        <PopoverTrigger>
                            <Button
                                colorScheme="secondary"
                                borderRadius="button"
                                p={2}
                                isLoading={isLoading}
                                disabled={
                                    disabled ||
                                    !instance?.shuffledID ||
                                    isLoading
                                }
                                onClick={() => (isOpen ? onClose() : onOpen())}
                            >
                                Time
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <Stack direction="row" padding={2}>
                                <Input
                                    type="date"
                                    defaultValue={instance?.shuffleTime ?? ''}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                                <Button
                                    colorScheme="primary"
                                    borderRadius="button"
                                    p={4}
                                    isLoading={isLoading}
                                    disabled={
                                        disabled ||
                                        !instance?.shuffledID ||
                                        isLoading
                                    }
                                    onClick={() => {
                                        setInstance({
                                            ...instance,
                                            shuffleTime: value ?? null,
                                        })
                                        onClose()
                                    }}
                                >
                                    Save
                                </Button>
                            </Stack>
                        </PopoverContent>
                    </Popover>
                </ButtonGroup>
            )}
        </Card>
    )
}

export default ShuffleCard
