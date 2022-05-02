import { ReactElement } from 'react'
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    ModalProps,
    Text,
} from '@chakra-ui/react'
import { useIntl } from 'react-intl'

interface DeleteModalProps extends Omit<ModalProps, 'children'> {
    header: string
    text: string
    onSecondaryClick: () => void
    onPrimaryClick: () => void
}

const DeleteModal = ({
    header,
    text,
    onSecondaryClick,
    onPrimaryClick,
    ...props
}: DeleteModalProps): ReactElement => {
    const intl = useIntl()
    return (
        <Modal {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{header}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>{text}</Text>
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme="secondary"
                        mr={3}
                        onClick={onSecondaryClick}
                    >
                        {intl.formatMessage({
                            id: 'cancel',
                            defaultMessage: 'Cancel',
                        })}
                    </Button>
                    <Button colorScheme="primary" onClick={onPrimaryClick}>
                        {intl.formatMessage({
                            id: 'delete',
                            defaultMessage: 'Delete',
                        })}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default DeleteModal
