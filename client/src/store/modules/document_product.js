export const namespaced = true;

export const state = {
    items: [],
    currentId: null
}

export const getters = {
    getItemsById: state => state.items.filter(({ document_id }) => document_id === state.currentId),
}

export const mutations = {
    SET_ITEMS: (state, payload) => state.items.push(...payload),
    
    SET_ID: (state, id) => state.currentId = id,
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

    setId: ({ commit }, payload) => commit('SET_ID', payload)
}