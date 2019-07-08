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