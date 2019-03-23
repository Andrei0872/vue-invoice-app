export const namespaced = true;

export const getters = {
    config: () => ({
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: "POST"
    }),

    mainURL: () => 'http://localhost:3000',
    updateEndpoint: () => '/update',
    deleteEndpoint: () => '/delete'
}

// TODO: make one action to perform the request
export const actions = {
    FETCH_DATA: async ({ getters, rootState, dispatch, commit }, { avoidChangingState = false, anotherEntity = null } = {}) => {
        const moduleName = rootState.currentEntity.slice(0, -1);

        const url = `${getters.mainURL}/${!(anotherEntity) ? rootState.currentEntity : anotherEntity}`;

        try {
            !(avoidChangingState) && commit('CHANGE_STATE', 'pending', { root: true });

            const { data } = await dispatch('makeRequest', { url, config: getters.config })
            
            dispatch(`${!(anotherEntity) ? moduleName : anotherEntity.slice(0, -1)}/setItems`, data, { root: true });
            !(avoidChangingState)  && commit('CHANGE_STATE', true, { root: true });
        } catch {
            commit('CHANGE_STATE', null, { root: true });
        }
    },

    insertItem: async ({ getters, rootState, dispatch },  payload ) => {

        const url = `${getters.mainURL}/${rootState.currentEntity}/insert`
        !!(rootState.selectedProvider) 
            && (payload = { items: payload, provider: rootState.selectedProvider })
        const config = { ...getters.config, body: JSON.stringify(payload) };

        try {
            await dispatch('makeRequest', { url, config });
            
            dispatch("FETCH_DATA", { avoidChangingState: true });
        } catch (err) {
            console.error(err)
        }
    },

    updateItem: async ({ getters, dispatch }, { url, payload }) => {
        url += getters.updateEndpoint;
        const config = { body: JSON.stringify(payload), ...getters.config, method: "PUT" };

        try {
            const response = await dispatch('makeRequest', { url, config });

            console.log(response)
        } catch (err) {
            console.error(err)
        }
    },

    // TODO: update the current entity's module directly
    deleteItem: async ({ getters, dispatch }, { url, payload: id }) => {
        url += getters.deleteEndpoint;
        const config = { body: JSON.stringify({ id }), ...getters.config, method: "DELETE" };

        try {
            const response = await dispatch('makeRequest', { url, config })

            console.log('response', response)
        } catch (err) {
            console.error(err)
        }
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
    // TODO: add parseResponse or smth like that
}