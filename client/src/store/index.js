import Vue from 'vue'
import Vuex from 'vuex'

import * as product from './modules/products';
import * as api from './modules/api';

Vue.use(Vuex)

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    
    state: {
        everythingReady: null,
    },
    mutations: {
        CHANGE_STATE: (state, payload) => state.everythingReady = payload,
        ADD_ITEM: (_, { state, prop, payload }) => state[prop].push(payload)
    },
    actions: {

    },

    modules: {
        product,
        api
    }
})
