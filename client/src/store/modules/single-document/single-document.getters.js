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

    getUpdatedProducts: state => state.updatedProductsTracker && state.updatedProducts
}