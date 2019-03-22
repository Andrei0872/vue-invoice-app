<template>
    <div>
        <!-- TODO: add notification :D - based on a vuex's state property -->
        <VContent @addNewItems="addNewItems" v-if="everythingReady === true" entityName="provider">
            <template v-slot:existingItems>
                <VTableRead 
                    v-if="items.length"
                    :fields="readColumns" 
                    :items="items" 
                    @update="update($event)"
                    @showInfo="showInfo($event)"
                    @deleteRow="deleteRow($event)"
                />
                <div v-else class="no-items">
                    There are no items!
                </div>
            </template>
            <template v-slot:createItems>
                 <div @click="addRow" class="icon icon--add-row">
                    <font-awesome-icon icon="plus-circle" />
                </div>
                <VTableCreate 
                    @deleteRow="deleteRowInstantly($event)" 
                    :fields="createColumns" 
                    :items="newItems"
                    @addField="addField($event)"
                    @init="init"
                />
            </template>
        </VContent>
        <div v-else-if="everythingReady !== 'pending'">
            Some other error happened
        </div>

        <VModal :showModal="showDetails" :isAboutToDelete="isAboutToDelete" @closeModal="closeModal">
            <template v-slot:header>
                <span>{{ modalTitle }}</span>
            </template>
            <template v-if="!isAboutToDelete" v-slot:body>
                <div
                    v-for="field in readColumns"
                    :key="field"
                    class="modal-body__row"
                >
                    <div class="modal-body__prop"><span>{{ field }}</span></div>
                    <div class="modal-body__arrow"><font-awesome-icon icon="arrow-right" /></div>
                    <div class="modal-body__value">
                        <span>{{ selectedItem[field] }}</span>
                    </div>
                </div>
            </template>
            <template v-else v-slot:body>
                <div class="c-modal-buttons">
                    <button class="c-modal-buttons__button c-modal-buttons--yes" @click="confirmDelete">Yes</button>
                    <button class="c-modal-buttons__button c-modal-buttons--no" @click="cancelDelete">No</button>
                </div>
            </template>
        </VModal>
    </div>
</template>

<script>
import VContent from '../components/VContent';
import VModal from '../components/VModal';
import VTableCreate from '../components/VTableCreate';
import VTableRead from '../components/VTableRead';
import modalMixin from '../mixins/modalMixin';

const entityName = 'provider';

import uuidv1 from 'uuid/v1';

import { createNamespacedHelpers } from 'vuex';
import * as common from '@/store/modules/common';
const { mapState, mapActions } = createNamespacedHelpers(entityName)

export default {
    name: 'products',

    components: { VContent, VModal, VTableCreate, VTableRead },

    mixins: [modalMixin],

    data: () => ({
        selectedItem: {},
        isCreating: false,
        isAboutToDelete: false,
        showDetails: false, // Show modal or not
        readColumns: ['name', 'URC', 'inserted_date'],
        createColumns: ['name', 'URC']
    }),

    methods: {

        addNewItems () {
            console.log('new items - provider')
        },

        // TODO: add to utils / global mixin
        createRandomObj () {
            return Object.assign({}, ... (this.createColumns.map(field => ({ [field]: field }))), { id: uuidv1() });
        },

        showInfo (row) {
            this.selectedItem = {... row};
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
            this.deleteItem({ prop: 'newItems', id: rowId });
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
            console.log(rowId, fieldName, value)
            this.addFieldValue({ rowId, fieldName, value });
        },

        init () {
            this.resetArr({ prop: 'newItems' });
            this.addNewItem(this.createRandomObj());
        },

        update (changesArr) {
            console.log(changesArr)
            this.updateItems(changesArr);
        },

        ...mapActions(['resetArr', 'addNewItem', 'deleteItem', 'addFieldValue'])
    },

    computed: {
        everythingReady () {
            return this.$store.state['everythingReady']
        },

        modalTitle () {
            return this.isAboutToDelete ? `Are you sure you want to delete ${this.selectedItem.name} ?` : `About ${this.selectedItem.name}`
        },

        ...mapState(['items', 'newItems'])
    },

    async created () {
        !(this.$store && this.$store.state[entityName]) && (this.$store.registerModule(entityName, common))

        this.$store.dispatch('api/FETCH_DATA');
    }
}
</script>

<style lang="scss" scoped>
    $modal-text-color: darken($color: #394263, $amount: 10%);
    
    @import '../styles/common.scss';
    @import '../styles/modal.scss';
</style>