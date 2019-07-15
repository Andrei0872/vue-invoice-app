import { actions } from '@/store/modules/common/common.actions';

describe('common - actions', () => {
    describe('`CREATE` action', () => {
        it('should insert the created items on `insertCreatedItems`', async () => {
            const createdItems = [
                { id: 'random-id-1', name: 'new provider-1', URC: 'new URC1!' },
                { id: 'random-id-2', name: 'new provider-2', URC: 'new URC2!' },
            ];

            const rootGetters = {
                getEntityNameSingularForm: () => 'provider',
                getEntityNamePluralForm: () => 'providers',
            }; 
            const getters = {
                getCreatedItemsAsArr: createdItems,
            };
            
            const dispatch = jest.fn(() => Promise.resolve());

            actions.insertCreatedItems({ rootGetters, dispatch, getters });

            expect(dispatch).toHaveBeenCalledWith('api/insertItem', createdItems, { root: true })
        });
    });

    describe('`UPDATE` action`', () => {
        it('should update an item that has already been updated several times', () => {
            const state = {
                updatedItems: new Map()
                    .set(1, { name: 'updated item #1' })
            };
            const commit = jest.fn();
            
            const payload = { id: 1, name: 'updated item #2' };

            actions.updateItem({ state, commit }, payload);

            expect(commit).toHaveBeenCalledWith('ADD_UPDATED_ITEM', {id: 1, name: 'updated item #2'});
            expect(commit).toHaveBeenCalledWith('TRACK_UPDATED_ITEMS');
        });
        
        it('should update a different prop of an item that has already been updated several times', () => {
            const state = {
                updatedItems: new Map()
                    .set(1, { name: 'updated item #1' })
            };
            const commit = jest.fn();
            
            const payload = { id: 1, URC: 'new urc! #1' };

            actions.updateItem({ state, commit }, payload);
            expect(commit).toHaveBeenCalledWith('ADD_UPDATED_ITEM', {
                id: 1, 
                name: 'updated item #1', 
                URC: 'new urc! #1'
            });
            expect(commit).toHaveBeenCalledWith('TRACK_UPDATED_ITEMS');
        });

        it('should update an item that has not been updated before', () => {
            const state = {
                updatedItems: new Map()
            };

            const commit = jest.fn();
            
            const payload = { id: 2, name: 'updated item #1' };

            actions.updateItem({ state, commit }, payload);
            expect(commit).toHaveBeenCalledWith('ADD_UPDATED_ITEM', {id: 2, name: 'updated item #1'});
            expect(commit).toHaveBeenCalledWith('TRACK_UPDATED_ITEMS');
        });
    });

    describe('`DELETE` action', () => {
        it('should delete the item with the specified it`', () => {
            const state = {
                items: new Map()
                    .set(1, { prop: 'foo' })
                    .set(2, { prop: 'bar' }),
                deletedItems: new Map()
            };
            const commit = jest.fn();
            const deletedItemId = 1;

            actions.deleteItem({ state, commit }, deletedItemId);

            expect(commit).toHaveBeenCalledWith('DELETE_ITEM', 1);
            expect(commit).toHaveBeenCalledWith('TRACK_ITEMS');
            expect(commit).toHaveBeenCalledWith('ADD_DELETED_ITEM', { id: 1, prop: 'foo' });
            expect(commit).toHaveBeenCalledWith('TRACK_DELETED_ITEMS');
        });
    }); 
});