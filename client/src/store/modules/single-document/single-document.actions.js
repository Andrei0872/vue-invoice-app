export const actions = {
    fetchById: async ({ commit, dispatch, rootGetters, rootState }, id) => {
        const url = `${rootGetters['api/mainURL']}/documents`;
        const config = { ...rootGetters['api/config'], body: JSON.stringify({ id }) };

        const data = await dispatch('api/makeRequest', { url, config }, { root: true });

        const products = rootState.product.items
            .reduce((memo, product) => (memo[product.id] = [product.name, product.comestible], memo), {})

        commit('SET_ID', id);
        commit('SET_ITEMS', data.map(item => ({ ...item, product_name: products[item.product_id][0], isComestible: products[item.product_id][1] })));
    },

    setId: ({ commit }, payload) => commit('SET_ID', payload),

    setChange: ({ commit, state }, { id = null, ...fields }) => {
        if (!id) {
            commit('SET_CHANGES', {});
            return;
        }
        
        // FIXME: do not update if the changes would lead to the same results that are in the fetched data
        const changesObj = JSON.parse(JSON.stringify(state.changes))
        changesObj[id] = { ...changesObj[id], ...fields }

        commit('SET_CHANGES', changesObj);
        commit('SET_PRISTINE_DATA', state.items.find(item => +item.id === +id));
    },

    updateItems: async ({ dispatch, rootState, rootGetters }, payload) => {
        dispatch('setAlreadyFetched', true);

        console.log('updating items!')
        
        const url = `${rootState.mainUrl}documents/update_products`
        const config = {
            ...rootGetters['api/config'], 
            method: "PUT",
            body: JSON.stringify(payload)
        }

        const response = await dispatch("api/makeRequest", { url, config }, { root: true });
        if (rootGetters['dashboard/getUpdateState']) {
            dispatch('dashboard/fetchMainOverview', 'dashboard/overview', { root: true });
        }
        
        await dispatch('api/FETCH_DATA', undefined, { root: true });
        
        return response;
    },

    deleteFromDoc: async ({ dispatch, commit, rootState, rootGetters, state }, id) => {
        const url = `${rootState.mainUrl}documents/delete_from_doc`;
        const config = { ...rootGetters['api/config'], method: "DELETE", body: JSON.stringify({ id, docId: state.currentId }) };
        
        commit('DELETE_ITEM', state.items.find(item => +item.id === +id));

        const dataAfterDeletion = await dispatch('api/makeRequest', { url, config }, { root: true });

        commit('SET_LAST_DELETED_DOC_ID', state.currentId);
        const products = rootState.product.items
            .reduce((memo, product) => (memo[product.id] = product.name, memo), {})

        commit('SET_ITEMS', dataAfterDeletion.map(item => ({ ...item, product_name: products[item.product_id] })));
    },

    updateDocument: async ({ dispatch, state, rootState, rootGetters }, payload) => {
        console.log('updating document!')

        const url = `${rootState.mainUrl}documents/update_document`;
        const config = {
            ...rootGetters['api/config'],
            method: "PUT",
            body: JSON.stringify(payload)
        }

        await dispatch('api/makeRequest', { url, config }, { root: true })
        
        if (!state.alreadyFetched) {
            await dispatch('api/FETCH_DATA', undefined, { root: true });
        } else {
            dispatch('setAlreadyFetched', false);
        }
    },

    setAlreadyFetched: ({ commit }, payload) => commit('SET_ALREADY_FETCHED', payload),

    resetDeletedItems: ({ commit }) => commit('RESET_DELETED_ITEMS'),
}