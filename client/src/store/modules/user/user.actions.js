export const actions = {
    attemptRegister: async ({ state, rootState, dispatch, commit }, payload) => {
        console.log('attempt register')
        
        const url = rootState.mainUrl + state.userUrl + 'register';

        const response = await dispatch('api/makePOSTRequest', { url, payload }, { root: true }
        );

        console.log('response', response)

        if (response.err) {
            console.log('err');

            return false;
        }

        commit('SET_USER', response);
        return true;
    },

    attemptLogin: async ({ state, rootState, dispatch, commit }, payload) => {
        const url = rootState.mainUrl + state.userUrl + 'login';

        const response = await dispatch('api/makePOSTRequest', { url, payload }, { root: true }
        );

        console.log('response', response)

        if (response.err) {
            console.log('err');

            return false;
        }

        commit('SET_USER', response);
        return true;
    },

    logout: ({ commit }) => {
        commit('SET_USER', null);
    }
};