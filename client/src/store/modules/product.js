export const namespaced = true;

export const state = {
    items: [],
    fields: [],
    newItems: [],
    newItemsColumns: [],
    url: 'http://localhost:3000/products'
}

// TODO: remove logic from here and add it to actions
export const mutations = {
    UPDATE_DATA: (state, payload) => state.items = payload,

    UPDATE_NEW_ITEMS_COLUMNS: (state, payload) => state.newItemsColumns = payload,

    UPDATE_NEW_DATA: (state, payload) => state.newItems = payload,
    
    UPDATE_FIELDS: (state, payload) => state.fields = payload,
    
    DELETE_ITEM: (state, { prop, id }) => state[prop] = state[prop].filter(item => item.id !== id),

    RESET_ARR: (state, { prop }) => state[prop] = [],
}

export const actions = {
    fetchData: async ({ state, commit, dispatch }, avoidChangingState = false) => {
        
        !(avoidChangingState) && commit('CHANGE_STATE', 'pending', { root: true });

        try {
            const { data, createColumns = null, readColumns } = await dispatch('api/FETCH_DATA', state.url, { root: true });

            commit('UPDATE_NEW_ITEMS_COLUMNS', createColumns);
            commit('UPDATE_DATA', data);
            commit('UPDATE_FIELDS', readColumns);

            !(avoidChangingState)  && commit('CHANGE_STATE', true, { root: true })
        } catch {
            commit('CHANGE_STATE', null, { root: true })
        }
    },

    addItem: ({ state, commit }, payload) => commit('ADD_ITEM', { state, prop: 'newItems', payload }, { root: true }),

    deleteItem: ({ commit }, payload) => commit('DELETE_ITEM', payload),

    addFieldValue: ({ commit, state }, { rowId, fieldName, value }) => {
        const newItemsCopy = JSON.parse(JSON.stringify(state.newItems))
        let rowIndex = newItemsCopy.findIndex(item => item.id === rowId);

        newItemsCopy[rowIndex][fieldName] = value;

        commit('UPDATE_NEW_DATA', newItemsCopy);
    },

    reset_arr: ({ commit }, payload) => commit('RESET_ARR', payload),

    updateItems: ({ state, commit }, [id, changes]) => {
        const indexRow = state.items.findIndex(item => item.id === id);
        const itemsCopy = JSON.parse(JSON.stringify(state.items))

        itemsCopy[indexRow] = {... itemsCopy[indexRow], ...changes}
        
        commit('UPDATE_DATA', itemsCopy)
    }
}