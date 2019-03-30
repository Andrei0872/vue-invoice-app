import Vue from 'vue'
import Vuex from 'vuex'

import * as api from './modules/api';
import * as document_product from './modules/document_product';

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
        getEntityName: state => state.currentEntity.slice(0, -1),

        getEntityNewItems: state => {
            const entityName = state.currentEntity.slice(0, -1)
            
            if (state[entityName]) 
                return state[entityName].newItems
        },

        getEntityItems: (state, getters) => {
            return state[getters.getEntityName].items
        }
    },

    mutations: {
        CHANGE_STATE: (state, payload) => state.everythingReady = payload,
        ADD_ITEM: (_, { state, prop, payload }) => state[prop].push(payload),
        CHANGE_ENTITY: (state, payload) => state.currentEntity = payload,
        SET_PROVIDER: (state, payload) => state.selectedProvider = payload,
        SET_PROVIDER_INVOICE_NR: (state, payload) => state.selectedProvider = { ...state.selectedProvider, invoiceNr: payload }
    },

    actions: {
        changeEntity: ({ commit }, payload) => commit('CHANGE_ENTITY', payload),
    },

    modules: {
        api,
        document_product
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

store.watch(
    state => {
        return [state.document_product.items, state.document_product.lastDeletedDocId]
    },
    async ([dpItems, lastDeletedDocId]) => {
        const currentEntity = store.state.currentEntity

        if (!dpItems.length && lastDeletedDocId !== -1) {
            const data = {
                url: `${store.state.mainUrl}${currentEntity}`,
                payload: lastDeletedDocId
            }

            await store.dispatch('api/deleteItem', data);
            store.dispatch('api/FETCH_DATA');
        }
    }
)

export default store;