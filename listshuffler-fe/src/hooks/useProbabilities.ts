import { useToast } from '@chakra-ui/react'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'

interface Probabilities {
    [key: string]: { [key: string]: number }
}

const useProbabilities = (
    id: string | undefined,
    listId: string | undefined,
    setLoading: Dispatch<SetStateAction<boolean>>,
): [Probabilities, Dispatch<SetStateAction<Probabilities>>, () => void] => {
    const [probabilities, setProbabilities] = useState<Probabilities>({})
    const toast = useToast()

    const save = () => {
        if (!id || !listId) return
        setLoading(true)
        fetch(process.env.REACT_APP_API_URL + '/probabilities', {
            method: 'PATCH',
            body: JSON.stringify({
                adminID: id,
                listID: listId,
                probabilities: probabilities,
            }),
        })
            .then(() =>
                toast({
                    title: 'Probabilities successfully saved',
                    description: 'You can shuffle now!',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                }),
            )
            .catch(() =>
                toast({
                    title: 'Error occurred, please refresh. :/',
                    description:
                        'In order to get the latest saved state refresh the page.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                }),
            )
            .then(() => setLoading(false))
    }

    useEffect(() => {
        if (!id || !listId) return
        setLoading(true)
        fetch(
            process.env.REACT_APP_API_URL +
                '/probabilities?adminID=' +
                id +
                '&listID=' +
                listId,
            {
                method: 'GET',
            },
        )
            .then((response) => response.ok && response.json())
            .then((response) => {
                setProbabilities(response['probabilities'])
            })
            .catch(() =>
                toast({
                    title: 'Error occurred, please refresh. :/',
                    description:
                        'In order to get the latest saved state refresh the page.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                }),
            )
            .then(() => setLoading(false))
    }, [id, listId, toast, setLoading])

    return [probabilities, setProbabilities, save]
}

export default useProbabilities
