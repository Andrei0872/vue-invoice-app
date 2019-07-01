import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import Providers from '@/views/Providers';
import VTableCreate from '@/components/VTableCreate';
import VTableRead from '@/components/VTableRead';
import VContent from '@/components/VContent';

const localVue = createLocalVue();
let wrapper, providers, firstProvidersRow, store, actions;


localVue.use(Vuex);

const addField              = jest.fn();
const updateRow             = jest.fn();
const prepareRowForDeletion = jest.fn();
const confirmDelete         = jest.fn();

beforeAll(() => {
    actions = {
        ['api/FETCH_DATA']: () => {},
        ['dashboard/insertHistoryRow']: () => {},
    },
    
    store = new Vuex.Store({
        actions
    })

    providers = [
        { id: 1, name: 'n1', URC: 'urc1', inserted_date: 'date1' },
        { id: 2, name: 'n2', URC: 'urc2', inserted_date: 'date2' },
        { id: 3, name: 'n3', URC: 'urc3', inserted_date: 'date3' },
    ];

    firstProvidersRow = providers[0];
    
    wrapper = mount(Providers, {
       localVue,
       store,
       computed: {
           items: () => providers,
       },
       data: () => ({
            readColumns: ['name', 'URC', 'inserted_date'],
            createColumns: ['name', 'URC'],
       }),
       methods: {
           addField,
           updateRow,
           prepareRowForDeletion,
           confirmDelete,
       },
       stubs: {
           'font-awesome-icon': '<div></div>',
       },
       mocks: {
           $route: { name: 'provider' }
       }
    });
});

describe('Providers', () => {
    it('should receive the right params for `addField` fn', () => {
        // Show `creating` view
        wrapper.find(VContent).vm.isCreating = true;

        wrapper.find(VTableCreate).vm.$emit('addField', [1, 'name', 'awesome provider']);

        expect(addField).toHaveBeenCalledWith([1, 'name', 'awesome provider']);
    });

    it('should receive the right params for `updateRow` fn', () => {
        wrapper.find(VContent).vm.isCreating = false;

        const expectedParam =  { name: 'awesome-provider changed!', URC: '3219318', id: 1 };
        
        const tableReadWrapper = wrapper.find(VTableRead);
        const tableRead = tableReadWrapper.vm;

        // Trigger the `update` state
        tableRead.updateRow(firstProvidersRow);

        // Alter some fields
        tableRead.addField(firstProvidersRow, 'name', { target: { value: 'awesome-provider!!!' } });
        tableRead.addField(firstProvidersRow, 'name', { target: { value: 'awesome-provider changed!' } });
        tableRead.addField(firstProvidersRow, 'URC', { target: { value: '3219318' } });
    
        // Click the `check` icon to confirm the changes!
        tableRead.confirmChanges(firstProvidersRow);

        expect(tableReadWrapper.emitted().update[0][0]).toEqual(expectedParam);
        expect(updateRow).toHaveBeenCalledWith(expectedParam);
    });

    it('should receive the right params for `deleteRow` fn', () => {
        wrapper.find(VContent).vm.isCreating = false;

        const tableReadWrapper = wrapper.find(VTableRead);
        const tableRead = tableReadWrapper.vm;

        tableRead.deleteRow(firstProvidersRow);

        expect(tableReadWrapper.emitted().deleteRow[0][0]).toEqual(firstProvidersRow);
        expect(prepareRowForDeletion).toHaveBeenCalledWith(firstProvidersRow);
        
        // Confirming the deletion of this item
        wrapper.vm.confirmDelete();

        expect(confirmDelete).toHaveBeenCalled();
    });
});
