export const namespaced = true;

export const state = {
    ['dashboard/overview']: {},
    vat: {},
    history: [],
    needsUpdate: false
}

export const getters = {
    getEndpoints: () => ['dashboard/overview', 'vat', 'history'],

    getUpdateState: state => state.needsUpdate
}

export const mutations = {
    SET_PROP_DATA: (state, { stateProp, payload }) => state[stateProp] = payload,

    SET_NEW_VAT: (state, payload) => state.vat = payload,

    SET_UPDATE_STATE: (state, payload) => state.needsUpdate = payload
}

export const actions = {
    fetchMainOverview: async ({ dispatch, commit, getters, rootGetters }, endpoint = null) => {
        const mainUrl = rootGetters['api/mainURL'];
        const reqConfig = { ...rootGetters['api/headers'], method: "GET"};
        const endpoints = getters.getEndpoints;

        if (endpoint === null) {
            (await Promise.all(
                endpoints.map(
                    endpoint => dispatch('api/makeRequest', { config: reqConfig, url: `${mainUrl}/${endpoint}` }, { root: true })
                )
            )).forEach(({ data }, index) => commit('SET_PROP_DATA', { stateProp: endpoints[index], payload: index !== 1 && data || data[0] }));
        } else {
            const { data } = await dispatch('api/makeRequest', { config: reqConfig, url: `${mainUrl}/${endpoint}` }, { root: true });
            commit('SET_PROP_DATA', { stateProp: endpoint, payload: data });
            commit('SET_UPDATE_STATE', !getters.getUpdateState)
        }

    },

    setNewVat: ({ commit, state }, { type, value }) => {
        const copyVat = { ...state.vat };
        copyVat[type] = value;
        
        console.log(copyVat)
        commit('SET_NEW_VAT', copyVat);
    }
}