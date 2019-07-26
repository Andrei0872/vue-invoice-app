export const namespaced = true;

export const state = {
    products: new Map(),
    updatedProducts: new Map(),
    createdProducts: new Map(),
    deletedProducts: new Map(),

    /**
     * Looks for changes regarding the provider_id and the invoice number
     * 
     * The other values(price etc..) are generated when the document is fetched
     */
    currentDocumentNewData: null,
    // Used to verify if changes have been made to this document
    currentDocumentOwnPristineData: null,

    // ? needs a deeper look
    // deletedItems: new Map(),
    // changes: {},
    pristineData: new Map,
    currentId: null,
    alreadyFetched: false,
    lastDeletedDocId: -1,
    // ? ===================

    productsTracker: 1,
    updatedProductsTracker: 1,
    createdProductsTracker: 1,
    deletedProductsTracker: 1,
}

export { getters } from './single-document.getters';

export { mutations } from './single-document.mutations';

export { actions } from './single-document.actions';