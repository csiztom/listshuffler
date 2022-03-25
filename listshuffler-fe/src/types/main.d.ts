export type AbstractListItem = { listItem: string; listItemID: string }

export type AbstractList = {
    listID: string
    listName: string
    listItems: Array<AbstractListItem>
}

export type AbstractInstance = {
    lists: Array<AbstractList>
}
