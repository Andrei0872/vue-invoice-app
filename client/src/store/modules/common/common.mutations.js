export const mutations = {
    SET_ITEMS: (state, payload) => state.items = payload,

    ADD_ITEM: (state, { id, ...itemDetails }) => state.items.set(id, itemDetails),

    ADD_NEW_ITEM: (state, payload) => state.newItems.push(payload),

    UPDATE_NEW_DATA: (state, payload) => state.newItems = payload,

    DELETE_ITEM: (state, {
        prop,
        id
    }) => state[prop] = state[prop].filter(item => item.id !== id),

    RESET_ARR: (state, {
        prop
    }) => state[prop] = [],

    TRACK_ITEM: state => state.itemsTracker++,
}