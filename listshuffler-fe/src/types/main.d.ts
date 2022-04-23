type Preset = 'christmas' | undefined

export type AbstractListItem = { listItem: string; listItemID: string }

export type AbstractList = {
    listID: string
    listName: string
    multiplicity: number
    inProgress?: boolean
    listItems: Array<AbstractListItem>
}

export type AbstractInstance = {
    lists: Array<AbstractList>
    shuffled: boolean
    shuffledID: string
    uniqueInMul: boolean
    preset: Preset
    shuffleTime: string | null
}
