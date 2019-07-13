export const getters = {
    getEndpoints: () => ['dashboard/overview', 'vat', 'history'],

    getUpdateState: state => state.needsUpdate,

    getCurrentVat: state => state.vat,

    getHistoryLen: state => state.history.length,

    needsInit: state => !state.isInit,

    getDocumentsLen: (state, getters, rootState) => rootState['document'] ? rootState['document'].items.length : null
}