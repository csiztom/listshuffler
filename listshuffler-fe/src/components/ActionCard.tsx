import {
    Heading,
    Button,
    Input,
    ButtonProps,
    InputProps,
} from '@chakra-ui/react'
import { ReactElement, useState } from 'react'
import Card from './Card'

interface ActionCardProps extends InputProps, Pick<ButtonProps, 'isLoading'> {
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
    const [value, setValue] = useState(props.defaultValue ?? '')
    return (
        <Card>
            <Heading as="h1" fontSize='4xl' fontWeight="light" mb={4}>
                {title}
            </Heading>
            {hasInput && (
                <Input
                    placeholder={inputPlaceholder}
                    variant="filled"
                    mb={4}
                    borderColor="text"
                    onChange={(e) => setValue(e.target.value)}
                    {...props}
                />
            )}
            <Button
                colorScheme="primary"
                borderRadius="button"
                mb={4}
                onClick={() => onButtonClick && onButtonClick(value.toString())}
                isLoading={isLoading}
            >
                {buttonText}
            </Button>
        </Card>
    )
}

export default ActionCard
