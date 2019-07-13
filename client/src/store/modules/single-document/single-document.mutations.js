export const mutations = {
    SET_ITEMS: (state, payload) => state.items = payload,

    SET_ID: (state, id) => state.currentId = id,

    SET_CHANGES: (state, payload) => state.changes = payload,

    SET_ALREADY_FETCHED: (state, payload) => state.alreadyFetched = payload,

    SET_LAST_DELETED_DOC_ID: (state, payload) => state.lastDeletedDocId = payload,

    // SET_PRISTINE_DATA: (state, {
    //     id,
    //     ...fields
    // }) => state.pristineData.set(id, fields),

    // Existing
    ADD_PRODUCT: (state, { id, ...productDetails }) => state.products.set(id, productDetails),

    TRACK_PRODUCTS: state => state.productsTracker++,

    DELETE_PRODUCT: (state, id) => state.products.delete(id),

    RESET_PRODUCTS: state => state.products.clear(),

    // Updated
    ADD_UPDATED_PRODUCT: (state, { id, ...productDetails }) => state.updatedProducts.set(id, productDetails),

    TRACK_UPDATED_PRODUCTS: state => state.updatedProductsTracker++,

    RESET_UPDATED_PRODUCTS: state => state.updatedProducts.clear(),

    // Created
    ADD_CREATED_PRODUCT: (state, { id, ...newProductDetails }) => state.createdProducts.set(id, newProductDetails),

    TRACK_CREATED_PRODUCTS: state => state.createdProductsTracker++,

    RESET_CREATED_PRODUCTS: state => state.createdProducts.clear(),

    DELETE_CREATED_PRODUCT: (state, id) => state.createdProducts.delete(id),

    // Deleted
    ADD_DELETED_PRODUCT: (state, { id, ...deletedProductDetails }) => state.deletedProducts.set(id, deletedProductDetails),

    TRACK_DELETED_PRODUCTS: state => state.deletedProductsTracker++,

    RESET_DELETED_PRODUCTS: state => state.deletedProducts.clear(),

}
