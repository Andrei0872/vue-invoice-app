import {
    convertMapToObject,
    convertMapToArrExcludingProps,
    getDiffBetweenMapsElements,
    getObjAfterDeletingCommonValues,
} from '@/utils/';

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
                /**
                 * This will be used when computing values that depend on
                 * `buy_price` and `markup`, such as `sell_price`, `product_vat`
                 * and `sell_price_vat`
                 */
                isComestible: products.get(product.product_id).comestible
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
        const pristineProduct = state.products.get(id);

        const newUpdatedProduct = { ...currentUpdatedProduct, ...productDetails };

        const actuallyUpdatedProduct = getObjAfterDeletingCommonValues(
            newUpdatedProduct,
            pristineProduct,
            Object.keys(newUpdatedProduct)
        );

        if (actuallyUpdatedProduct === null) {
            commit('DELETE_UPDATED_PRODUCT', id);
        } else {
            commit('ADD_UPDATED_PRODUCT', { id, ...newUpdatedProduct });
        }
        
        commit('TRACK_UPDATED_PRODUCTS');
    },

    resetUpdatedProducts: ({ commit }) => {
        commit('RESET_UPDATED_PRODUCTS');
        commit('TRACK_UPDATED_PRODUCTS');
    },

    sendUpdatedProducts: async ({ dispatch, getters, rootState }) => {
        const updatedProducts = getters.getUpdatedProducts;
        const products = getters.getProducts;

        const url = `${rootState.mainUrl}documents/products`;
        const payload = convertMapToObject(updatedProducts);
        
        const response = await dispatch("api/makePUTRequest", { url, payload }, { root: true });

        // TODO: decide whether the dashboard info needs to be updated

        const differences = getDiffBetweenMapsElements(products, updatedProducts);

        const message = `Update products in document`;
        dispatch('sendHistoryData', {
            entity: `document`, 
            message, 
            action_type: 'update',
            current_state: JSON.stringify(differences),
        });

        dispatch('resetUpdatedProducts');
        
        return response;
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

    sendCreatedProducts: async ({ dispatch, rootGetters, getters }, currentDocumentId) => {
        const createdProducts = getters.getCreatedProducts;
        const createdProductsWithoutIds = [...createdProducts.values()];

        const url = `${rootGetters['api/mainURL']}/documents/products`;
        const payload = {
            createdProducts: createdProductsWithoutIds,
            docId: currentDocumentId
        };

        const response = await dispatch('api/makePOSTRequest', { url, payload }, { root: true });

        const createdProductsForHistory = createdProductsWithoutIds.map(createdItem => {
                const { id: randomProductId, product_name: productObj, ...itemWithoutProductObj } = createdItem;
                const { id, ...productObjWithoutId } = productObj;

                return {
                    ...itemWithoutProductObj,
                    ...productObjWithoutId
                };
            });
        
        const message = `Add new products in a document`;
        dispatch('sendHistoryData', {
            entity: `document`, 
            message,
            action_type: 'insert',
            current_state: JSON.stringify(createdProductsForHistory)
        });

        dispatch('resetCreatedProducts');

        return response;
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

    sendDeletedProducts: async ({ dispatch, rootState, getters }, currentDocumentId) => {
        
        const deletedProducts = getters.getDeletedProducts;
        const shouldDeletedDoc = getters.getCreatedProducts.size + getters.getProducts.size === 0 

        const url = `${rootState.mainUrl}documents/products`;
        const payload = {
            ids: [...deletedProducts.keys()].map(k => deletedProducts.get(k).product_id),
            docId: currentDocumentId,
            shouldDeleteDoc: shouldDeletedDoc
        };

        const response = await dispatch('api/makeDELETERequest', { url, payload }, { root: true });
        
        const deletedProductsForHistory = convertMapToArrExcludingProps(getters.getDeletedProducts, ['document_id', 'product_id']);

        dispatch('sendHistoryData', {
            entity: 'document',
            message: 'Delete products from document',
            action_type: 'delete',
            prev_state: JSON.stringify(deletedProductsForHistory)
        });

        dispatch('resetDeletedProducts');

        return response;
    },

    updateDocument: async (
            { dispatch, rootState, rootGetters }, 
            { docId, provider_id, newDocumentData, oldDocumentData },
        ) => {
        const url = `${rootState.mainUrl}documents/update_document`;

        const config = {
            ...rootGetters['api/config'],
            method: "PUT",
            body: JSON.stringify({
                provider_id,
                invoice_number: newDocumentData.invoice_number,
                id: docId,
            })
        }

        const response = await dispatch('api/makeRequest', { url, config }, { root: true })

        console.log(response)

        const currentState = JSON.stringify({
            [docId]: {
                from: oldDocumentData,
                to: newDocumentData,
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

    fetchOneDocument: async ({ dispatch, commit }, url) => {
        const updatedDocument = (await dispatch('api/makeGETRequest', { url }, { root: true }))[0];

        commit('document/ADD_ITEM', updatedDocument, { root: true });
        commit('document/TRACK_ITEMS', undefined, { root: true });
    },
}