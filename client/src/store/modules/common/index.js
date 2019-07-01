export const namespaced = true;

export const state = () => ({
    items: new Map(),
    createdItems: new Map(),
    updatedItems: new Map(),
    deletedItems: new Map(),
    itemsTracker: 1,
    createdItemsTracker: 1,
    updatedItemsTracker: 1,
    deletedItemsTracker: 1,
})

export { getters } from './common.getters'; 

export { mutations } from './common.mutations'; 

export { actions } from './common.actions'; 