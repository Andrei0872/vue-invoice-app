import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const historyStore = new Vuex.Store({
    state: {
        undoStack: [],
        redoStack: []
    },

    mutations: {
        ADD_UNDO_ACTION: (state, payload) => state.undoStack.push(payload),

        RESET_ALL: state => (state.undoStack.length = state.redoStack.length = 0)
    }
})