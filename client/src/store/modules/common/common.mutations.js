export const mutations = {
    SET_ITEMS: (state, payload) => state.items = payload,

    ADD_ITEM: (state, { id, ...itemDetails }) => state.items.set(id, itemDetails),

    ADD_CREATED_ITEM: (state, { id, ...newItemDetails }) => state.createdItems.set(id, newItemDetails),


    UPDATE_NEW_DATA: (state, payload) => state.newItems = payload,

    DELETE_ITEM: (state, {
        prop,
        id
    }) => state[prop] = state[prop].filter(item => item.id !== id),

    RESET_ARR: (state, {
        prop
    }) => state[prop] = [],

    RESET_CREATED_ITEMS: state => state.createdItems.clear(),

    DELETE_CREATED_ITEM: (state, rowId) => state.createdItems.delete(rowId),

    TRACK_CREATED_ITEMS: state => state.createdItemsTracker++,

    TRACK_ITEMS: state => state.itemsTracker++,

}