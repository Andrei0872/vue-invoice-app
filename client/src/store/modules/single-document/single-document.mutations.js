export const mutations = {
    SET_ITEMS: (state, payload) => state.items = payload,

    SET_ID: (state, id) => state.currentId = id,

    SET_CHANGES: (state, payload) => state.changes = payload,

    SET_ALREADY_FETCHED: (state, payload) => state.alreadyFetched = payload,

    SET_LAST_DELETED_DOC_ID: (state, payload) => state.lastDeletedDocId = payload,

    SET_PRISTINE_DATA: (state, {
        id,
        ...fields
    }) => state.pristineData.set(id, fields),

    RESET_ITEMS: state => state.items = [],

    DELETE_ITEM: (state, payload) => state.deletedItems.push(payload),

    RESET_DELETED_ITEMS: state => state.deletedItems.length = 0
}
