import { Box, BoxProps, Heading, Button, Input } from '@chakra-ui/react'
import { ReactElement } from 'react'

interface ActionCardProps extends BoxProps {
    title: string
    buttonText: string
    hasInput?: boolean
    inputPlaceholder?: string
    onButtonClick?: () => void
}

const ActionCard = ({
    title,
    buttonText,
    hasInput,
    inputPlaceholder,
    onButtonClick,
    ...props
}: ActionCardProps): ReactElement => {
    return (
        <Box
            sx={{
                textAlign: 'center',
                backdropFilter: 'blur(16px) saturate(180%)',
                bgColor: 'card',
                borderRadius: 'card',
                m: '2',
                p: '6',
            }}
            {...props}
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
                />
            )}
            <Button
                colorScheme="primary"
                borderRadius="button"
                mb={4}
                onClick={onButtonClick}
            >
                {buttonText}
            </Button>
        </Box>
    )
}

export default ActionCard
