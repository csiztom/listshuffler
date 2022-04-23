import {
    Button,
    Grid,
    GridItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useBoolean,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { ReactElement, useState } from 'react'
import { Logo, ActionCard } from '../components'
import image from '../assets/drawing.svg'
import { useNavigate } from 'react-router-dom'

const StartPage = (): ReactElement => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useBoolean(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const [code, setCode] = useState<string>()
    const createInstance = () => {
        setIsLoading.on()
        fetch(process.env.REACT_APP_API_URL + '/instance', {
            method: 'POST',
        })
            .then((response) => response.ok && response.json())
            .then(
                (resp) =>
                    resp.adminID && navigate('./instance/' + resp.adminID),
            )
            .catch(() =>
                toast({
                    title: 'Error occurred. :/',
                    description:
                        'Couldn’t create new instance, maybe try reloading the page and trying again.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                }),
            )
            .then(setIsLoading.off)
    }

    const signIn = (str: string) => {
        setIsLoading.on()
        if (str.length === 7)
            fetch(
                process.env.REACT_APP_API_URL + '/listitem?listItemID=' + str,
                {
                    method: 'GET',
                },
            )
                .then((response) => response.ok && response.json())
                .then(
                    (resp) =>
                        resp.listItemID &&
                        navigate('./listitem/' + resp.listItemID),
                )
                .catch(() =>
                    toast({
                        title: 'Error occurred. :/',
                        description:
                            'Couldn’t find matching list item, check code and try again!',
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    }),
                )
                .then(setIsLoading.off)
        else if (str.length === 6)
            fetch(process.env.REACT_APP_API_URL + '/listitem', {
                method: 'POST',
                body: JSON.stringify({
                    listID: str,
                    listItem: 'Auto-Generated Item',
                }),
            })
                .then((response) => response.ok && response.json())
                .then(
                    (resp) =>
                        resp.listItemID &&
                        navigate('./listitem/' + resp.listItemID),
                )
                .catch(() =>
                    toast({
                        title: 'Error occurred. :/',
                        description:
                            'Couldn’t find matching list, check code and try again!',
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    }),
                )
                .then(setIsLoading.off)
        else if (str.length === 8)
            fetch(process.env.REACT_APP_API_URL + '/instance?adminID=' + str, {
                method: 'GET',
            })
                .then((response) => response.ok && response.json())
                .then(() => navigate('./instance/' + str))
                .catch(() =>
                    toast({
                        title: 'Error occurred. :/',
                        description:
                            'Couldn’t find matching instance, check code and try again!',
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    }),
                )
                .then(setIsLoading.off)
        else {
            toast({
                title: 'Wrong code length',
                description:
                    'Couldn’t find matching object, check code and try again!',
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setIsLoading.off()
        }
    }

    return (
        <Grid
            templateColumns={{ base: '', md: 'repeat(4, 1fr)' }}
            templateRows={{ base: '', md: 'auto 1fr 1fr' }}
            gap={4}
            bgImage={image}
            w="100vw"
            h="100vh"
            p="8"
            overflow="auto"
            justifyItems="center"
            alignItems="center"
        >
            <GridItem
                rowSpan={1}
                colStart={{ base: 1, md: 2 }}
                colEnd={{ base: 3, md: 4 }}
                w="60%"
            >
                <Logo />
            </GridItem>
            <GridItem rowSpan={1} colSpan={2}>
                <ActionCard
                    title="Create your own list"
                    buttonText="Create lists"
                    onButtonClick={createInstance}
                    isLoading={isLoading}
                />
            </GridItem>
            <GridItem rowSpan={1} colSpan={2}>
                <ActionCard
                    title="You have a code?"
                    buttonText="Use code"
                    hasInput
                    inputPlaceholder="Code"
                    isLoading={isLoading}
                    onButtonClick={(str) => {
                        setCode(str)
                        str.length === 6 ? onOpen() : signIn(str)
                    }}
                />
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Modal Title</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>
                                Are you sure you want to create a new item in
                                the list (with your code)?
                            </Text>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                colorScheme="secondary"
                                mr={3}
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                colorScheme="primary"
                                onClick={() => {
                                    onClose()
                                    code && signIn(code)
                                }}
                            >
                                Yes
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </GridItem>
        </Grid>
    )
}

export default StartPage
