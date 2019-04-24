export const namespaced = true;

export const state = {
    ['dashboard/overview']: {},
    vat: {},
    history: [],
    needsUpdate: false,
    isInit: false,
    // Used to identify which documents no longer exist
    documentIds: null,
}

export const getters = {
    getEndpoints: () => ['dashboard/overview', 'vat', 'history'],

    getUpdateState: state => state.needsUpdate,

    getCurrentVat: state => state.vat,

    getHistoryLen: state => state.history.length,

    needsInit: state => !state.isInit,

    getDocumentsLen: (state, getters, rootState) => rootState['document'] ? rootState['document'].items.length : null
}

export const mutations = {
    SET_PROP_DATA: (state, { stateProp, payload }) => state[stateProp] = payload,

    SET_NEW_VAT: (state, payload) => state.vat = payload,

    SET_UPDATE_STATE: (state, payload) => state.needsUpdate = payload,

    SET_INIT_FALSE: state => state.isInit = true,

    ADD_DOCUMENT_IDS: (state, payload) => state.documentIds = new Map(payload)
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

            commit('SET_INIT_FALSE');
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
    },

    // When any VAT values has changed, recompute the columns(i.e buy_price, sell_price)
    // depending on the new values that have been provided
    updateDocVat: async ({ dispatch, rootGetters }, payload) => {
        
        const url = `${rootGetters['api/mainURL']}/documents/update_document_vat`
        const config = {
            ...rootGetters['api/config'], 
            method: "PUT",
            body: JSON.stringify(payload)
        }

        return await dispatch("api/makeRequest", { url, config }, { root: true });
    },

    insertHistoryRow: async ({ dispatch, rootGetters }, payload) => {
        const url = `${rootGetters['api/mainURL']}/history/insert`;
        const config = {
            ...rootGetters['api/config'],
            body: JSON.stringify(payload)
        }

        await dispatch('api/makeRequest', { url, config }, { root: true })

        await dispatch('dashboard/fetchMainOverview', 'history', { root: true });
    }
}