import fetch, { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()
import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-dom/test-utils'
import useProbabilities from './useProbabilities'

jest.mock('react-intl', () => ({
    ...(jest.requireActual('react-intl') as any),
    useIntl: () => ({
        formatMessage: (obj: {defaultMessage: string, id: string}) => obj.defaultMessage
    }),
}))

describe('useProbabilities', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })
    describe('probs', () => {
        it('gets probabilities', async () => {
            fetch.mockResponse(
                JSON.stringify({
                    probabilities: {
                        listitem_id1: { listitem_id1: 1, listitem_id2: 0 },
                    },
                }),
            )
            const adminId = 'admin_id'
            const listId = 'list_id'
            const listItems = {
                listitem_id1: { listItem: 'a', listItemID: 'listitem_id1' },
                listitem_id2: { listItem: 'b', listItemID: 'listitem_id2' },
            }
            const { result, waitForNextUpdate } = renderHook(() =>
                useProbabilities(adminId, listId, listItems),
            )
            await waitForNextUpdate()
            expect(fetch).toHaveBeenCalledWith(
                process.env.REACT_APP_API_URL +
                    '/probabilities?adminID=' +
                    'admin_id' +
                    '&listID=' +
                    'list_id',
                {
                    method: 'GET',
                },
            )
            expect(result.current.probs).toEqual({
                listitem_id1: { listitem_id1: 1, listitem_id2: 0 },
            })
        })
    })
    describe('saveProbs', () => {
        it('saves probabilities', async () => {
            fetch.mockResponse(
                JSON.stringify({
                    probabilities: {
                        listitem_id1: { listitem_id1: 1, listitem_id2: 0 },
                    },
                }),
            )
            const adminId = 'admin_id'
            const listId = 'list_id'
            const listItems = {
                listitem_id1: { listItem: 'a', listItemID: 'listitem_id1' },
                listitem_id2: { listItem: 'b', listItemID: 'listitem_id2' },
            }
            const { result, waitForNextUpdate } = renderHook(() =>
                useProbabilities(adminId, listId, listItems),
            )
            await waitForNextUpdate()
            act(() => {
                result.current.setProbs({
                    listitem_id1: { listitem_id1: 1, listitem_id2: 1 },
                })
            })
            expect(result.current.probs).toEqual({
                listitem_id1: { listitem_id1: 1, listitem_id2: 1 },
            })
            act(() => {
                result.current.saveProbs()
            })
            expect(fetch).toHaveBeenCalledWith(
                process.env.REACT_APP_API_URL + '/probabilities',
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        adminID: 'admin_id',
                        listID: 'list_id',
                        probabilities: {
                            listitem_id1: { listitem_id1: 1, listitem_id2: 1 },
                        },
                    }),
                },
            )
        })
    })
})
