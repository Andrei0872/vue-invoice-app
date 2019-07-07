import { convertMapToArr } from '@/utils/';

export const getters = {
    getItemsAsArr: state => state.itemsTracker && convertMapToArr(state.items, 'id'),

    getCreatedItemsAsArr: state => state.createdItemsTracker && convertMapToArr(state.createdItems, 'id'),

    getUpdatedItemsAsArr: state => state.updatedItemsTracker && convertMapToArr(state.updatedItems, 'id'),

    getWhetherItShouldCancelOrConfirmChanges: state => 
        state.updatedItemsTracker && state.updatedItems.size !== 0
            || state.deletedItemsTracker && state.deletedItems.size !== 0
};