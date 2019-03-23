import Vue from 'vue'
import Vuex from 'vuex'

import * as api from './modules/api';

Vue.use(Vuex)

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    
    state: {
        everythingReady: null,
        currentEntity: null,
        selectedProvider: null,
        mainUrl: 'http://localhost:3000/',
    },

    getters: {
        getEntityNewItems: state => {
            const entityName = state.currentEntity.slice(0, -1)
            
            if (state[entityName]) 
                return state[entityName].newItems
        },
    },

    mutations: {
        CHANGE_STATE: (state, payload) => state.everythingReady = payload,
        ADD_ITEM: (_, { state, prop, payload }) => state[prop].push(payload),
        CHANGE_ENTITY: (state, payload) => state.currentEntity = payload,
        SET_PROVIDER: (state, payload) => state.selectedProvider = payload
    },

    actions: {
        changeEntity: ({ commit }, payload) => commit('CHANGE_ENTITY', payload),
    },

    modules: {
        api,
        // document,
    }
});

// Every time the user updates an item, changes the values locally, but also make a db call to have the new results on refresh etc..
// TODO: refactor a little bit
store.subscribeAction(action => {
    const currentEntity = store.state.currentEntity && store.state.currentEntity.slice(0, -1) || null

    if (currentEntity && action.type === `${currentEntity}/updateItems`) {
        
        const data = {
            url: `${store.state.mainUrl}${currentEntity}s`,
            payload: action.payload
        }

        store.dispatch(`api/updateItem`, data)
    } else if (action.type === `${currentEntity}/deleteItem` && action.payload.prop === 'items') {
        
        const data = {
            url: `${store.state.mainUrl}${currentEntity}s`,
            payload: action.payload.id
        }

        store.dispatch('api/deleteItem', data);
    }
})

export default store;