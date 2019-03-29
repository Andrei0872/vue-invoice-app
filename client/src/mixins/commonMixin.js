import uuidv1 from 'uuid/v1';

export default {
    data: () => ({
        selectedItem: {},
        isCreating: false,
        isAboutToDelete: false,
        showDetails: false,
    }),

    methods: {

        createRandomObj () {
            return Object.assign({}, ... (this.createColumns.map(field => ({ [field]: '' }))), { id: uuidv1() });
        },

        showInfo (row) {
            this.selectedItem = { ...row };
            this.showDetails = true;
        },

        addRow () {
            this.addNewItem(this.createRandomObj());
        },

        deleteRow (row) {
            this.isAboutToDelete = true;
            this.selectedItem = { ...row };
            this.showDetails = true;
        },

        deleteRowInstantly (rowId) {
            this.deleteItem({
                prop: 'newItems',
                id: rowId
            });
        },

        confirmDelete () {
            this.deleteItem({ prop: 'items', id: this.selectedItem.id });
            this.resetModalContent();
        },

        cancelDelete () {
            this.resetModalContent();
        },

        resetModalContent () {
            this.showDetails = false;
            this.isAboutToDelete = false;
        },

        addField ([rowId, fieldName, value]) {
            this.addFieldValue({ rowId, fieldName, value });
        },

        init () {
            this.resetArr({ prop: 'newItems' });
            this.addNewItem(this.createRandomObj());
        },

        update (data) {
            console.log('changes obj:', data)
            this.updateItems(data);
        },
    },

    computed: {
        modalTitle () {
            return this.isAboutToDelete
                ? `Are you sure you want to delete ${
                    this.$store.state.currentEntity === 'documents' ? 'this document' : this.selectedItem.name 
                } ?` 
                : `About ${this.selectedItem.name}`
        },

        everythingReady() {
            return this.$store.state['everythingReady']
        },
    },
}