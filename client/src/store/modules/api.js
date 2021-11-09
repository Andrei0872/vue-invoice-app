export const namespaced = true;

const API_URL = process.env.VUE_APP_API_URL;

let isExchanging = false;
const requestsToRemake = [];

export const getters = {
    config: (state, getters, rootState) => ({
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-access-token': rootState.user.currentUser ? rootState.user.currentUser.token : '',
        }),
        method: "POST"
    }),

    accessToken: (state, getters, rootState) => rootState.user.currentUser ? rootState.user.currentUser.token : '',

    mainURL: () => `${API_URL}/api`,
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

    makeGETRequest: async ({ dispatch, getters }, { url, entity = null }) => {
        try {
            // !(avoidChangingState) && commit('CHANGE_STATE', 'pending', { root: true });

            const config = {
                ...getters.config, 
                method: "GET",
            };

            const { data } = await dispatch('makeRequest', { url, config });

            if (entity) 
                return dispatch(`${entity}/setItems`, data, { root: true });

            return data;
        } catch (err) {
            console.error(err);
            // commit('CHANGE_STATE', null, { root: true });
        }
    },

    makePOSTRequest: async ({ getters, rootState, dispatch },  { url, payload } ) => {
        if (rootState.selectedProvider) {
            payload = {
                items: payload,
                provider: rootState.selectedProvider
            };
        }

        const config = { 
            ...getters.config, 
            body: JSON.stringify(payload) 
        };

        try {
            return await dispatch('makeRequest', { url, config });
        } catch (err) {
            console.error(err)
            return { err };
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
    },

    makeRequest: ({ getters, rootState, dispatch, commit }, { url, config }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const initialResponse = await fetch(url, config);

                if (!initialResponse.ok)
                    throw initialResponse;
                
                resolve((await initialResponse.json()))
            } catch (err) {
                const isExchangingRequest = url.includes('token');
                if (!isExchangingRequest && err.status === 401) {
                    // The current request has failed with a `401` error, so we want to batch
                    // these requests until we get a new access token.
                    requestsToRemake.push({
                        resolve,
                        reject,
                        url,
                        config,
                    });
                }
                
                // Because the request that exchanges the refresh token for a new access token makes
                // use of `makeRequest` too, we want to make sure that the `/token` call is made only once.
                // Scenario: in the dashboard view, there are 4 requests that must be made. Previously to this change,
                // the request to `/token` would be made 4 times, assuming the access token has expired.
                const needsNewAccessToken = err.status === 401 && !isExchangingRequest && !isExchanging;
                if (needsNewAccessToken) {
                    isExchanging = true;

                    const url = `${getters.mainURL}/token`;
                    const { refreshToken, id } = rootState.user.currentUser || {};
                    const config = {
                        method: 'POST',
                        headers: new Headers({
                            'x-refresh-token': refreshToken,
                            'content-type': 'application/json'
                        }),
                        body: JSON.stringify({ id }),
                    };

                    try {
                        const updatedUserInfo = await dispatch('makeRequest', { url, config });
                        
                        // Save the new changes in LS.
                        commit('user/SET_USER', updatedUserInfo, { root: true });
                        isExchanging = false;

                        // Now that we have a new access token, we remake the batched requests.
                        await Promise.all(
                            requestsToRemake.map(
                                ({ url, config, ...r }) => {
                                    config.headers.set('x-access-token', getters.accessToken);
                                    return dispatch('makeRequest', { url, config }).then(r.resolve).catch(r.reject);
                                }
                            )
                        );
                        requestsToRemake.length = 0;
                    } catch {
                    }
                } else if (isExchangingRequest) {
                    // For `/token` requests, we want to actually reject, so that we know it's time
                    // to log out. For the other requests, we simply store the `resolve` and `reject`
                    // callback functions in the array responsible for batching the requests.
                    reject(err);
                }
            }
        });
    },
}