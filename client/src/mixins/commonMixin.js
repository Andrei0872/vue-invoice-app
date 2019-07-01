import uuidv1 from 'uuid/v1';

export default {
    data: () => ({
        selectedItem: {},
        isCreating: false,
        isAboutToDelete: false,
        showDetails: false,
        disableCreateButton: false,
    }),

    methods: {

        createNewItem () {
            const newItemDetails = Object.assign({}, ... (this.createColumns.map(field => ({ [field]: '' }))));

            const id = uuidv1();

            return { id, ...newItemDetails };
        },

        showInfo (row) {
            this.selectedItem = { ...row };
            this.showDetails = true;
        },

        addRow () {
            this.addCreatedItem(this.createNewItem());

            if (this.disableCreateButton) {
                this.disableCreateButton = false;
            }
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

            if (this.createdItems.length === 0) {
                this.disableCreateButton = true;
            }
        },

        confirmDelete () {
            this.deleteItem({ prop: 'items', id: this.selectedItem.id });
            this.resetModalContent();
            
            const currentEntity = this.$store.getters['getEntityName'];
            const message = `Delete ${currentEntity}`
            this.$store.dispatch('dashboard/insertHistoryRow', {
                entity: `${this.$store.getters['getEntityItems'].length === 0 ? currentEntity + '/empty' : currentEntity}`,
                message, 
                action_type: 'delete',
                prev_state: JSON.stringify(this.selectedItem)
            });
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

        onTableCreateReady() {
            this.resetCreatedItems();
            this.addCreatedItem(this.createNewItem());
        },

        updateRow (data) {
            this.updateItem(data);
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