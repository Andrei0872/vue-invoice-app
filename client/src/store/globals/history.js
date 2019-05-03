import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const historyStore = new Vuex.Store({
    state: {
        undoStack: [],
        redoStack: [],
    },

    getters: {
        getLastUndoItem: state => state.undoStack[state.undoStack.length - 1],

        getLastRedoItem: state => state.redoStack[state.redoStack.length - 1],
    },

    mutations: {
        ADD_UNDO_ACTION: (state, payload) => state.undoStack.push(payload),

        POP_UNDO: state => state.undoStack.pop(),

        ADD_REDO_ACTION: (state, payload) => state.redoStack.push(payload),
        
        POP_REDO: state => state.redoStack.pop(),

        RESET_ALL: state => (state.undoStack.length = state.redoStack.length = 0)
    },

    actions: {
        addUndoAction: ({ commit }, payload) => commit('ADD_UNDO_ACTION', payload),

        undo: ({ commit, getters }, { store, currentEntity = null }) => {
            const { item, action, index }  = getters.getLastUndoItem;
            commit('POP_UNDO');
            
            if (action === 'delete') {
                const data = { index, payload: item };
                store.commit(`${currentEntity}/ADD_ITEM_AT_INDEX`, data);
                
                commit('ADD_REDO_ACTION', { action, index, item });
            }
        },

        redo: ({ commit, getters }, { store, currentEntity = null }) => {
            const { action, index, item = null } = getters.getLastRedoItem;
            commit('POP_REDO');

            if (action === 'delete') {
                const deleteData = {
                    prop: 'items',
                    id: item.id
                }
                
                store.dispatch(`${currentEntity}/deleteItem`, deleteData);
                commit('ADD_UNDO_ACTION', { action, index, item });
            }            
        }
    },
})

/**
 * Watch when redoing, add into redoStack
 * 
 * Remove redo => add undo
 * Remove undo => add redo
 */