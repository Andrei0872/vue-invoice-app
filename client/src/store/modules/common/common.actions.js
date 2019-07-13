import { convertMapToObjForAPI } from '@/utils/';

export const actions = {

    addCreatedItem: ({ commit }, payload) => {
        commit('ADD_CREATED_ITEM', payload);
        commit('TRACK_CREATED_ITEMS');
    },

    resetCreatedItems: ({ commit }) => {
        commit('RESET_CREATED_ITEMS');
        commit('TRACK_CREATED_ITEMS');
    },

    deleteCreatedItem: ({ commit }, rowId) => {
        commit('DELETE_CREATED_ITEM', rowId);
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
    insertCreatedItems: async ({ dispatch, getters, rootGetters }) => {
        const createdItemsAsArr = getters.getCreatedItemsAsArr;
        const url = rootGetters['getEntityBackendEndpoint'];

        return await dispatch('api/makePOSTRequest', { payload: createdItemsAsArr, url }, { root: true });
    },

    // TODO: add test
    addFieldValue: ({ commit, state }, { rowId, fieldName, value }) => {
        const newCurrentItem = state.createdItems.get(rowId) || {};
        const modifiedItem = { ...newCurrentItem, [fieldName]: value };

        commit('ADD_CREATED_ITEM', { id: rowId, ...modifiedItem });
        commit('TRACK_CREATED_ITEMS');
    },

    updateItem: ({ state, commit }, { id, ...updatedItemDetails }) => {
        const currentUpdatedItem = state.updatedItems.get(id) || {};
                
        const newUpdatedItem = { ...currentUpdatedItem, ...updatedItemDetails };

        commit('ADD_UPDATED_ITEM', { id, ...newUpdatedItem });
        commit('TRACK_UPDATED_ITEMS');
    },

    sendUpdatedItems: async ({ commit, dispatch, state, rootGetters }) => {
        console.log('updating items');
        const url = rootGetters['getEntityBackendEndpoint'];
        const payload = convertMapToObjForAPI(state.updatedItems);
        
        return await dispatch('api/makePUTRequest', {
            url, payload
        }, { root: true });
    },

    resetUpdatedItems: ({ commit }) => {
        commit('RESET_UPDATED_ITEMS');
        commit('TRACK_UPDATED_ITEMS');
    },

    // Deleted
    deleteItem: ({ state, commit }, id) => {
        const deletedItem = state.items.get(id);

        commit('DELETE_ITEM', id);
        commit('TRACK_ITEMS');
        commit('ADD_DELETED_ITEM', { id, ...deletedItem });
        commit('TRACK_DELETED_ITEMS');
    },

    sendDeletedItems: async ({ dispatch, rootGetters, state, rootState }) => {
        console.log('deleting items!');
        const url = rootGetters['getEntityBackendEndpoint'];
        const payload = { deletedItemsIds: [...state.deletedItems.keys()] };

        const response = await dispatch('api/makeDELETERequest', {
            url, payload
        }, { root: true });

        console.log('response: DELETE', response)

        return response;
    },

    resetDeletedItems: ({ commit }) => {
        commit('RESET_DELETED_ITEMS');
        commit('TRACK_DELETED_ITEMS');
    },

    setItems: ({ commit, dispatch }, payload) => {
        dispatch('resetItems');
        
        payload.forEach(({ id, ...item }) => commit('ADD_ITEM', { id, ...item }))
        commit('TRACK_ITEMS');

        // if (rootGetters['dashboard/getUpdateState']) {
        //     dispatch('dashboard/fetchMainOverview', 'dashboard/overview', {
        //         root: true
        //     });
        // }
    },

    sendModifications: async ({ dispatch, state }) => {
        const actionsSend = [];
        
        if (state.updatedItems.size) {
            actionsSend.push(dispatch('sendUpdatedItems'));
        }

        if (state.deletedItems.size) {
            actionsSend.push(dispatch('sendDeletedItems'));
        }

        return await Promise.all(actionsSend);
    },

    // Created Updated Deleted 
    resetCUDItems: ({ dispatch }) => {
        dispatch('resetDeletedItems');
        dispatch('resetUpdatedItems');
        dispatch('resetCreatedItems');
    },

    resetItems: ({ commit }) => {
        commit('RESET_ITEMS');
        commit('TRACK_ITEMS');
    },

    sendHistoryData: async ({ dispatch }, historyData) => {
        dispatch('dashboard/insertHistoryRow', historyData, { root: true });
    },
}