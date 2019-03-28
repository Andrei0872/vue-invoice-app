export const namespaced = true;

export const state = {
    items: [],
    changes: {},
    currentId: null
}

export const getters = {
    getItemsById: state => state.items.filter(({ document_id }) => document_id === state.currentId),

    getChanges: state => state.changes
}

export const mutations = {
    SET_ITEMS: (state, payload) => state.items.push(...payload),
    
    SET_ID: (state, id) => state.currentId = id,

    SET_CHANGES: (state, payload) => state.changes = payload
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
        
        // FIXME: do not update if the changes would let to the same results that are in the fetched data
        const changesObj = JSON.parse(JSON.stringify(state.changes))
        changesObj[id] = { ...changesObj[id], ...fields }

        commit('SET_CHANGES', changesObj);
    }
}