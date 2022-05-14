import {
    Box,
    BoxProps,
} from '@chakra-ui/react'
import { ReactElement } from 'react'


const Card = (props: BoxProps): ReactElement => {
    return (
        <Box
            sx={{
                textAlign: 'center',
                backdropFilter: 'blur(12px) saturate(180%)',
                bgColor: 'card',
                borderRadius: 'card',
                m: '2',
                p: '8',
            }}
            {...props}
        >
            {props.children}
        </Box>
    )
}

export default Card
