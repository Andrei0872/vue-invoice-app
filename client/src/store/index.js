import Vue from 'vue'
import Vuex from 'vuex'

import * as api from './modules/api';
import * as documentProduct from './modules/single-document/';
import * as dashboard from './modules/dashboard';

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
        documentProduct,
        dashboard
    }
});

// Every time the user updates an item, changes the values locally, but also make a db call to have the new results on refresh etc..
store.subscribeAction(action => {
    const currentEntity = store.state.currentEntity && store.state.currentEntity.slice(0, -1) || null

    // Re-fetch main overview from Dashboard on: create / delete / update
    if (['api/insertItem', 'documentProduct/updateItems', 'documentProduct/deleteFromDoc', 'api/deleteItem'].includes(action.type)) {
        let willUpdate = true;

        // Check if there is any update that is significant to the main overview 
        if (action.type === 'documentProduct/updateItems') {
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
        /**
         * This makes sure that every time a provider is removed,
         * all the documents that depend on that provider are removed as well
         */
        
        const data = {
            url: `${store.state.mainUrl}${currentEntity}s`,
            payload: action.payload.id
        }

        let deletedProvider;

        currentEntity === 'provider' && (deletedProvider = (store.state['provider'].items.find(({ id }) => +id === +action.payload.id)).name)
        
        store.dispatch('api/deleteItem', data).then(({ rowsInfo = null }) => {
            if (currentEntity !== 'provider') return;
            
            const affectedRows = rowsInfo[0][0]['affectedRows']

            if (affectedRows) {
                store.dispatch('api/FETCH_DATA', { avoidChangingState: true, anotherEntity: 'documents' })
                
                const message = `${affectedRows === 1 ? 'A document has' : affectedRows + ' documents have'} been removed`
                
                store.dispatch('dashboard/insertHistoryRow', {
                    // `document/indirectProvider`: doc deleted because its provider has been removed
                    entity: 'document/indirectProvider',
                    message,
                    action_type: 'delete',
                    additional_info: JSON.stringify(deletedProvider)
                });

            }
        });
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

store.watch((state, getters) => getters['dashboard/getDocumentsLen'], documentsLen => {
    if (documentsLen) {
        console.log(documentsLen)
        const docIds = store.state['document'].items.map(({ id }) => ([id, true]))

        store.commit('dashboard/ADD_DOCUMENT_IDS', docIds);
    }
})

export default store;