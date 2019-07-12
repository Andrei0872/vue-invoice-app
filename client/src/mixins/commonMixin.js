import uuidv1 from 'uuid/v1';

import {
    convertMapToObject,
    getDiffBetweenMapsElements,
} from '@/utils/'

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

        prepareRowForDeletion (row) {
            this.isAboutToDelete = true;
            this.selectedItem = { ...row };
            this.showDetails = true;
        },

        deleteRowInstantly (rowId) {
            this.deleteCreatedItem(rowId);

            if (this.createdItems.length === 0) {
                this.disableCreateButton = true;
            }
        },

        confirmDelete () {
            this.deleteItem(this.selectedItem.id);
            this.resetModalContent();
            
            // const currentEntity = this.$store.getters['getEntityName'];
            // const message = `Delete ${currentEntity}`
            // this.$store.dispatch('dashboard/insertHistoryRow', {
            //     entity: `${this.$store.getters['getEntityItems'].length === 0 ? currentEntity + '/empty' : currentEntity}`,
            //     message, 
            //     action_type: 'delete',
            //     prev_state: JSON.stringify(this.selectedItem)
            // });
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

        async fetchItems (url = null, anotherEntity = null) {
            await this.$store.dispatch('api/makeGETRequest', { 
                url: (url || this.backendUrl),
                entity: (anotherEntity || this.entity )
            });
        },

        sendDeletedHistoryData () {
            let itemsLen = this.items.length;

            const message = `Delete ${this.entity}`;
            const entity = `${ itemsLen === 0 ? this.entity + '/empty' : this.entity}`;
            const action_type = 'delete';
            const prev_state = JSON.stringify({
                data: [
                    { 
                        title: this.entity + 's',
                        items: convertMapToObject(this.deletedItems),
                    },
                ]
            });

            this.sendHistoryData({
                message,
                entity,
                action_type,
                prev_state
            });
        },
        
        
        sendUpdatedHistoryData () {
            const entity = this.entity;
            const action_type = 'update';
            const message = `Update ${this.entity}`;

            const differences = getDiffBetweenMapsElements(
                this.itemsMap, 
                this.updatedItemsMap
            );

            const current_state = JSON.stringify(differences);

            console.log('differences', differences)

            this.sendHistoryData({
                message,
                entity,
                action_type,
                current_state,
            });
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

        backendUrl () {
            return this.$store.getters['getEntityBackendEndpoint'];
        },

        mainUrl () {
            return this.$store.state['mainUrl'];
        },
    },
}