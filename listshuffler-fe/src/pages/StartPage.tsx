import {
    Grid,
    GridItem,
    Text,
    useBoolean,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { ReactElement, useState } from 'react'
import { Logo, ActionCard } from '../components'
import christmasTree from '../assets/christmas.png'
import pattern from '../assets/pattern.png'
import { useNavigate } from 'react-router-dom'
import GDPRModal from '../components/GDPRModal'
import { useIntl } from 'react-intl'
import { AbstractInstance } from '../types/main'
import Card from '../components/Card'

const StartPage = (props: {
    preset: AbstractInstance['preset']
}): ReactElement => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useBoolean(false)
    const {
        isOpen: loginOpen,
        onOpen: onLoginOpen,
        onClose: onLoginClose,
    } = useDisclosure()
    const {
        isOpen: createOpen,
        onOpen: onCreateOpen,
        onClose: onCreateClose,
    } = useDisclosure()
    const toast = useToast()
    const [code, setCode] = useState<string>(
        localStorage.getItem('loginID') ?? '',
    )
    const intl = useIntl()

    const createInstance = () => {
        setIsLoading.on()
        fetch(
            process.env.REACT_APP_API_URL +
                '/instance' +
                (props.preset ? '?preset=' + props.preset : ''),
            {
                method: 'POST',
            },
        )
            .then((response) => {
                if (response.ok) return response.json()
                else throw Error('not 2xx answer')
            })
            .then((resp) => {
                resp.adminID && localStorage.setItem('loginID', resp.adminID)
                resp.adminID && navigate('./instance/' + resp.adminID)
            })
            .catch(() => {
                toast({
                    title: intl.formatMessage({
                        id: 'error occurred',
                        defaultMessage: 'Error occurred. :/',
                    }),
                    description: intl.formatMessage({
                        id: 'couldnt-create-instance',
                        defaultMessage:
                            'Couldn’t create new instance, maybe try reloading the page and trying again.',
                    }),
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
                setIsLoading.off()
            })
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
                .then((response) => {
                    if (response.ok) return response.json()
                    else throw Error('not 2xx answer')
                })
                .then((resp) => {
                    resp.listItemID &&
                        localStorage.setItem('loginID', resp.listItemID)
                    resp.listItemID && navigate('./listitem/' + resp.listItemID)
                })
                .catch(() => {
                    toast({
                        title: intl.formatMessage({
                            id: 'error occurred',
                            defaultMessage: 'Error occurred. :/',
                        }),
                        description: intl.formatMessage({
                            id: 'couldnt-in-listitem',
                            defaultMessage:
                                'Couldn’t log into listitem, maybe the code provided was wrong.',
                        }),
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                    setIsLoading.off()
                })
        else if (str.length === 6)
            fetch(process.env.REACT_APP_API_URL + '/listitem', {
                method: 'POST',
                body: JSON.stringify({
                    listID: str,
                    listItem: intl.formatMessage({
                        id: 'placeholder-name',
                        defaultMessage: 'placeholder name',
                    }),
                }),
            })
                .then((response) => {
                    if (response.ok) return response.json()
                    else throw Error('not 2xx answer')
                })
                .then((resp) => {
                    resp.listItemID &&
                        localStorage.setItem('loginID', resp.listItemID)
                    resp.listItemID && navigate('./listitem/' + resp.listItemID)
                })
                .catch(() => {
                    toast({
                        title: intl.formatMessage({
                            id: 'error occurred',
                            defaultMessage: 'Error occurred. :/',
                        }),
                        description: intl.formatMessage({
                            id: 'couldnt-in-list',
                            defaultMessage:
                                'Couldn’t log into list, maybe the code provided was wrong.',
                        }),
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                    setIsLoading.off()
                })
        else if (str.length === 8)
            fetch(process.env.REACT_APP_API_URL + '/instance?adminID=' + str, {
                method: 'GET',
            })
                .then((response) => {
                    if (response.ok) return response.json()
                    else throw Error('not 2xx answer')
                })
                .then(() => {
                    str && localStorage.setItem('loginID', str)
                    str && navigate('./instance/' + str)
                })
                .catch(() => {
                    toast({
                        title: intl.formatMessage({
                            id: 'error occurred',
                            defaultMessage: 'Error occurred. :/',
                        }),
                        description: intl.formatMessage({
                            id: 'couldnt-in-instance',
                            defaultMessage:
                                'Couldn’t log into instance, maybe the code provided was wrong.',
                        }),
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                    setIsLoading.off()
                })
        else {
            toast({
                title: intl.formatMessage({
                    id: 'wrong-length',
                    defaultMessage: 'Wrong code length',
                }),
                description: intl.formatMessage({
                    id: 'no-matching',
                    defaultMessage:
                        'Couldn’t find matching object, check code and try again!',
                }),
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
            templateRows={{ base: '', md: 'auto 1fr 1fr 1fr' }}
            gap={4}
            bgImage={props.preset === 'christmas' ? christmasTree : pattern}
            bgRepeat="repeat"
            bgColor="background"
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
                w="80%"
            >
                <Logo />
            </GridItem>
            <GridItem rowSpan={1} colSpan={2}>
                <ActionCard
                    title={
                        props.preset === 'christmas'
                            ? intl.formatMessage({
                                  id: 'christmas-create',
                                  defaultMessage:
                                      'Create your own Secret Santa shuffle',
                              })
                            : intl.formatMessage({
                                  id: 'create-your-own',
                                  defaultMessage:
                                      'Create your own lists and shuffle',
                              })
                    }
                    buttonText={
                        props.preset === 'christmas'
                            ? intl.formatMessage({
                                  id: 'christmas-create-button',
                                  defaultMessage: 'Create Secret Santa',
                              })
                            : intl.formatMessage({
                                  id: 'create-lists',
                                  defaultMessage: 'Create lists',
                              })
                    }
                    onButtonClick={onCreateOpen}
                    isLoading={isLoading}
                />
                <GDPRModal
                    isOpen={createOpen}
                    onClose={onCreateClose}
                    onSecondaryClick={() => {
                        localStorage.clear()
                        onCreateClose()
                    }}
                    onPrimaryClick={() => {
                        onCreateClose()
                        createInstance()
                    }}
                ></GDPRModal>
            </GridItem>
            <GridItem rowSpan={1} colSpan={2}>
                <ActionCard
                    title={intl.formatMessage({
                        id: 'you-have-code',
                        defaultMessage: 'You have a code?',
                    })}
                    buttonText={intl.formatMessage({
                        id: 'use-code',
                        defaultMessage: 'Use Code',
                    })}
                    hasInput
                    inputPlaceholder={intl.formatMessage({
                        id: 'code',
                        defaultMessage: 'Code',
                    })}
                    defaultValue={code}
                    isLoading={isLoading}
                    onButtonClick={(str) => {
                        setCode(str)
                        onLoginOpen()
                    }}
                />
                <GDPRModal
                    isOpen={loginOpen}
                    onClose={onLoginClose}
                    onSecondaryClick={() => {
                        localStorage.clear()
                        onLoginClose()
                    }}
                    onPrimaryClick={() => {
                        onLoginClose()
                        code && signIn(code)
                    }}
                ></GDPRModal>
            </GridItem>
            <GridItem></GridItem>
            <GridItem rowSpan={1} colSpan={2}>
                <Card>
                    <Text align="left">
                        {intl.formatMessage({
                            id: 'about-1',
                            defaultMessage:
                                'This app helps you in shuffling lists. When you have distinct sets of people or objects (and their copies), and you want to pair them up randomly, this app will help you. ',
                        })}
                        <br />
                        <br />
                        {intl.formatMessage({
                            id: 'about-2',
                            defaultMessage:
                                'For example in Secret Santa mode, you have one list that you want to pair up with itself (a copy). ',
                        })}
                        <br />
                        <br />
                        {intl.formatMessage({
                            id: 'about-3',
                            defaultMessage:
                                'If you want to pair up a list with itself, so that 3 items of the same list will be in a pair, set the multiplicity to 3.',
                        })}
                    </Text>
                </Card>
            </GridItem>
        </Grid>
    )
}

export default StartPage
