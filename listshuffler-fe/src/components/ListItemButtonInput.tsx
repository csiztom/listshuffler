import { CopyIcon } from '@chakra-ui/icons'
import {
    Button,
    ButtonProps,
    Input,
    InputProps,
    Text,
    Tooltip,
    useToast,
} from '@chakra-ui/react'
import { ReactElement, useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'

interface ListItemButtonInputProps
    extends Pick<InputProps, 'onChange'>,
        Omit<ButtonProps, 'onChange'> {
    editing?: boolean
    name: string
    id?: string
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
    const inputFocus = useRef<HTMLInputElement>(null)
    useEffect(() => {
        inputFocus.current && inputFocus.current.focus()
    }, [])
    useEffect(() => {
        if (
            name ===
            intl.formatMessage({
                id: 'placeholder-name',
                defaultMessage: 'placeholder name',
            })
        )
            inputFocus.current && inputFocus.current.focus()
    }, [editing, intl, name])
    const onClick = () => {
        if (!id) return
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
        <Tooltip
            hasArrow
            label={intl.formatMessage({
                id: 'edit-list-item',
                defaultMessage: 'Edit list item name',
            })}
        >
            <Input
                colorScheme="secondary"
                borderRadius="button"
                p={2}
                maxLength={40}
                w="fit-content"
                defaultValue={
                    name ===
                    intl.formatMessage({
                        id: 'placeholder-name',
                        defaultMessage: 'placeholder name',
                    })
                        ? ''
                        : name
                }
                placeholder={intl.formatMessage({
                    id: 'name',
                    defaultMessage: 'Name',
                })}
                htmlSize={name.length || 10}
                backdropFilter="blur(16px) saturate(180%)"
                bgColor="card"
                onChange={onChange}
                ref={inputFocus}
            />
        </Tooltip>
    ) : id ? (
        <Tooltip
            hasArrow
            label={intl.formatMessage({
                id: 'copy-code',
                defaultMessage: 'Copy code',
            })}
        >
            <Button
                colorScheme={primary ? 'primary' : 'secondary'}
                borderRadius="button"
                onClick={onClick}
                p={3}
                {...props}
            >
                <CopyIcon mr={2} />
                <div>
                    <Text fontSize="sm">{name}</Text>
                    <Text fontSize="xx-small">{id}</Text>
                </div>
            </Button>
        </Tooltip>
    ) : (
        <Button
            colorScheme={primary ? 'primary' : 'secondary'}
            borderRadius="button"
            p={3}
            {...props}
        >
            <Text fontSize="sm">{name}</Text>
        </Button>
    )
}

export default ListItemButtonInput
