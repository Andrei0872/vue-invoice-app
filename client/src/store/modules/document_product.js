export const namespaced = true;

export const state = {
    items: [],
    currentId: null
}

export const getters = {
    getItemsById: state => state.items.filter(({ document_id }) => document_id === state.currentId)
}

export const mutations = {
    SET_ITEMS: (state, payload) => { state.items.push(...payload); console.log(state.items) },
    
    SET_ID: (state, id) => state.currentId = id
}

export const actions = {
    fetchById: async ({ commit, dispatch, rootGetters }, id) => {
        const url = `${rootGetters['api/mainURL']}/documents`;
        const config = { ...rootGetters['api/config'], body: JSON.stringify({ id }) };

        const data = await dispatch('api/makeRequest', { url, config }, { root: true });

        commit('SET_ID', id);
        commit('SET_ITEMS', data);
    },

    setId: ({ commit }, payload) => commit('SET_ID', payload)
}