import {
    Button,
    ButtonGroup,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputProps,
    NumberInputStepper,
    Tooltip,
} from '@chakra-ui/react'
import { ReactElement } from 'react'
import { AbstractListItem } from '../types/main'

interface UIProbabilityCounterProps extends Pick<NumberInputProps, 'onChange'> {
    listItem1?: AbstractListItem
    listItem2?: AbstractListItem
    probability: number
}

const UIProbabilityCounter = ({
    listItem1,
    listItem2,
    probability,
    onChange,
    ...props
}: UIProbabilityCounterProps): ReactElement => {
    return (
        <>
            <ButtonGroup isAttached>
                <Tooltip hasArrow label={listItem1?.listItemID}>
                    <Button
                        colorScheme="secondary"
                        borderRadius="button"
                        fontSize="sm"
                        {...props}
                    >
                        {listItem1?.listItem}
                    </Button>
                </Tooltip>
                <Tooltip hasArrow label={listItem2?.listItemID}>
                    <Button
                        colorScheme="secondary"
                        borderRadius="button"
                        fontSize="sm"
                        {...props}
                    >
                        {listItem2?.listItem}
                    </Button>
                </Tooltip>
            </ButtonGroup>
            <Tooltip hasArrow label="Change probability">
                <NumberInput
                    isRequired
                    step={1}
                    defaultValue={probability}
                    min={0}
                    max={5}
                    maxW={16}
                    onChange={onChange}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </Tooltip>
        </>
    )
}

export default UIProbabilityCounter
