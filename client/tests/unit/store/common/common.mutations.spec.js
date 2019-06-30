import { mutations } from '@/store/modules/common/common.mutations';

describe('common - mutations', () => {
    // Creating/updating/deleting follow the same pattern
    it('should add a new item when calling ADD_ITEM', () => {
        const state = { items: new Map };

        const id = 1;
        const itemDetails = { name: 'product_name' };
        const payload = { id, ...itemDetails };

        mutations.ADD_ITEM(state, payload);

        expect(state.items.size).toBe(1);
        expect(state.items.get(1)).toEqual(itemDetails)
    });
});