import { mount } from '@vue/test-utils';

import VTableRead from '@/components/VTableRead';

let wrapper,
    firstRow,
    items,
    fields;


beforeAll(() => {
    items = [
        { id: 1, name: 'n1', URC: 'urc1', inserted_date: 'date1'  },
        { id: 2, name: 'n2', URC: 'urc2', inserted_date: 'date2'  },
        { id: 3, name: 'n3', URC: 'urc3', inserted_date: 'date3'  },
    ];

    firstRow = items[0];

    fields = ['name', 'URC', 'inserted_date'];

    wrapper = mount(VTableRead, {
        propsData: {
            fields, 
            items,
            readonly: false,
            showDelete: false
        },
        mocks: {
            $route: { name: 'documentEditOne' },
            $store: { state: { currentEntity: 'documents' } },
        },
        stubs: {
            'font-awesome-icon': `<div></div>`
        }
    });
});

describe('VTableRead', () => {
    it('should load props correctly', () => {
        expect(wrapper.props().fields).toBe(fields);
        expect(wrapper.props().items).toBe(items);
    });

    it('should select the right row when updating', () => {
        wrapper.vm.updateRow(firstRow)
        wrapper.find('.the-input').element.focus();

        expect(wrapper.vm.selectedRowId).toBe(1);
        expect(wrapper.vm.selectedField).toBe('name');
    });

    it('should compute the right values for history section', () => { 
        // Modify the current selected row
        wrapper.vm.addField(firstRow, 'name', { target: { value: 'andrei' } });

        expect(wrapper.vm.untouchedRow.name).not.toBe(wrapper.vm.selectedRow.name);

        const changes = wrapper.vm.compareChanges(wrapper.vm.untouchedRow, wrapper.vm.selectedRow);

        expect(changes).toEqual({ name: 'andrei' });

        /**
         * When computing history rows that are going to be shown in dashboard
         * it is enough to split both strings by `|`;
         * 
         * when computing
         * @var const prevStateItem    = prevState.split('|')[n];
         * @var const currentStateItem = currentState.split('|')[n];
         *  - prev state
         *     - field name: LHS of prevStateItem.split(':')
         *     - prev value: RHS of prevStateItem.split(':')
         *  - currentState
         *     - current value: currentStateItem
         */
        expect(wrapper.vm.prevState).toBe('name:n1|');
        expect(wrapper.vm.crtState).toBe('andrei|');
    });
});