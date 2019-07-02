export const namespaced = true;

export const state = {
    items: [],
    deletedItems: [],
    changes: {},
    pristineData: new Map,
    currentId: null,
    alreadyFetched: false,
    lastDeletedDocId: -1
}

export { getters } from './single-document.getters';

export { mutations } from './single-document.mutations';

export { actions } from './single-document.actions';