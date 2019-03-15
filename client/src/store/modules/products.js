export const namespaced = true;

export const state = {
    items: [],
    fields: [],
    newItems: [],
    url: 'http://localhost:3000/product'
}

export const mutations = {
    UPDATE_DATA: (state, payload) => state.items = payload,
    UPDATE_FIELDS: (state, payload) => state.fields = payload,
}

export const actions = {
    FETCH_DATA: ({ state, commit, rootState }) => {
        commit('CHANGE_STATE', null, { root: true });

        fetch(state.url, {
                headers: new Headers({
                    'Content-Type': 'application/json',
                }),
                method: "POST",
            })
            .then(res => res.json())
            .then(res => {
                const allFields = res.data[0];
                const {id, provider_id = null, ...rest } = allFields;
                
                if (res.data.length === 0) 
                    throw new Error('empty arr')

                commit('UPDATE_DATA', res.data);
                commit('UPDATE_FIELDS', Object.keys(allFields));
                commit('CHANGE_STATE', true, { root: true })
            })
            .catch(err => {
                commit('CHANGE_STATE', false, { root: true })
            })
    }
}