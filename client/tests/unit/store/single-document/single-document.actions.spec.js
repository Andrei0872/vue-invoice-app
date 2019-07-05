import { actions } from '@/store/modules/single-document/single-document.actions';

describe('single-document: ACTIONS', () => {
    it('should add multiple received items with `setProducts`', () => {
        const commit = jest.fn();

        const products = [
            { id: 1, productName: 'p1' },
            { id: 2, productName: 'p2' },
            { id: 3, productName: 'p3' },
        ];

        actions.setProducts({ commit }, products);

        products.forEach(p => {
            expect(commit).toHaveBeenCalledWith('ADD_PRODUCT', p);
        });

        expect(commit).toHaveBeenCalledWith('TRACK_PRODUCTS');
    });
});