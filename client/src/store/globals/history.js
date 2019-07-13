import Vue from 'vue';
import Vuex from 'vuex';

import { getDifferenceBetweenTwoObjects, getObjectSpecificProps, getObjectWithoutProps } from '../../utils/index';

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

        CLEAN_UNDO_STACK: (state, id) => state.undoStack = state.undoStack.filter(({ item = null }) => item ? +item.id !== id : true),

        ADD_REDO_ACTION: (state, payload) => state.redoStack.push(payload),
        
        POP_REDO: state => state.redoStack.pop(),

        CLEAN_REDO_STACK: (state, id) => state.redoStack = state.redoStack.filter(({ item }) => +item.id !== id),

        RESET_ALL: state => (state.undoStack.length = state.redoStack.length = 0)
    },

    actions: {
        addUndoAction: ({ commit, getters }, payload) => {
            const lastItem = getters.getLastRedoItem;

            // if (lastItem &&  +payload.item.id !== +lastItem.id || lastItem === undefined) {
                commit('ADD_UNDO_ACTION', payload)
            // }
        },

        undo: ({ commit, getters, state }) => {

            const { mainStore, currentEntity, callbacks: { undo: cb } } = state

            const { action, ...lastUndoItem } = getters.getLastUndoItem;
            commit('POP_UNDO');

            if (action === 'delete') {
                const { item, index } = lastUndoItem;
                const data = { index, payload: item };

                cb['delete'](data, currentEntity);

                const { item: lastItem = undefined } = getters.getLastRedoItem || {};

                if (lastItem && +item.id !== +lastItem.id || lastItem === undefined) {
                    commit('CLEAN_REDO_STACK', item.id);
                    commit('ADD_REDO_ACTION', { action, index, item });
                }

            } else if (action === 'update') {
                const { id, beforeChanges } = lastUndoItem;

                const { items: pristineItems, updatedItems } = mainStore.state[currentEntity]
                const pristineItem = pristineItems.get(+id);
                const updatedItem = updatedItems.get(+id);

                /**
                 * Delete props whose values would lead to a state of an item
                 * that is identical with its pristine state
                 */
                const {
                    kept: newUpdatedItem,
                    deleted: deletedPropsFromCrtUpdatedItem
                } = getDifferenceBetweenTwoObjects(beforeChanges, pristineItem);

                const changesLeftAfterUndo = getObjectWithoutProps(updatedItem, Object.keys(deletedPropsFromCrtUpdatedItem))
                const hasItemChangesLeft = Object.keys(changesLeftAfterUndo).length !== 0

                if (!hasItemChangesLeft) {
                    updatedItems.delete(+id);
                } else {
                    updatedItems.set(+id, { ...changesLeftAfterUndo, ...newUpdatedItem });
                }

                cb['update']({ id, ...beforeChanges }, currentEntity)

                const prevState = getObjectSpecificProps(updatedItem, Object.keys(beforeChanges));
                commit('ADD_REDO_ACTION', { id, beforeChanges: prevState, action });
            }
        },

        redo: ({ commit, getters, state }) => {
            const { mainStore, currentEntity, callbacks: { redo: cb } } = state;

            const { action, ...lastRedoItem } = getters.getLastRedoItem;
            commit('POP_REDO');

            if (action === 'delete') {
                const { index, item = null } = lastRedoItem;

                const deleteData = {
                    prop: 'items',
                    id: item.id,
                    initialState: item
                }
                
                cb['delete'](deleteData, currentEntity);
                // store.dispatch(`${currentEntity}/deleteItem`, deleteData);

                const { item: lastItem = undefined } = getters.getLastUndoItem || {};

                if (lastItem && +item.id !== +lastItem.id || lastItem === undefined) {
                    commit('CLEAN_UNDO_STACK', item.id);
                    commit('ADD_UNDO_ACTION', { action, index, item });
                }
            } else {
                const { id, beforeChanges } = lastRedoItem;

                console.log(beforeChanges)

                const { updatedItems, items: pristineItems } = mainStore.state[currentEntity];
                const updatedItem = updatedItems.get(+id) || {};
                const pristineItem = pristineItems.get(+id)

                /**
                 * The updated item might have got deleted because the previous
                 * changes would lead to its pristine state
                 */
                let prevState = getObjectSpecificProps(updatedItem, Object.keys(beforeChanges), pristineItem);

                commit('ADD_UNDO_ACTION', { id, beforeChanges: prevState, action });
                
                const newUpdatedItem = { ...updatedItem, ...beforeChanges }
                updatedItems.set(+id, newUpdatedItem);

                // Apply changes visually
                cb['update']({ id, ...beforeChanges }, currentEntity);
                // store.dispatch(`${currentEntity}/updateItems`, { id, ...beforeChanges });
            }
        },
    },
})