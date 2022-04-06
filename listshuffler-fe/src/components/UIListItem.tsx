import {
    Button,
    ButtonProps,
    Input,
    InputProps,
    Tooltip,
    useToast,
} from '@chakra-ui/react'
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
    const toast = useToast()
    const onClick = () => {
        var data = [
            new ClipboardItem({
                'text/plain': new Blob([id], { type: 'text/plain' }),
            }),
        ]
        navigator.clipboard.write(data).then(() =>
            toast({
                title: 'Code copied to clipboard.',
                description:
                    'You can now share this with the respective users.',
                status: 'success',
                duration: 9000,
                isClosable: true,
            }),
        )
    }
    return editing ? (
        <Tooltip hasArrow label="Edit list item name">
            <Input
                colorScheme="secondary"
                borderRadius="button"
                p={2}
                maxLength={40}
                w="fit-content"
                defaultValue={name}
                htmlSize={name.length}
                backdropFilter="blur(16px) saturate(180%)"
                bgColor="card"
                onChange={onChange}
            />
        </Tooltip>
    ) : (
        <Tooltip hasArrow label="Copy code">
            <Button
                colorScheme="secondary"
                borderRadius="button"
                onClick={onClick}
                p={2}
                {...props}
            >
                {name}
            </Button>
        </Tooltip>
    )
}

export default UIListItem
