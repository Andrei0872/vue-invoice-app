export const getters = {
    getItemsById: state => state.items.filter(({
        document_id
    }) => document_id === state.currentId),

    getChanges: state => state.changes,

    getPristineData: state => state.pristineData,

    getDeletedItems: state => state.deletedItems,
}