import { ReactElement, useState } from 'react'
import {
    Button,
    Heading,
    Input,
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

interface GDPRModalProps extends Omit<ModalProps, 'children'> {
    onSecondaryClick: () => void
    onPrimaryClick: () => void
}

const GDPRModal = ({
    onSecondaryClick,
    onPrimaryClick,
    ...props
}: GDPRModalProps): ReactElement => {
    const intl = useIntl()
    return (
        <Modal {...props} scrollBehavior='inside'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {intl.formatMessage({
                        id: 'gdpr-your-data',
                        defaultMessage: 'Your Data',
                    })}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Heading size="sm">
                        {intl.formatMessage({
                            id: 'gdpr-privacy',
                            defaultMessage: 'Privacy',
                        })}
                    </Heading>
                    <Text>
                        {intl.formatMessage({
                            id: 'gdpr-stored-info',
                            defaultMessage:
                                'We are committed to your right to security. We do not store any information about you, other than the names you give the lists and their items.',
                        })}
                    </Text>
                    <br />
                    <Heading size="sm">{intl.formatMessage({
                            id: 'gdpr-private-data',
                            defaultMessage: 'Private data',
                        })}</Heading>
                    <Text>
                    {intl.formatMessage({
                            id: 'gdpr-note-alias',
                            defaultMessage:
                            'Note that we do not recommend you to share any private data with us. If you are worried about the names leaking please use aliases.',
                        })}
                    </Text>
                    <br />
                    <Text>
                    {intl.formatMessage({
                            id: 'gdpr-storage',
                            defaultMessage:
                            'Said all that, we store all the aforementioned data in safe databases away from any bad actor, on Amazon Web Services in Frankfurt. Only the people with the right access will be able to see your data and they are requied not to do so by policy.',
                        })}
                    </Text>
                    <br />
                    <Text>
                    {intl.formatMessage({
                            id: 'gdpr-rights',
                            defaultMessage:
                            'When you name a list or its item we store that so next time you log in, the names remain. When you delete a list, everything about it deletes, like its name. Same applies for its items. We delete every instance a month after its creation, so even if you forgot to delete it, it will do so automatically.',
                        })}
                    </Text>
                    <br />
                    <Heading size="sm">{intl.formatMessage({
                            id: 'gdpr-cookies',
                            defaultMessage: 'Cookies or similar',
                        })}</Heading>
                    <Text>
                    {intl.formatMessage({
                            id: 'gdpr-cookie-info',
                            defaultMessage:
                            'We use store IDs in your browser to keep you signed in. If you do not accept this, we will not store anything. If you do, the browser settings decide.',
                        })}
                    </Text>
                    <br />
                    <Text>
                    {intl.formatMessage({
                            id: 'gdpr-contact',
                            defaultMessage:
                            'If you have any questions, write an email to listshuffler@gmail.com',
                        })}
                    </Text>
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme="secondary"
                        mr={3}
                        onClick={onSecondaryClick}
                    >
                        {intl.formatMessage({
                            id: 'cancel',
                            defaultMessage:
                            'Cancel',
                        })}
                    </Button>
                    <Button
                        colorScheme="primary"
                        onClick={() => {
                            onPrimaryClick()
                        }}
                    >
                        {intl.formatMessage({
                            id: 'accept',
                            defaultMessage:
                            'Accept',
                        })}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default GDPRModal
