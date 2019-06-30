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

        itemsCopy[indexRow] = {
            ...itemsCopy[indexRow],
            ...changes
        }

        commit('SET_ITEMS', itemsCopy)
    },

    setItems: ({ commit, dispatch, rootGetters, state }, payload) => {
        payload.forEach(({ id, ...item }) => commit('ADD_ITEM', { id, ...item }))
        commit('TRACK_ITEM');
        console.log(state)

        if (rootGetters['dashboard/getUpdateState']) {
            dispatch('dashboard/fetchMainOverview', 'dashboard/overview', {
                root: true
            });
        }
    },
}