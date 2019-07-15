export const mutations = {
    SET_PROP_DATA: (state, { stateProp, payload }) => state[stateProp] = payload,

    SET_NEW_VAT: (state, payload) => state.vat = payload,

    SET_UPDATE_STATE: (state, payload) => state.needsUpdate = payload,

    SET_INIT_FALSE: state => state.isInit = true,

    ADD_DOCUMENT_IDS: (state, payload) => state.documentIds = new Map(payload)
}
