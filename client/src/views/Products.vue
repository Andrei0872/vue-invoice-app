<template>
    <div>
        <VContent v-if="everythingReady" :isCreating="isCreating" :entityName="entityName">
            <template v-slot:existingItems>
                <!-- <VTable @showInfo="showInfo" :items="items" :fields="fields" /> -->
                <VTableRead 
                    :fields="fields" 
                    :items="items" 
                    @update="update($event)"
                />  
            </template>
            <template v-slot:createItems>
                 <div @click="addRow" class="icon icon--add-row">
                    <font-awesome-icon icon="plus-circle" />
                </div>
                <VTableCreate 
                    @deleteRow="deleteRow($event)" 
                    :fields="fields" 
                    :items="newItems"
                    @addFieldValue=addFieldValue($event)
                    @init="init"
                />
            </template>
        </VContent>
        <div v-else-if="everythingReady === false">
            There are no items
        </div>

        <VModal :showModal="showDetails" @closeModal="closeModal">
            <template v-slot:header>
                {{ selectedItem.name || 'name' }}
            </template>
            <template v-slot:body>
                <div
                    v-for="field in fields"
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
            <template v-slot:footer>
                <!-- {{ selectedItem }} -->
            </template>
        </VModal>
    </div>
</template>

<script>
import VContent from '../components/VContent';
import VTable from '../components/VTable';
import VModal from '../components/VModal';
import VTableCreate from '../components/VTableCreate';
import VTableRead from '../components/VTableRead';
import modalMixin from '../mixins/modalMixin';

import uuidv1 from 'uuid/v1';

import { mapActions, mapState } from 'vuex';

export default {
    name: 'products',

    components: { VContent, VTable, VModal, VTableCreate, VTableRead },

    mixins: [modalMixin],

    data: () => ({
        selectedItem: {},
        entityName: 'product',
        isCreating: false,
    }),

    methods: {

        // TODO: add to utils / global mixin
        createRandomObj () {
            return Object.assign({}, ... (this.fields.map(field => ({ [field]: '' }))), { id: uuidv1() });
        },

        showInfo (id) {
            this.selectedItem = this.items.find(product => product.id === id)
            this.showDetails = true;
        },

        toggleState () {
            this.isCreating = !this.isCreating
        },

        addRow () {
            this.ADD_ITEM(this.createRandomObj());
        },

        deleteRow (rowId) {
            this.DELETE_ITEM({ prop: 'newItems', id: rowId });
        },

        addFieldValue ([rowId, fieldName, value]) {
            console.log(rowId, fieldName, value)
            this.ADD_FIELD_VALUE({ rowId, fieldName, value });
        },

        init () {
            this.RESET_ARR({ prop: 'newItems' });
            this.ADD_ITEM(this.createRandomObj());
        },

        update (changesArr) {
            this.UPDATE_ITEMS(changesArr);
        },

        ...mapActions('product', [
            'FETCH_DATA', 'ADD_ITEM', 'DELETE_ITEM', 'ADD_FIELD_VALUE', 'RESET_ARR', 'UPDATE_ITEMS'
        ])
    },

    computed: {
        ...mapState('product', ['items', 'fields', 'newItems']),
        ...mapState(['everythingReady'])
    },

    created () {
        this.FETCH_DATA();
    }
}
</script>

<style lang="scss" scoped>
    $modal-text-color: darken($color: #394263, $amount: 10%);
    
    @import '../styles/common.scss';
    @import '../styles/modal.scss';
</style>