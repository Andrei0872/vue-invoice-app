import { mutations } from '@/store/modules/single-document/single-document.mutations';

describe('single-document: MUTATIONS', () => {
    it('should ad an item when calling `ADD_PRODUCT`', () => {
        const state = {
            products: new Map(),
        };

        const itemDetails = { foo: 'bar' };
        const payload = { id: 1, ...itemDetails };

        mutations.ADD_PRODUCT(state, payload);

        expect(state.products.size).toBe(1);
        expect(state.products.get(1)).toEqual(itemDetails);
    });
});