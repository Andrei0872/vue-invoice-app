import { convertMapToObject } from '@/utils/';

export const actions = {

    // Document
    fetchProductsByDocumentId: async ({ commit, dispatch, rootGetters, rootState }, id) => {
        const url = `${rootGetters['api/mainURL']}/documents/${id}`;
        const products = rootState.product.items;

        const documentProductsRaw = await dispatch('api/makeGETRequest', { url }, { root: true });

        const documentProducts = documentProductsRaw.map(
            (product) => ({
                ...product,
                product_name: products.get(product.product_id).name,
                isComestible: products.get(product.product_id).isComestible
            })
        );

        dispatch('setProducts', documentProducts);
    },  

    setProducts: ({ commit }, products) => {
        products.forEach(p => commit('ADD_PRODUCT', p));

        commit('TRACK_PRODUCTS');
    },

    resetProducts: ({ commit }) => {
        commit('RESET_PRODUCTS');
        commit('TRACK_PRODUCTS');
    },

    // setId: ({ commit }, payload) => commit('SET_ID', payload),

    // Updated
    addUpdatedProduct: ({ commit, state }, { id = null, ...productDetails }) => {
        // TODO: if the updated prop would lead to its initial state, remove prop!
        // if the object has no more props, delete the updated item
        const currentUpdatedProduct = state.updatedProducts.get(id) || {};
                
        const newUpdatedProduct = { ...currentUpdatedProduct, ...productDetails };

        commit('ADD_UPDATED_PRODUCT', { id, ...newUpdatedProduct });
        commit('TRACK_UPDATED_PRODUCTS');
    },

    resetUpdatedProducts: ({ commit }) => {
        commit('RESET_UPDATED_PRODUCTS');
        commit('TRACK_UPDATED_PRODUCTS');
    },

    sendUpdatedProducts: async ({ commit, dispatch, state, rootGetters, rootState }) => {
        const { updatedProducts } = state;
        
        const url = `${rootState.mainUrl}documents/products`;
        const payload = convertMapToObject(updatedProducts);
        
        const response = await dispatch("api/makePUTRequest", { url, payload }, { root: true });

        dispatch('resetUpdatedProducts');

        return response;

        // TODO: decide whether the dashboard info needs to be updated
        // if (rootGetters['dashboard/getUpdateState']) {
        //     dispatch('dashboard/fetchMainOverview', 'dashboard/overview', {
        //         root: true
        //     });
        // }
        // await dispatch('api/FETCH_DATA', undefined, {
        //     root: true
        // });
        // return response;

        // const message = `Update product${productsChangedLen > 1 ? 's' : ''} in document`;
        // this.$store.dispatch('dashboard/insertHistoryRow', {
        //     entity: `documents/edit/${this.id}`, 
        //     message, 
        //     action_type: 'update',
        //     prev_state: prevState.slice(0, -1),
        //     current_state: currentState.slice(0, -1),
        //     additional_info: additionalInfo.slice(0, -1)
        // });
    },

    // Created
    addCreatedProduct: ({ commit }, { id, ...createdProductDetails }) => {
        commit('ADD_CREATED_PRODUCT', { id, ...createdProductDetails });
        commit('TRACK_CREATED_PRODUCTS');
    },

    deleteCreatedProduct: ({ commit }, id) => {
        commit('DELETE_CREATED_PRODUCT', id);
        commit('TRACK_CREATED_PRODUCTS');
    },

    resetCreatedProducts: ({ commit }) => {
        commit('RESET_CREATED_PRODUCTS');
        commit('TRACK_CREATED_PRODUCTS');
    },

    addFieldToCreatedProduct: ({ commit, state }, createdProductDetails) => {
        const [id, fieldName, fieldValue] = createdProductDetails;

        const currentCreatedProducts = state.createdProducts.get(id) || {};
        const modifiedProduct = { ...currentCreatedProducts, [fieldName]: fieldValue };

        commit('ADD_CREATED_PRODUCT', { id, ...modifiedProduct });
        commit('TRACK_CREATED_PRODUCTS');
    },

    sendCreatedProducts: async ({ dispatch, rootGetters, state }, currentDocumentId) => {
        const { createdProducts } = state;
        
        const url = `${rootGetters['api/mainURL']}/documents/products`;
        const payload = {
            createdProducts: [...createdProducts.values()],
            docId: currentDocumentId
        };
        
        const response = await dispatch('api/makePOSTRequest', { url, payload }, { root: true });

        dispatch('resetCreatedProducts');

        return response;
        // const message = `Add new products in a document`;
        // this.$store.dispatch('dashboard/insertHistoryRow', {
        //     entity: `documents/edit/${this.id}`, 
        //     message,
        //     action_type: 'insert',
        //     additional_info: JSON.stringify(this.createdProducts)
        // });
    },

    // Deleted
    addDeletedProduct: ({ commit }, { id = null, ...deletedProductDetails }) => {
        commit('ADD_DELETED_PRODUCT', { id, ...deletedProductDetails });
        commit('TRACK_DELETED_PRODUCTS');

        commit('DELETE_PRODUCT', id);
        commit('TRACK_PRODUCTS');
    },

    resetDeletedProducts: ({ commit }) => {
        commit('RESET_DELETED_PRODUCTS');
        commit('TRACK_DELETED_PRODUCTS');
    },

    sendDeletedProducts: async ({ state, dispatch, rootState, rootGetters }, currentDocumentId) => {
        const { deletedProducts, products, createdProducts } = state
        
        console.log(deletedProducts);

        const url = `${rootState.mainUrl}documents/products`;
        const payload = {
            ids: [...deletedProducts.keys()].map(k => deletedProducts.get(k).product_id),
            docId: currentDocumentId,
            shouldDeleteDoc: products.size + createdProducts.size === 0
        };

        dispatch('resetDeletedProducts');

        const response = await dispatch('api/makeDELETERequest', { url, payload }, { root: true });

        return response;

        /* 
        this.$store.commit('SET_PROVIDER', null);
        this.$store.commit('documentProduct/SET_LAST_DELETED_DOC_ID', -1);

        let deletedItemsLen;
        if ((deletedItemsLen = this.deletedItems.length)) {

            const isDocumentDeleted = this.documentProducts.length === 0 && this.createdProducts.length === 0

            const message = `Delete ${deletedItemsLen === 1 ? 'one product' : 'products'} from document`
            this.$store.dispatch('dashboard/insertHistoryRow', {
                entity: `${isDocumentDeleted ? 'document/empty' : 'documents/edit/' + this.id}`,
                message,
                action_type: 'delete',
                additional_info: JSON.stringify(this.deletedItems.map(({
                    product_id = null,
                    document_id,
                    product_name,
                    ...rest
                }) => ({
                    product_name,
                    ...rest
                })))
            });

            this.resetDeletedItems();
        }
        */
        
    },

    updateDocument: async ({ dispatch, rootState, rootGetters }, payload) => {
        const url = `${rootState.mainUrl}documents/update_document`;
        const config = {
            ...rootGetters['api/config'],
            method: "PUT",
            body: JSON.stringify({
                ...payload.changes,
                id: payload.id,
            })
        }

        const response = await dispatch('api/makeRequest', { url, config }, { root: true })

        console.log(response)

        const { id: documentId, ...documentChanges } = payload;
        const { provider_id: provider_id_prev, ...previousData } = documentChanges.previousData;
        const { provider_id: provider_id_crt, ...changes } = documentChanges.changes;

        const currentState = JSON.stringify({
            [documentId]: {
                from: previousData,
                to: changes,
            },
        });

        const message = `Update document information`;
        dispatch('dashboard/insertHistoryRow', {
            entity: `document`,
            message,
            action_type: 'update',
            current_state: currentState
        }, { root: true });
    },

    // setAlreadyFetched: ({ commit }, payload) => commit('SET_ALREADY_FETCHED', payload),

    sendHistoryData: async ({ dispatch }, historyData) => {
        dispatch('dashboard/insertHistoryRow', historyData, { root: true });
    },
}