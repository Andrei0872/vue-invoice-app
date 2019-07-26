import { convertMapToArr } from '@/utils/';

export const getters = {

    // ? needs a deeper look
    // getItemsById: state => state.items.filter(({
    //     document_id
    // }) => document_id === state.currentId),

    // getChanges: state => return state.changes,

    // getPristineData: state => state.pristineData,

    // getDeletedItems: state => state.deletedItems,
    // ? =============================


    getProductsAsArr: state => state.productsTracker && convertMapToArr(state.products, 'id'),

    getCreatedProductsAsArr: state => state.createdProductsTracker && convertMapToArr(state.createdProducts, 'id'),

    getUpdatedProducts: state => state.updatedProductsTracker && state.updatedProducts,

    getDeletedProducts: state => state.deletedProductsTracker && state.deletedProducts,

    getCreatedProducts: state => state.createdProductsTracker && state.createdProducts,

    getProducts: state => state.productsTracker && state.products,

    getWhetherItShouldEnableConfirmBtn: state => 
        state.updatedProductsTracker && state.updatedProducts.size !== 0 
            || state.deletedProductsTracker && state.deletedProducts.size !== 0
            || state.createdProductsTracker && state.createdProducts.size !== 0
            || state.currentDocumentNewData !== null,

    getExistingProductsIds: state => {
        if (!state.productsTracker)
            return;
        
        const productsIds = {};

        for (const p of state.products.values()) {
            productsIds[p.product_id] = true;
        }

        return productsIds;
    },

    getCreatedProductsIds: state => {
        if (!state.createdProductsTracker)
            return;

        const createdProductsIds = {};

        for (const p of state.createdProducts.values()) {
            if (p.product_name && p.product_name.id) {
                createdProductsIds[p.product_name.id] = true;
            }
        }

        return createdProductsIds;
    },

    getHasDocumentDataChanged: state => state.currentDocumentNewData !== null,
}