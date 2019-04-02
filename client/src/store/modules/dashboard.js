export const namespaced = true;

export const state = {
    ['dashboard/overview']: {},
    vat: [],
    history: []
}

export const getters = {
    getEndpoints: () => ['dashboard/overview', 'vat', 'history'],
}

export const mutations = {
    SET_PROP_DATA: (state, { stateProp, payload }) => state[stateProp] = payload
}

export const actions = {
    fetchMainOverview: async ({ dispatch, commit, getters, rootGetters }) => {
        const mainUrl = rootGetters['api/mainURL'];
        const reqConfig = { ...rootGetters['api/headers'], method: "GET"};
        const endpoints = getters.getEndpoints;

        (await Promise.all(
            endpoints.map(
                endpoint => dispatch('api/makeRequest', { config: reqConfig, url: `${mainUrl}/${endpoint}` }, { root: true })
            )
        )).forEach(({ data }, index) => commit('SET_PROP_DATA', { stateProp: endpoints[index], payload: data }))

    }
}