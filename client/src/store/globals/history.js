import Vue from 'vue';
import Vuex from 'vuex';

import { getDifferenceBetweenTwoObjects } from '../../utils/index';

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

        CLEAN_UNDO_STACK: (state, id) => state.undoStack = state.undoStack.filter(({ item }) => +item.id !== id),

        ADD_REDO_ACTION: (state, payload) => state.redoStack.push(payload),
        
        POP_REDO: state => state.redoStack.pop(),

        CLEAN_REDO_STACK: (state, id) => state.redoStack = state.redoStack.filter(({ item }) => +item.id !== id),

        RESET_ALL: state => (state.undoStack.length = state.redoStack.length = 0)
    },

    actions: {
        addUndoAction: ({ commit, getters }, payload) => {
            const lastItem = getters.getLastRedoItem;

            if (lastItem &&  +payload.item.id !== +lastItem.id || lastItem === undefined) {
                commit('ADD_UNDO_ACTION', payload)
            }
        },

        undo: ({ commit, getters }, { store, currentEntity = null }) => {
            const { action, ...lastUndoItem } = getters.getLastUndoItem;
            commit('POP_UNDO');
            
            if (action === 'delete') {
                const { item, index } = lastUndoItem;
                const data = { index, payload: item };
                store.commit(`${currentEntity}/ADD_ITEM_AT_INDEX`, data);
                
                store.commit(`${currentEntity}/POP_FROM_DELETED_ITEMS`);

                const { item: lastItem = undefined } = getters.getLastRedoItem || {};

                if (lastItem && +item.id !== +lastItem.id || lastItem === undefined) {
                    commit('CLEAN_REDO_STACK', item.id);
                    commit('ADD_REDO_ACTION', { action, index, item });
                }
                
            } else if (action === 'update') {
                const { id, beforeChanges } = lastUndoItem;
                
                const { pristineItems, updatedItems } = store.state[currentEntity]
                const pristineItem = pristineItems.get(+id);
                const remainingChanges = getDifferenceBetweenTwoObjects(beforeChanges, pristineItem);

                
                // Apply changes visually
                store.dispatch(`${currentEntity}/updateItems`, { id, ...beforeChanges });

                /**
                 * If the changes result in something identical with the initial state
                 * there is no need to consider the item in question updated
                 */
                if (Object.keys(remainingChanges).length === 0) {
                    updatedItems.delete(+id);
                } else {
                    updatedItems.set(+id, remainingChanges);
                }
            }
        },

        redo: ({ commit, getters }, { store, currentEntity = null }) => {
            const { action, index, item = null } = getters.getLastRedoItem;
            commit('POP_REDO');

            if (action === 'delete') {
                const deleteData = {
                    prop: 'items',
                    id: item.id,
                    initialState: item
                }
                
                store.dispatch(`${currentEntity}/deleteItem`, deleteData);

                const { item: lastItem = undefined } = getters.getLastUndoItem || {};

                if (lastItem && +item.id !== +lastItem.id || lastItem === undefined) {
                    commit('CLEAN_UNDO_STACK', item.id);
                    commit('ADD_UNDO_ACTION', { action, index, item });
                }
            }            
        }
    },
})