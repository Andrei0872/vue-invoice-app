import { convertMapToArr } from '@/utils/';

export const getters = {
    getItemsAsArr: state => state.itemsTracker && convertMapToArr(state.items, 'id'),

    getCreatedItemsAsArr: state => state.createdItemsTracker && convertMapToArr(state.createdItems, 'id'),

    getUpdatedItemsAsArr: state => state.updatedItemsTracker && convertMapToArr(state.updatedItems, 'id'),

    getWhetherItShouldEnableConfirmBtn: state =>
        state.updatedItemsTracker && state.updatedItems.size !== 0
            || state.deletedItemsTracker && state.deletedItems.size !== 0,

    getDeletedItems: state => state.deletedItemsTracker && state.deletedItems,

    getUpdatedItems: state => state.updatedItemsTracker && state.updatedItems,

    getItems: state => state.itemsTracker && state.items,

    getCreatedItemsAsArrWithoutIds: state => state.createdItemsTracker && convertMapToArr(state.createdItems),
};