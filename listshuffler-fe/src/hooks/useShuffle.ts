import { useToast } from '@chakra-ui/react'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'

interface Pairs {
    [key: string]: Array<string>
}

const useShuffle = (
    id: string | undefined,
    setLoading: Dispatch<SetStateAction<boolean>>,
    shuffled: boolean,
): [Pairs, (shuffledId: string) => void] => {
    const [pairs, setPairs] = useState<Pairs>({})
    const toast = useToast()

    const shuffle = (shuffledId: string) => {
        if (!id || shuffled) return
        setLoading(true)
        fetch(process.env.REACT_APP_API_URL + '/shuffle', {
            method: 'PATCH',
            body: JSON.stringify({
                adminID: id,
                unique: true,
            }),
        })
            .then(() => setLoading(false))
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
    }

    useEffect(() => {
        if (!id && !shuffled) return
        setLoading(true)
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
            .then(() => setLoading(false))
    }, [id, toast, setLoading, shuffled])

    return [pairs, shuffle]
}

export default useShuffle
