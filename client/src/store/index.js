import Vue from 'vue'
import Vuex from 'vuex'

import * as api from './modules/api';
import * as document_product from './modules/document_product';
import * as dashboard from './modules/dashboard';

import { capitalize } from '../utils/'; 

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

        SET_PROVIDER_INVOICE_NR: (state, payload) => state.selectedProvider = { ...state.selectedProvider, invoiceNr: payload },
    },

    actions: {
        changeEntity: ({ commit }, payload) => commit('CHANGE_ENTITY', payload),
    },

    modules: {
        api,
        document_product,
        dashboard
    }
});

// Every time the user updates an item, changes the values locally, but also make a db call to have the new results on refresh etc..
store.subscribeAction(action => {
    const currentEntity = store.state.currentEntity && store.state.currentEntity.slice(0, -1) || null

    // Re-fetch main overview from Dashboard on: create / delete / update
    if (['api/insertItem', 'document_product/updateItems', 'document_product/deleteFromDoc', 'api/deleteItem'].includes(action.type)) {
        let willUpdate = true;

        // Check if there is any update that is significant to the main overview 
        if (action.type === 'document_product/updateItems') {
            willUpdate = false;

            for (const objValues of Object.values(action.payload)) {
                if (objValues.hasOwnProperty('sell_price'))
                    willUpdate = true;
            }
        }

        willUpdate && store.commit('dashboard/SET_UPDATE_STATE', true);
    }

    if (currentEntity && action.type === `${currentEntity}/updateItems`) {
        
        const data = {
            url: `${store.state.mainUrl}${currentEntity}s`,
            payload: action.payload
        }

        // Not using async/await won't hurt nobody, right? :)
        store.dispatch(`api/updateItem`, data)
            .then(() => {
                // If the provider name has changed, update the documents that depend on that provider
                if (currentEntity === 'provider') {
                    const url = `${store.getters['api/mainURL']}/documents/update_provider`
                    const config = {
                        ...store.getters['api/config'],
                        method: "PUT",
                        body: JSON.stringify(action.payload)
                    }

                    store.dispatch('api/makeRequest', { url, config })
                        .then(() => {
                            // Update the existing data
                            if (store.state['document']) {
                                store.dispatch('api/FETCH_DATA', {
                                    avoidChangingState: true,
                                    anotherEntity: 'documents'
                                });
                            }
                        })
                }
            })

    } else if (action.type === `${currentEntity}/deleteItem` && action.payload.prop === 'items') {
        
        const data = {
            url: `${store.state.mainUrl}${currentEntity}s`,
            payload: action.payload.id
        }

        store.dispatch('api/deleteItem', data)

        if (
            currentEntity === 'provider' 
                && store.state['document'] 
                && store.state['document'].items.some(({ provider_id }) => provider_id === action.payload.id)
        ) {
            store.dispatch('api/FETCH_DATA', { avoidChangingState: true, anotherEntity: 'documents' })
        }
    } else if (action.type === 'dashboard/setNewVat') {
        // Updating VAT 
        const config = {
            ...store.getters['api/config'], 
            method: "PUT",
            body: JSON.stringify({ [action.payload.type]: action.payload.value })
        }
        const url = `${store.getters['api/mainURL']}/vat/update`;
        
        store.dispatch('api/makeRequest', { url, config });
    }
})

export default store;