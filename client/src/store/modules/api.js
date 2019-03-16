export const namespaced = true;

export const getters = {
    config: () => ({
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: "POST"
    })
}

export const actions = {
    FETCH_DATA: ({ commit, getters }, url) => {
        return new Promise(async (resolve, reject) => {
            try {
                const initialResponse = await fetch(url, getters.config);

                if (!initialResponse.ok)
                    throw initialResponse
                
                resolve((await initialResponse.json()))
            } catch (err) {
                reject((await err.text()))
            }
        });
    }
}