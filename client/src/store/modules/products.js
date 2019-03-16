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
    
    DELETE_ITEM: (state, { prop, id }) => state[prop] = state[prop].filter(item => item.id !== id),

    ADD_FIELD_VALUE: (state, { rowId, fieldName, value }) => {
        let row = state.newItems.find(item => item.id === rowId);
        row[fieldName] = value;
    },

    RESET_ARR: (state, { prop }) => state[prop] = []
}

export const actions = {
    FETCH_DATA: ({ state, commit }) => {
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
                commit('UPDATE_FIELDS', Object.keys(rest));
                commit('CHANGE_STATE', true, { root: true })
            })
            .catch(err => {
                commit('CHANGE_STATE', false, { root: true })
            })
    },

    ADD_ITEM: ({ state, commit }, payload) => commit('ADD_ITEM', { state, prop: 'newItems', payload }, { root: true }),

    DELETE_ITEM: ({ commit }, payload) => commit('DELETE_ITEM', payload),

    ADD_FIELD_VALUE: ({ commit }, payload) => commit('ADD_FIELD_VALUE', payload),

    RESET_ARR: ({ commit }, payload) => commit('RESET_ARR', payload),
}