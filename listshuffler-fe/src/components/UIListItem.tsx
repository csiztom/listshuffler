import { Button, ButtonProps, Input, InputProps } from '@chakra-ui/react'
import { ReactElement } from 'react'

interface UIListItemProps
    extends Pick<InputProps, 'onChange'>,
        Omit<ButtonProps, 'onChange'> {
    editing?: boolean
    name: string
    id: string
}

const UIListItem = ({
    editing,
    name,
    id,
    onChange,
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
                backdropFilter="blur(16px) saturate(180%)"
                bgColor="card"
                onChange={onChange}
            />
        </>
    ) : (
        <Button colorScheme="secondary" borderRadius="button" p={2} {...props}>
            {name}
        </Button>
    )
}

export default UIListItem
