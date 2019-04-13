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
            
            const currentEntity = this.$store.getters['getEntityName'];
            const message = `Delete ${currentEntity}`
            this.$store.dispatch('dashboard/insertHistoryRow', { entity: currentEntity, message, action_type: 'delete' });
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
            // If we are editing a document(this.$route.name !== 'documentEditOne')
            // make sure to display the name of the product
            return this.isAboutToDelete
                ? `Are you sure you want to delete ${
                    this.$store.state.currentEntity === 'documents' && this.$route.name !== 'documentEditOne' 
                        ? 'this document' 
                        : this.selectedItem.name || (this.$route.name === 'documentEditOne' && this.selectedItem.product_name)  
                } ?` 
                : `About ${this.selectedItem.name}`
        },

        everythingReady() {
            return this.$store.state['everythingReady']
        },
    },
}