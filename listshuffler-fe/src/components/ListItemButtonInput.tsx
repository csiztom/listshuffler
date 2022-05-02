import {
    Button,
    ButtonProps,
    Input,
    InputProps,
    Tooltip,
    useToast,
} from '@chakra-ui/react'
import { ReactElement } from 'react'
import { useIntl } from 'react-intl'

interface ListItemButtonInputProps
    extends Pick<InputProps, 'onChange'>,
        Omit<ButtonProps, 'onChange'> {
    editing?: boolean
    name: string
    id: string
    primary?: boolean
}

const ListItemButtonInput = ({
    editing,
    name,
    id,
    onChange,
    primary,
    ...props
}: ListItemButtonInputProps): ReactElement => {
    const toast = useToast()
    const intl = useIntl()
    const onClick = () => {
        var data = [
            new ClipboardItem({
                'text/plain': new Blob([id], { type: 'text/plain' }),
            }),
        ]
        navigator.clipboard.write(data).then(() =>
            toast({
                title: intl.formatMessage({
                    id: 'code-copied',
                    defaultMessage: 'Code copied to clipboard',
                }),
                description: intl.formatMessage({
                    id: 'you-can-share',
                    defaultMessage:
                        'You can now share this with the to-be list pairs',
                }),
                status: 'success',
                duration: 9000,
                isClosable: true,
            }),
        )
    }
    return editing ? (
        <Tooltip hasArrow label={intl.formatMessage({
            id: 'edit-list-item',
            defaultMessage: 'Edit list item name',
        })}>
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
        <Tooltip hasArrow label={intl.formatMessage({
            id: 'copy-code',
            defaultMessage: 'Copy code',
        })}>
            <Button
                colorScheme={primary ? 'primary' : 'secondary'}
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

export default ListItemButtonInput
