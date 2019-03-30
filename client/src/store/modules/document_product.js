export const namespaced = true;

export const state = {
    items: [],
    changes: {},
    currentId: null,
    alreadyFetched: false
}

export const getters = {
    getItemsById: state => state.items.filter(({ document_id }) => document_id === state.currentId),

    getChanges: state => state.changes
}

export const mutations = {
    SET_ITEMS: (state, payload) => state.items = payload,
    
    SET_ID: (state, id) => state.currentId = id,

    SET_CHANGES: (state, payload) => state.changes = payload,

    SET_ALREADY_FETCHED: (state, payload) => state.alreadyFetched = payload
}

export const actions = {
    fetchById: async ({ commit, dispatch, rootGetters, rootState }, id) => {
        const url = `${rootGetters['api/mainURL']}/documents`;
        const config = { ...rootGetters['api/config'], body: JSON.stringify({ id }) };

        const data = await dispatch('api/makeRequest', { url, config }, { root: true });

        const products = rootState.product.items
            .reduce((memo, product) => (memo[product.id] = product.name, memo), {})


        commit('SET_ID', id);
        commit('SET_ITEMS', data.map(item => ({ ...item, product_name: products[item.product_id] })));
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
        
        await dispatch('api/FETCH_DATA', undefined, { root: true });
        
        return response;
    },

    // TODO: add subscribeAction
    deleteFromDoc: async ({ dispatch, rootState, rootGetters, state }, id) => {
        const url = `${rootState.mainUrl}documents/delete_from_doc`;
        const config = { ...rootGetters['api/config'], method: "DELETE", body: JSON.stringify({ id, docId: state.currentId }) };
        
        const dataAfterDeletion = await dispatch('api/makeRequest', { url, config }, { root: true });

        console.log(dataAfterDeletion || 'nope')
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

    setAlreadyFetched: ({ commit }, payload) => commit('SET_ALREADY_FETCHED', payload)
}