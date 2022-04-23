import {
    BoxProps,
    Heading,
    Button,
    Input,
    ButtonProps,
} from '@chakra-ui/react'
import { ReactElement, useState } from 'react'
import Card from './Card'

interface ActionCardProps extends BoxProps, Pick<ButtonProps, 'isLoading'> {
    title: string
    buttonText: string
    hasInput?: boolean
    inputPlaceholder?: string
    onButtonClick?: (str: string) => void
}

const ActionCard = ({
    title,
    buttonText,
    hasInput,
    inputPlaceholder,
    onButtonClick,
    isLoading,
    ...props
}: ActionCardProps): ReactElement => {
    const [value, setValue] = useState('')
    return (
        <Card
        >
            <Heading as="h1" fontSize="xlarge" fontWeight="light" mb={4}>
                {title}
            </Heading>
            {hasInput && (
                <Input
                    placeholder={inputPlaceholder}
                    variant="filled"
                    mb={4}
                    borderColor="text"
                    onChange={(e) => setValue(e.target.value)}
                />
            )}
            <Button
                colorScheme="primary"
                borderRadius="button"
                mb={4}
                onClick={() => onButtonClick && onButtonClick(value)}
                isLoading={isLoading}
            >
                {buttonText}
            </Button>
        </Card>
    )
}

export default ActionCard
