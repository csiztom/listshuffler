import {
    Button,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputProps,
    NumberInputStepper,
    Tooltip,
} from '@chakra-ui/react'
import { ReactElement } from 'react'
import { useIntl } from 'react-intl'
import { AbstractListItem } from '../types/main'

interface ProbabilityInputProps extends Pick<NumberInputProps, 'onChange'> {
    listItem1: AbstractListItem
    listItem2: AbstractListItem
    probability: number
}

const ProbabilityInput = ({
    listItem1,
    listItem2,
    probability,
    onChange,
    ...props
}: ProbabilityInputProps): ReactElement => {
    const intl = useIntl()
    return (
        <>
            <Tooltip hasArrow label={listItem1?.listItemID}>
                <Button
                    colorScheme="primary"
                    borderRadius="button"
                    fontSize="sm"
                    {...props}
                >
                    {listItem1.listItem}
                </Button>
            </Tooltip>
            <Tooltip hasArrow label={listItem2?.listItemID}>
                <Button
                    colorScheme={
                        listItem2?.listItemID === listItem1?.listItemID
                            ? 'primary'
                            : 'secondary'
                    }
                    borderRadius="button"
                    fontSize="sm"
                    {...props}
                >
                    {listItem2.listItem}
                </Button>
            </Tooltip>
            <Tooltip
                hasArrow
                label={intl.formatMessage({
                    id: 'change-probability',
                    defaultMessage: 'Change probability',
                })}
            >
                <NumberInput
                    isRequired
                    step={1}
                    defaultValue={probability}
                    min={0}
                    max={5}
                    maxW={16}
                    onChange={onChange}
                >
                    <NumberInputField bgColor="card" />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </Tooltip>
        </>
    )
}

export default ProbabilityInput
