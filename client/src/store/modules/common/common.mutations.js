export const mutations = {
    SET_ITEMS: (state, payload) => state.items = payload,

    ADD_ITEM: (state, { id, ...itemDetails }) => state.items.set(id, itemDetails),

    ADD_CREATED_ITEM: (state, { id, ...newItemDetails }) => state.createdItems.set(id, newItemDetails),

    ADD_UPDATED_ITEM: (state, { id, ...newUpdatedItemDetails }) => state.updatedItems.set(id, newUpdatedItemDetails),

    ADD_DELETED_ITEM: (state, { id, ...deletedItemDetails }) => state.deletedItems.set(id, deletedItemDetails),

    DELETE_ITEM: (state, id) => {
        state.items.delete(id);
    },

    UPDATE_NEW_DATA: (state, payload) => state.newItems = payload,

    // DELETE_ITEM: (state, {
    //     prop,
    //     id
    // }) => state[prop] = state[prop].filter(item => item.id !== id),

    RESET_ARR: (state, {
        prop
    }) => state[prop] = [],

    RESET_CREATED_ITEMS: state => state.createdItems.clear(),

    DELETE_CREATED_ITEM: (state, rowId) => state.createdItems.delete(rowId),

    RESET_DELETED_ITEMS: state => state.deletedItems.clear(),

    TRACK_CREATED_ITEMS: state => state.createdItemsTracker++,

    TRACK_ITEMS: state => state.itemsTracker++,

    RESET_ITEMS: state => state.items.clear(),

    TRACK_UPDATED_ITEMS: state => state.updatedItemsTracker++,

    RESET_UPDATED_ITEMS: state => state.updatedItems.clear(),

    TRACK_DELETED_ITEMS: state => state.deletedItemsTracker++,
}