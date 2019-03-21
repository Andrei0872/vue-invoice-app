export const namespaced = true;

export const getters = {
    config: () => ({
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: "POST"
    }),

    updateEndpoint: () => '/update',
    deleteEndpoint: () => '/delete'
}

// TODO: make one action to perform the request
export const actions = {
    FETCH_DATA: ({ getters }, url) => {
        return new Promise(async (resolve, reject) => {
            try {
                const initialResponse = await fetch(url, getters.config);

                if (!initialResponse.ok)
                    throw initialResponse
                
                resolve((await initialResponse.json()))
            } catch (err) {
                reject(err)
            }
        });
    },

    insertItem: ({ getters }, { url, payload }) => {
        return new Promise(async (resolve, reject) => {
            try {
                
                const initialResponse = await fetch(url, { ...getters.config, body: JSON.stringify(payload) });

                if (!initialResponse.ok)
                    throw initialResponse

                resolve((await initialResponse.json()))
            } catch (err) {
                reject(err)
            }
        })
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