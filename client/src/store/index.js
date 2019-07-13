import Vue from 'vue'
import Vuex from 'vuex'

import * as api from './modules/api';
import * as singleDocument from './modules/single-document/';
import * as dashboard from './modules/dashboard/';

Vue.use(Vuex)

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    
    state: {
        everythingReady: null,
        currentEntity: null,
        selectedProvider: null,
        // FIXME: use the URL from api/getters
        mainUrl: 'http://localhost:3000/api/'
    },

    getters: {
        getEntityName: state => state.currentEntity.slice(0, -1),

        getEntityNameSingularForm: state => state.currentEntity.slice(0, -1),

        getEntityNamePluralForm: state => state.currentEntity,

        getEntityBackendEndpoint: state => state.mainUrl + state.currentEntity,

        getEntityNewItems: state => {
            const entityName = state.currentEntity.slice(0, -1)
            
            if (state[entityName]) 
                return state[entityName].newItems
        },

        getEntityItems: (state, getters, rootState, rootGetters) => {
            // return state[getters.getEntityName].items

            return rootGetters[`${getters.getEntityName}/getItemsAsArr`];
        },

        hasDocumentRegistered: (state, getters, rootState) => !!rootState['document']
    },

    mutations: {
        CHANGE_STATE: (state, payload) => state.everythingReady = payload,
        
        ADD_ITEM: (_, { state, prop, payload }) => state[prop].push(payload),

        CHANGE_ENTITY: (state, payload) => state.currentEntity = payload,

        SET_PROVIDER: (state, payload) => state.selectedProvider = payload,

        SET_PROVIDER_INVOICE_NR: (state, payload) => state.selectedProvider = { ...state.selectedProvider, invoiceNr: payload },
    },

    actions: {
        changeEntity: ({ commit }, payload) => commit('CHANGE_ENTITY', payload),
    },

    modules: {
        api,
        singleDocument,
        dashboard
    }
});

export default store;