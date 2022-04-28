import { useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { AbstractInstance } from '../types/main'

interface Pairs {
    [key: string]: Array<string>
}

const usePairs = (
    id: string | undefined,
    shuffled: boolean | undefined,
    setLoading?: { on: () => void; off: () => void },
    instance?: AbstractInstance,
    setInstance?: (instance: AbstractInstance) => void,
): [Pairs, () => void] => {
    const [pairs, setPairs] = useState<Pairs>({})
    const toast = useToast()

    const shuffle = () => {
        if (!id || shuffled) return
        setLoading && setLoading.on()
        fetch(process.env.REACT_APP_API_URL + '/shuffle', {
            method: 'PATCH',
            body: JSON.stringify({
                adminID: id,
            }),
        })
            .then(
                () =>
                    setInstance &&
                    instance &&
                    setInstance({ ...instance, shuffled: true }),
            )
            .catch(() =>
                toast({
                    title: 'Error occurred while shuffling. :/',
                    description: 'Try adjusting the parameters.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                }),
            )
            .then(setLoading && setLoading.off)
    }

    useEffect(() => {
        if (!id || !shuffled) return
        setLoading && setLoading.on()
        fetch(process.env.REACT_APP_API_URL + '/pairs?adminID=' + id, {
            method: 'GET',
        })
            .then((response) => response.ok && response.json())
            .then((response) => {
                setPairs(response['pairs'])
            })
            .catch(() =>
                toast({
                    title: 'Error occurred while loading pairs. :/',
                    description: 'Try reloading the page.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                }),
            )
            .then(setLoading && setLoading.off)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, shuffled])

    return [pairs, shuffle]
}

export default usePairs
