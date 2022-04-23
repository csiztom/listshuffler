import { useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { AbstractListItem } from '../types/main'

interface Probabilities {
    [key: string]: { [key: string]: number }
}

const useProbabilities = (
    id: string | undefined,
    listId: string | undefined,
    listItems: { [key: string]: AbstractListItem },
    setLoading?: { on: () => void; off: () => void },
): {
    probs: Probabilities
    setProbs: (probs: Probabilities) => void
    saveProbs: () => void
} => {
    const [probs, setProbs] = useState<Probabilities>({})
    const toast = useToast()

    const saveProbs = () => {
        if (!id || !listId) return
        setLoading && setLoading.on()
        fetch(process.env.REACT_APP_API_URL + '/probabilities', {
            method: 'PATCH',
            body: JSON.stringify({
                adminID: id,
                listID: listId,
                probabilities: probs,
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
            .then(setLoading && setLoading.off)
    }

    useEffect(() => {
        if (!id || !listId) return
        setLoading && setLoading.on()
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
                setProbs(response['probabilities'])
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
            .then(setLoading && setLoading.off)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, listId, toast, listItems])

    return { probs, setProbs, saveProbs }
}

export default useProbabilities