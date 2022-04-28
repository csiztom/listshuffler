import { useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

interface Pairs {
    [key: string]: Array<string>
}

const usePairs = (
    id: string | undefined,
    shuffled: boolean | undefined,
    setLoading?: { on: () => void; off: () => void },
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
            .catch(() =>
                toast({
                    title: 'Error occurred while loading pairs. :/',
                    description:
                        'Try reloading the webpage.',
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
    }, [id, toast, shuffled])

    return [pairs, shuffle]
}

export default usePairs
