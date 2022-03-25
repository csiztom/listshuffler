import { Button, Input, InputProps } from '@chakra-ui/react'
import { ReactElement } from 'react'

interface UIListItemProps extends Pick<InputProps, 'onChange'> {
    editing?: boolean
    name: string
    id: string
}

const UIListItem = ({
    editing,
    name,
    id,
    ...props
}: UIListItemProps): ReactElement => {
    return editing ? (
        <>
            <Input
                colorScheme="secondary"
                borderRadius="button"
                p={2}
                w="fit-content"
                defaultValue={name}
                htmlSize={name.length}
                backdropFilter='blur(16px) saturate(180%)'
                bgColor='card'
                {...props}
            />
        </>
    ) : (
        <Button colorScheme="secondary" borderRadius="button" p={2}>
            {name}
        </Button>
    )
}

export default UIListItem
