export const actions = {

    addCreatedItem: ({ commit }, payload) => {
        commit('ADD_CREATED_ITEM', payload);
        commit('TRACK_CREATED_ITEMS');
    },

    resetCreatedItems: ({ commit }) => {
        commit('RESET_CREATED_ITEMS');
        commit('TRACK_CREATED_ITEMS');
    },


    /**
     * TODO: improvement
     * receive the new inserted row ids from the BE,
     * and append them to the existing items
     * 
     * Current behavior:
     * after items are inserted, **another** request is made to fetch again 
     * all the existing items;
     */
    insertCreatedItems: ({ dispatch, getters, rootGetters }) => {
        const createdItemsAsArr = getters.getCreatedItemsAsArr;
        const createItemsWithoutId = createdItemsAsArr.map(({ id, ...rest }) => rest);
        const entityNameSingularForm = rootGetters['getEntityNameSingularForm'];
        const entityNamePluralForm = rootGetters['getEntityNamePluralForm'];

        return dispatch('api/insertItem', createdItemsAsArr, { root: true })
            .then(() => {
                
                const message = `Add new ${createdItemsAsArr.length === 1 ? entityNameSingularForm : entityNamePluralForm}`;
                
                dispatch('dashboard/insertHistoryRow', {
                    entity: entityNamePluralForm, 
                    message, 
                    action_type: 'insert',
                    current_state: JSON.stringify(createItemsWithoutId),
                }, { root: true });
            })
    },

    // TODO: add test
    addFieldValue: ({ commit, state }, { rowId, fieldName, value }) => {
        const newCurrentItem = state.createdItems.get(rowId) || {};
        const modifiedItem = { ...newCurrentItem, [fieldName]: value };

        commit('ADD_CREATED_ITEM', { id: rowId, ...modifiedItem });
        commit('TRACK_CREATED_ITEMS');
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