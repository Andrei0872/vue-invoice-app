export const namespaced = true;

export const state = () => ({
    items: [],
    newItems: [],
})

export const mutations = {
    SET_ITEMS: (state, payload) => state.items = payload,

    ADD_NEW_ITEM: (state, payload) => state.newItems.push(payload),

    UPDATE_NEW_DATA: (state, payload) => state.newItems = payload,
    
    DELETE_ITEM: (state, { prop, id }) => state[prop] = state[prop].filter(item => item.id !== id),

    RESET_ARR: (state, { prop }) => state[prop] = [],
}

export const actions = {

    addNewItem: ({ commit }, payload) => commit('ADD_NEW_ITEM', payload),

    deleteItem: ({ commit }, payload) => commit('DELETE_ITEM', payload),

    addFieldValue: ({ commit, state }, { rowId, fieldName, value }) => {
        const newItemsCopy = JSON.parse(JSON.stringify(state.newItems))
        let rowIndex = newItemsCopy.findIndex(item => item.id === rowId);
        
        newItemsCopy[rowIndex][fieldName] = value;

        commit('UPDATE_NEW_DATA', newItemsCopy);
    },

    resetArr: ({ commit }, payload) => commit('RESET_ARR', payload),

    updateItems: ({ state, commit }, { id, ...changes }) => {
        const indexRow = state.items.findIndex(item => item.id === id);
        const itemsCopy = JSON.parse(JSON.stringify(state.items))

        itemsCopy[indexRow] = {... itemsCopy[indexRow], ...changes}
        
        commit('SET_ITEMS', itemsCopy)
    }, 

    setItems: ({ commit }, payload) => commit('SET_ITEMS', payload),
}