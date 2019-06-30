
import { getters } from '@/store/modules/common/common.getters';

describe('common - getters', () => {
    it('should retrieve items as array', () => {
        const state = {
            items: new Map()
                .set(1, { name: 'product1' })
                .set(2, { name: 'product2' })
                .set(3, { name: 'product3' }),
            itemsTracker: 1,
        };

        const itemsAsArr = [
            { id: 1, name: 'product1' },
            { id: 2, name: 'product2' },
            { id: 3, name: 'product3' },
        ];

        expect(getters.getItemsAsArr(state)).toEqual(itemsAsArr);
    });
});