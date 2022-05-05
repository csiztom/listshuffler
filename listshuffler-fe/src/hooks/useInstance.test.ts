import fetch, { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()
import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-dom/test-utils'
import useInstance from './useInstance'
import { AbstractInstance } from '../types/main'

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    useNavigate: () => mockedUsedNavigate,
}))

jest.mock('react-intl', () => ({
    ...(jest.requireActual('react-intl') as any),
    useIntl: () => ({
        formatMessage: (obj: {defaultMessage: string, id: string}) => obj.defaultMessage
    }),
}))

describe('useInstance', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })
    describe('instance', () => {
        it('gets instance', async () => {
            const instance: AbstractInstance = {
                shuffledID: null,
                lists: [],
                shuffled: false,
                shuffleTime: null,
                uniqueInMul: true,
                preset: null,
            }
            fetch.mockResponse(JSON.stringify(instance))
            const adminId = 'admin_id'
            const { result, waitForNextUpdate } = renderHook(() =>
                useInstance(adminId),
            )
            await waitForNextUpdate()
            expect(fetch).toHaveBeenCalledWith(
                process.env.REACT_APP_API_URL + '/instance?adminID=' + adminId,
                {
                    method: 'GET',
                },
            )
            expect(result.current.instance).toEqual(instance)
        })
    })
    describe('multiplicitySum', () => {
        it('correct sum', async () => {
            const instance: AbstractInstance = {
                shuffledID: null,
                lists: [
                    {
                        listID: 'list_id',
                        listName: 'Name',
                        listItems: [],
                        multiplicity: 1,
                    },
                    {
                        listID: 'list_id2',
                        listName: 'Name',
                        listItems: [],
                        multiplicity: 2,
                    },
                ],
                shuffled: false,
                shuffleTime: null,
                uniqueInMul: true,
                preset: null,
            }
            fetch.mockResponse(JSON.stringify(instance))
            const adminId = 'admin_id'
            const { result, waitForNextUpdate } = renderHook(() =>
                useInstance(adminId),
            )
            await waitForNextUpdate()
            expect(result.current.multiplicitySum).toBe(3)
        })
    })
    describe('allListItems', () => {
        it('correct length and items', async () => {
            const instance: AbstractInstance = {
                shuffledID: null,
                lists: [
                    {
                        listID: 'list_id',
                        listName: 'Name',
                        listItems: [
                            { listItem: 'Name', listItemID: 'id1' },
                            { listItem: 'Name', listItemID: 'id2' },
                            { listItem: 'Name', listItemID: 'id3' },
                            { listItem: 'Name', listItemID: 'id4' },
                        ],
                        multiplicity: 1,
                    },
                    {
                        listID: 'list_id2',
                        listName: 'Name',
                        listItems: [
                            { listItem: 'Name', listItemID: 'id5' },
                            { listItem: 'Name', listItemID: 'id6' },
                            { listItem: 'Name', listItemID: 'id7' },
                            { listItem: 'Name', listItemID: 'id8' },
                        ],
                        multiplicity: 1,
                    },
                ],
                shuffled: false,
                shuffleTime: null,
                uniqueInMul: true,
                preset: null,
            }
            fetch.mockResponse(JSON.stringify(instance))
            const adminId = 'admin_id'
            const { result, waitForNextUpdate } = renderHook(() =>
                useInstance(adminId),
            )
            await waitForNextUpdate()
            expect(result.current.allListItems).toEqual({
                id1: { listItem: 'Name', listItemID: 'id1' },
                id2: { listItem: 'Name', listItemID: 'id2' },
                id3: { listItem: 'Name', listItemID: 'id3' },
                id4: { listItem: 'Name', listItemID: 'id4' },
                id5: { listItem: 'Name', listItemID: 'id5' },
                id6: { listItem: 'Name', listItemID: 'id6' },
                id7: { listItem: 'Name', listItemID: 'id7' },
                id8: { listItem: 'Name', listItemID: 'id8' },
            })
        })
    })
    describe('deleteInstance', () => {
        it('deletes instance', async () => {
            const instance: AbstractInstance = {
                shuffledID: null,
                lists: [],
                shuffled: false,
                shuffleTime: null,
                uniqueInMul: true,
                preset: null,
            }
            fetch.mockResponse(JSON.stringify(instance))
            const adminId = 'admin_id'
            const { result, waitForNextUpdate } = renderHook(() =>
                useInstance(adminId),
            )
            await waitForNextUpdate()
            act(() => {
                result.current.deleteInstance()
            })
            expect(fetch).toHaveBeenCalledWith(
                process.env.REACT_APP_API_URL + '/instance',
                {
                    method: 'DELETE',
                    body: JSON.stringify({
                        adminID: adminId,
                    }),
                },
            )
        })
    })
    describe('updateInstance', () => {
        it('all params', async () => {
            const instance: AbstractInstance = {
                shuffledID: null,
                lists: [],
                shuffled: false,
                shuffleTime: null,
                uniqueInMul: true,
                preset: null,
            }
            fetch.mockResponse(JSON.stringify(instance))
            const adminId = 'admin_id'
            const { result, waitForNextUpdate } = renderHook(() =>
                useInstance(adminId),
            )
            await waitForNextUpdate()
            const editedInstance = {
                ...instance,
                shuffledID: 'id1',
                shuffleTime: '2022-10-26',
                uniqueInMul: false,
                lists: [
                    {
                        listID: 'list_id',
                        listName: 'Name',
                        listItems: [],
                        multiplicity: 1,
                    },
                ],
            }
            act(() => {
                result.current.setInstance(editedInstance)
            })
            expect(fetch).toHaveBeenCalledWith(
                process.env.REACT_APP_API_URL + '/instance',
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        adminID: adminId,
                        shuffledID: editedInstance.shuffledID,
                        shuffleTime: editedInstance.shuffleTime,
                        uniqueInMul: editedInstance.uniqueInMul,
                    }),
                },
            )
            expect(result.current.instance).toEqual(editedInstance)
        })
        it('some params', async () => {
            const instance: AbstractInstance = {
                shuffledID: null,
                lists: [],
                shuffled: false,
                shuffleTime: null,
                uniqueInMul: true,
                preset: null,
            }
            fetch.mockResponse(JSON.stringify(instance))
            const adminId = 'admin_id'
            const { result, waitForNextUpdate } = renderHook(() =>
                useInstance(adminId),
            )
            await waitForNextUpdate()
            const editedInstance = {
                ...instance,
                shuffledID: 'id1',
            }
            act(() => {
                result.current.setInstance(editedInstance)
            })
            expect(fetch).toHaveBeenCalledWith(
                process.env.REACT_APP_API_URL + '/instance',
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        adminID: adminId,
                        shuffledID: editedInstance.shuffledID,
                    }),
                },
            )
            expect(result.current.instance).toEqual(editedInstance)
        })
    })
    describe('addList', () => {
        it('add list', async () => {
            const instance: AbstractInstance = {
                shuffledID: null,
                lists: [],
                shuffled: false,
                shuffleTime: null,
                uniqueInMul: true,
                preset: null,
            }
            fetch.mockResponses(
                JSON.stringify(instance),
                JSON.stringify({ listID: 'new_id' }),
            )
            const adminId = 'admin_id'
            const { result, waitForNextUpdate } = renderHook(() =>
                useInstance(adminId),
            )
            await waitForNextUpdate()
            act(() => {
                result.current.addList()
            })
            await waitForNextUpdate()
            expect(result.current.instance).toEqual({
                ...instance,
                lists: [
                    {
                        listID: 'new_id',
                        listName: 'New List 1',
                        listItems: [],
                        inProgress: true,
                        multiplicity: 1,
                    },
                ],
            })
        })
    })
    describe('saveLists', () => {
        it('save edited lists', async () => {
            const instance: AbstractInstance = {
                shuffledID: null,
                lists: [
                    {
                        listID: 'list_id',
                        listName: 'Name',
                        listItems: [
                            { listItem: 'Name', listItemID: 'id1' },
                            { listItem: 'Name', listItemID: 'id2' },
                        ],
                        multiplicity: 1,
                    },
                    {
                        listID: 'list_id2',
                        listName: 'Name',
                        listItems: [],
                        multiplicity: 1,
                    },
                ],
                shuffled: false,
                shuffleTime: null,
                uniqueInMul: true,
                preset: null,
            }
            fetch.mockResponses(JSON.stringify(instance))
            const adminId = 'admin_id'
            const { result, waitForNextUpdate } = renderHook(() =>
                useInstance(adminId),
            )
            await waitForNextUpdate()
            const editedInstance = {
                ...instance,
                lists: [
                    {
                        listID: 'list_id',
                        listName: 'New Name',
                        listItems: [
                            { listItem: 'New Name', listItemID: 'id2' },
                            { listItem: 'New Item', listItemID: 'id3' },
                        ],
                        multiplicity: 2,
                    },
                ],
            }
            act(() => {
                result.current.setInstance(editedInstance)
            })
            act(() => {
                result.current.saveLists()
            })
            await waitForNextUpdate()
            expect(result.current.instance).toEqual(editedInstance)
            expect(fetch).toHaveBeenCalledWith(
                process.env.REACT_APP_API_URL + '/list',
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        listID: 'list_id',
                        listName: 'New Name',
                        multiplicity: 2,
                    }),
                },
            )
            expect(fetch).toHaveBeenCalledWith(
                process.env.REACT_APP_API_URL + '/list',
                {
                    method: 'DELETE',
                    body: JSON.stringify({
                        listID: 'list_id2',
                    }),
                },
            )
            expect(fetch).toHaveBeenCalledWith(
                process.env.REACT_APP_API_URL + '/listitem',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        listID: 'list_id',
                        listItem: 'New Item',
                    }),
                },
            )
            expect(fetch).toHaveBeenCalledWith(
                process.env.REACT_APP_API_URL + '/listitem',
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        listItem: 'New Name',
                        listItemID: 'id2',
                    }),
                },
            )
            expect(fetch).toHaveBeenCalledWith(
                process.env.REACT_APP_API_URL + '/listitem',
                {
                    method: 'DELETE',
                    body: JSON.stringify({
                        listItemID: 'id1',
                    }),
                },
            )
        })
    })
    describe('revertLists', () => {
        it('revert edited lists', async () => {
            const instance: AbstractInstance = {
                shuffledID: null,
                lists: [
                    {
                        listID: 'list_id',
                        listName: 'Name',
                        listItems: [
                            { listItem: 'Name', listItemID: 'id1' },
                            { listItem: 'Name', listItemID: 'id2' },
                        ],
                        multiplicity: 1,
                    },
                    {
                        listID: 'list_id2',
                        listName: 'Name',
                        listItems: [],
                        multiplicity: 1,
                    },
                    {
                        listID: 'list_id3',
                        listName: 'New List 1',
                        listItems: [],
                        multiplicity: 1,
                        inProgress: true,
                    },
                ],
                shuffled: false,
                shuffleTime: null,
                uniqueInMul: true,
                preset: null,
            }
            fetch.mockResponses(JSON.stringify(instance))
            const adminId = 'admin_id'
            const { result, waitForNextUpdate } = renderHook(() =>
                useInstance(adminId),
            )
            await waitForNextUpdate()
            const editedInstance = {
                ...instance,
                lists: [
                    {
                        listID: 'list_id',
                        listName: 'New Name',
                        listItems: [
                            { listItem: 'New Name', listItemID: 'id2' },
                            { listItem: 'New Item', listItemID: 'id3' },
                        ],
                        multiplicity: 2,
                    },
                    {
                        listID: 'list_id3',
                        listName: 'New List 1',
                        listItems: [],
                        multiplicity: 1,
                        inProgress: true,
                    },
                ],
            }
            act(() => {
                result.current.setInstance(editedInstance)
            })
            act(() => {
                result.current.revertLists()
            })
            await waitForNextUpdate()
            expect(fetch).toHaveBeenCalledWith(
                process.env.REACT_APP_API_URL + '/list',
                {
                    method: 'DELETE',
                    body: JSON.stringify({
                        listID: 'list_id3',
                    }),
                },
            )
        })
    })
})
