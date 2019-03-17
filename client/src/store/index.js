import Vue from 'vue'
import Vuex from 'vuex'

import * as product from './modules/product';
import * as document from './modules/document';
import * as provider from './modules/provider';
import * as api from './modules/api';

Vue.use(Vuex)

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    
    state: {
        everythingReady: null,
        currentEntity: null
    },

    getters: {
        getEntityNewItems: state => {
            const entityName = state.currentEntity.slice(0, -1)

            return state[entityName].newItems
        }
    },

    mutations: {
        CHANGE_STATE: (state, payload) => state.everythingReady = payload,
        ADD_ITEM: (_, { state, prop, payload }) => state[prop].push(payload),
        CHANGE_ENTITY: (state, payload) => state.currentEntity = payload
    },

    actions: {
        changeEntity: ({ commit }, payload) => commit('CHANGE_ENTITY', payload)
    },

    modules: {
        product,
        api,
        document,
        provider,
    }
})
