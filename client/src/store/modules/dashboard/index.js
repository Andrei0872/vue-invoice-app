export const namespaced = true;

export const state = {
    ['dashboard/overview']: {},
    vat: {},
    history: [],
    needsUpdate: false,
    isInit: false,
    // Used to identify which documents no longer exist
    documentIds: null,
}

export { getters } from './dashboard.getters';

export { mutations } from './dashboard.mutations';

export { actions } from './dashboard.actions';