export const namespaced = true;

export const getters = {
    config: () => ({
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: "POST"
    }),
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
    }
}