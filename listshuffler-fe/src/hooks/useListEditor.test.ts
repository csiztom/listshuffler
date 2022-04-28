import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-dom/test-utils'
import { AbstractList } from '../types/main'
import useListEditor from './useListEditor'

describe('useListEditor', () => {
    describe('addListItem', () => {
        it('adds first listitem', () => {
            let lists: AbstractList[] = [
                {
                    listID: 'abcdef',
                    listItems: [],
                    listName: 'Name',
                    multiplicity: 1,
                },
            ]
            const setLists = (li: AbstractList[]) => (lists = li)
            const { result } = renderHook(() => useListEditor(lists, setLists))
            expect(lists[0].listItems.length).toBe(0)
            act(() => {
                result.current.addListItem(lists[0])
            })
            expect(lists[0].listItems.length).toBe(1)
            expect(lists[0].listItems).toContainEqual({
                listItem: '',
                listItemID: 'editing0',
            })
        })
        it('adds second listitem', () => {
            let lists: AbstractList[] = [
                {
                    listID: '',
                    listItems: [{ listItem: 'Name', listItemID: 'abcdefg' }],
                    listName: 'Name',
                    multiplicity: 1,
                },
            ]
            const setLists = (li: AbstractList[]) => (lists = li)
            const { result } = renderHook(() => useListEditor(lists, setLists))
            expect(lists[0].listItems.length).toBe(1)
            act(() => {
                result.current.addListItem(lists[0])
            })
            expect(lists[0].listItems.length).toBe(2)
            expect(lists[0].listItems).toContainEqual({
                listItem: '',
                listItemID: 'editing0',
            })
        })
        it('adds two listitems', () => {
            let lists: AbstractList[] = [
                {
                    listID: 'abcdef',
                    listItems: [],
                    listName: 'Name',
                    multiplicity: 1,
                },
            ]
            const setLists = (li: AbstractList[]) => (lists = li)
            const { result } = renderHook(() => useListEditor(lists, setLists))
            expect(lists[0].listItems.length).toBe(0)
            act(() => {
                result.current.addListItem(lists[0])
            })
            act(() => {
                result.current.addListItem(lists[0])
            })
            expect(lists[0].listItems.length).toBe(2)
            expect(lists[0].listItems).toContainEqual({
                listItem: '',
                listItemID: 'editing0',
            })
            expect(lists[0].listItems).toContainEqual({
                listItem: '',
                listItemID: 'editing1',
            })
        })
    })
    describe('editList', () => {
        it('renames list', () => {
            let lists: AbstractList[] = [
                {
                    listID: 'abcdef',
                    listItems: [],
                    listName: 'Name',
                    multiplicity: 1,
                },
            ]
            const setLists = (li: AbstractList[]) => (lists = li)
            const { result } = renderHook(() => useListEditor(lists, setLists))
            expect(lists[0].listName).toBe('Name')
            act(() => {
                result.current.editList({ ...lists[0], listName: 'Hello' })
            })
            expect(lists[0].listName).toBe('Hello')
        })
        it('change multiplicity', () => {
            let lists: AbstractList[] = [
                {
                    listID: 'abcdef',
                    listItems: [],
                    listName: 'Name',
                    multiplicity: 1,
                },
            ]
            const setLists = (li: AbstractList[]) => (lists = li)
            const { result } = renderHook(() => useListEditor(lists, setLists))
            expect(lists[0].listName).toBe('Name')
            act(() => {
                result.current.editList({ ...lists[0], multiplicity: 2 })
            })
            expect(lists[0].multiplicity).toBe(2)
        })
    })
    describe('editListItem', () => {
        it('renames listitem', () => {
            let lists: AbstractList[] = [
                {
                    listID: 'abcdef',
                    listItems: [],
                    listName: 'Name',
                    multiplicity: 1,
                },
            ]
            const setLists = (li: AbstractList[]) => (lists = li)
            const { result } = renderHook(() => useListEditor(lists, setLists))
            expect(lists[0].listName).toBe('Name')
            act(() => {
                result.current.editList({ ...lists[0], listName: 'Hello' })
            })
            expect(lists[0].listName).toBe('Hello')
        })
    })
    describe('deleteListItem', () => {
        it('deletes listitem', () => {
            let lists: AbstractList[] = [
                {
                    listID: 'abcdef',
                    listItems: [{ listItem: 'Name', listItemID: 'abcdefg' }],
                    listName: 'Name',
                    multiplicity: 1,
                },
            ]
            const setLists = (li: AbstractList[]) => (lists = li)
            const { result } = renderHook(() => useListEditor(lists, setLists))
            expect(lists[0].listItems.length).toBe(1)
            act(() => {
                result.current.deleteListItem(lists[0], lists[0].listItems[0])
            })
            expect(lists[0].listItems.length).toBe(0)
        })
    })
    describe('deleteList', () => {
        it('deletes list', () => {
            let lists: AbstractList[] = [
                {
                    listID: 'abcdef',
                    listItems: [],
                    listName: 'Name',
                    multiplicity: 1,
                },
            ]
            const setLists = (li: AbstractList[]) => (lists = li)
            const { result } = renderHook(() => useListEditor(lists, setLists))
            expect(lists.length).toBe(1)
            act(() => {
                result.current.deleteList(lists[0])
            })
            expect(lists.length).toBe(0)
        })
    })
})
