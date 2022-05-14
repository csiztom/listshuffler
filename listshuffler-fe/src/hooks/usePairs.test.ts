import fetch, { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()
import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-dom/test-utils'
import usePairs from './usePairs'

jest.mock('react-intl', () => ({
    ...(jest.requireActual('react-intl') as any),
    useIntl: () => ({
        formatMessage: (obj: {defaultMessage: string, id: string}) => obj.defaultMessage
    }),
}))

describe('usePairs', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })
    it('gets pairs', async () => {
        fetch.mockResponse(
            JSON.stringify({
                pairs: {
                    listitem_id1: ['listitem_id1', 'listitem_id2'],
                },
            }),
        )
        const adminId = 'admin_id'
        const shuffled = true
        const { result, waitForNextUpdate } = renderHook(() =>
            usePairs(adminId, shuffled),
        )
        await waitForNextUpdate()
        const [pairs, shuffle] = result.current
        expect(fetch).toHaveBeenCalledWith(
            process.env.REACT_APP_API_URL + '/pairs?adminID=' + adminId,
            {
                method: 'GET',
            },
        )
        expect(pairs).toEqual({
            listitem_id1: ['listitem_id1', 'listitem_id2'],
        })
    })
    describe('shuffle', () => {
        it('shuffles', async () => {
            fetch.mockResponse(
                JSON.stringify({
                    pairs: {
                        listitem_id1: ['listitem_id1', 'listitem_id2'],
                    },
                }),
            )
            const adminId = 'admin_id'
            const shuffled = false
            const { result, waitForNextUpdate } = renderHook(() =>
                usePairs(adminId, shuffled),
            )
            const [pairs, shuffle] = result.current
            act(() => {
                shuffle()
            })
            expect(fetch).toHaveBeenCalledWith(
                process.env.REACT_APP_API_URL + '/shuffle',
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        adminID: adminId,
                    }),
                },
            )
        })
    })
})
