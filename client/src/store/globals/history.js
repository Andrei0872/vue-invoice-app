import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const historyStore = new Vuex.Store({
    state: {
        undoStack: [],
        redoStack: [],
    },

    getters: {
        getLastUndoItem: state => state.undoStack.pop()
    },

    mutations: {
        ADD_UNDO_ACTION: (state, payload) => state.undoStack.push(payload),

        RESET_ALL: state => (state.undoStack.length = state.redoStack.length = 0)
    },

    actions: {
        addUndoAction: ({ commit }, payload) => commit('ADD_UNDO_ACTION', payload)
    },
})

/**
 * Watch when redoing, add into redoStack
 * 
 * Remove redo => add undo
 * Remove undo => add redo
 */