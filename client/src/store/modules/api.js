export const namespaced = true;

export const getters = {
    config: () => ({
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: "POST"
    }),

    mainURL: () => 'http://localhost:3000/api',
    updateEndpoint: () => '/update',
    deleteEndpoint: () => '/delete'
}

export const actions = {
    FETCH_DATA: async ({ getters, rootState, dispatch, commit }, { avoidChangingState = false, anotherEntity = null } = {}) => {
        const moduleName = rootState.currentEntity.slice(0, -1);

        const url = `${getters.mainURL}/${!(anotherEntity) ? rootState.currentEntity : anotherEntity}`;

        try {
            !(avoidChangingState) && commit('CHANGE_STATE', 'pending', { root: true });

            const { data } = await dispatch('makeRequest', { url, config: { ...getters.config, method: "GET" } })
            
            console.log(data)
            dispatch(`${!(anotherEntity) ? moduleName : anotherEntity.slice(0, -1)}/setItems`, data, { root: true });
            !(avoidChangingState)  && commit('CHANGE_STATE', true, { root: true });
        } catch {
            commit('CHANGE_STATE', null, { root: true });
        }
    },

    makeGETRequest: async ({ dispatch }, { url, entity = null }) => {
        try {
            // !(avoidChangingState) && commit('CHANGE_STATE', 'pending', { root: true });

            const config = {
                ...getters.config, 
                method: "GET",
            };

            const { data } = await dispatch('makeRequest', { url, config });

            dispatch(`${entity}/setItems`, data, { root: true });

            console.log('data fetched', data);

        } catch (err) {
            console.error(err);
            // commit('CHANGE_STATE', null, { root: true });
        }
    },

    makePOSTRequest: async ({ getters, rootState, dispatch },  { url, payload } ) => {

        !!(rootState.selectedProvider) 
            && (payload = { items: payload, provider: rootState.selectedProvider });
            
        const config = { 
            ...getters.config, 
            body: JSON.stringify(payload) 
        };

        try {
            return await dispatch('makeRequest', { url, config });
        } catch (err) {
            console.error(err)
        }
    },

    makePUTRequest: async ({ getters, dispatch }, { url, payload }) => {
        const config = { 
            body: JSON.stringify(payload), 
            ...getters.config, 
            method: "PUT",
        };

        return await dispatch('makeRequest', { url, config });
    },

    makeDELETERequest: async ({ getters, dispatch, commit }, { url, payload }) => {

        const config = { 
            body: JSON.stringify(payload), 
            ...getters.config, 
            method: "DELETE" 
        };


        return await dispatch('makeRequest', { url, config });

        // try {
        //     const response = await dispatch('makeRequest', { url, config })

        //     // Update data from Dashboard
        //     dispatch('dashboard/fetchMainOverview', 'dashboard/overview', { root: true });
        //     commit('dashboard/SET_UPDATE_STATE', false, { root: true });
            
        //     return response
        // } catch (err) {
        //     console.error(err)
        // }
    },

    makeRequest: (_, { url, config }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const initialResponse = await fetch(url, config);

                if (!initialResponse.ok)
                    throw initialResponse;
                
                resolve((await initialResponse.json()))
            } catch (err) {
                reject(err);
            }
        });
    },
}