import { CalendarIcon, DeleteIcon } from '@chakra-ui/icons'
import {
    Button,
    ButtonProps,
    Tooltip,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    Input,
    useDisclosure,
    Stack,
} from '@chakra-ui/react'
import { ReactElement, useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { AbstractInstance } from '../types/main'
import Card from './Card'
import DeleteModal from './DeleteModal'

interface ShuffleCardProps extends Pick<ButtonProps, 'isLoading'> {
    instance: AbstractInstance
    setInstance: (instance: AbstractInstance) => void
    isLoading?: boolean
    disabled?: boolean
    shuffle: () => void
    deleteInstance: () => void
}

const ShuffleCard = ({
    instance,
    setInstance,
    isLoading,
    disabled,
    shuffle,
    deleteInstance,
}: ShuffleCardProps): ReactElement => {
    const navigate = useNavigate()
    const { onOpen, onClose, isOpen } = useDisclosure()
    const {
        onOpen: onModalOpen,
        onClose: onModalClose,
        isOpen: isModalOpen,
    } = useDisclosure()
    const [value, setValue] = useState<string>()
    const intl = useIntl()
    return (
        <Card zIndex={1}>
            <DeleteModal
                isOpen={isModalOpen}
                onClose={onModalClose}
                onSecondaryClick={onModalClose}
                onPrimaryClick={() => {
                    onModalClose()
                    deleteInstance()
                }}
                header={intl.formatMessage({
                    id: 'delete-instance',
                    defaultMessage: 'Delete instance',
                })}
                text={intl.formatMessage({
                    id: 'do-you-delete-instance',
                    defaultMessage:
                        'Do you really want to delete the whole instance? You will need to start over again if you want to shuffle.',
                })}
            />
            <Stack direction="row"
                gap={2}
                spacing={0}
                align="center"
                wrap="wrap"
                justifyContent="center">
                <Tooltip
                    hasArrow
                    label={intl.formatMessage({
                        id: 'delete-instance',
                        defaultMessage: 'Delete instance',
                    })}
                >
                    <Button
                        colorScheme="red"
                        borderRadius="button"
                        p={2}
                        isLoading={isLoading}
                        onClick={onModalOpen}
                    >
                        <DeleteIcon mr={2} />
                        {intl.formatMessage({
                            id: 'delete-instance',
                            defaultMessage: 'Delete instance',
                        })}
                    </Button>
                </Tooltip>
                {instance?.shuffled ? (
                    <Tooltip
                        hasArrow
                        label={intl.formatMessage({
                            id: 'see-the-pairs',
                            defaultMessage: 'See the pairs',
                        })}
                    >
                        <Button
                            colorScheme="primary"
                            borderRadius="button"
                            p={2}
                            isLoading={isLoading}
                            onClick={() => navigate('./pairs')}
                        >
                            {intl.formatMessage({
                                id: 'show-pairs',
                                defaultMessage: 'Show pairs',
                            })}
                        </Button>
                    </Tooltip>
                ) : (
                    <>
                        <Tooltip
                            hasArrow
                            label={intl.formatMessage({
                                id: 'shuffle-lists',
                                defaultMessage: 'Shuffle lists',
                            })}
                        >
                            <Button
                                colorScheme="primary"
                                borderRadius="button"
                                p={2}
                                isLoading={isLoading}
                                disabled={
                                    !instance?.shuffledID ||
                                    disabled ||
                                    isLoading
                                }
                                onClick={() => {
                                    instance?.shuffledID && shuffle()
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'shuffle-now',
                                    defaultMessage: 'Shuffle now',
                                })}
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
                                    onClick={() =>
                                        isOpen ? onClose() : onOpen()
                                    }
                                >
                                    <CalendarIcon mr={2} />
                                    {intl.formatMessage({
                                        id: 'timed-shuffle',
                                        defaultMessage: 'Timed shuffle',
                                    })}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow />
                                <Stack direction="row" padding={2}>
                                    <Input
                                        type="date"
                                        defaultValue={
                                            instance?.shuffleTime ?? ''
                                        }
                                        onChange={(e) =>
                                            setValue(e.target.value)
                                        }
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
                                        {intl.formatMessage({
                                            id: 'save',
                                            defaultMessage: 'Save',
                                        })}
                                    </Button>
                                </Stack>
                            </PopoverContent>
                        </Popover>
                    </>
                )}
            </Stack>
        </Card>
    )
}

export default ShuffleCard
