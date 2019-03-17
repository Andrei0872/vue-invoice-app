<template>
    <div>
        {{ items }}
        <VContent v-if="everythingReady" :isCreating="isCreating" :entityName="entityName">
            <template v-slot:existingItems>
                <VTableRead 
                    :fields="fields" 
                    :items="items" 
                    @update="update($event)"
                    @showInfo="showInfo($event)"
                    @deleteRow="deleteRow('items', $event)"
                />  
            </template>
            <template v-slot:createItems>
                 <div @click="addRow" class="icon icon--add-row">
                    <font-awesome-icon icon="plus-circle" />
                </div>
                <VTableCreate 
                    @deleteRow="deleteRow('newItems', $event)" 
                    :fields="fields" 
                    :items="newItems"
                    @addField="addField($event)"
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
import VModal from '../components/VModal';
import VTableCreate from '../components/VTableCreate';
import VTableRead from '../components/VTableRead';
import modalMixin from '../mixins/modalMixin';

import uuidv1 from 'uuid/v1';

import { mapActions, mapState } from 'vuex';

export default {
    name: 'products',

    components: { VContent, VModal, VTableCreate, VTableRead },

    mixins: [modalMixin],

    data: () => ({
        selectedItem: {},
        entityName: 'product',
        isCreating: false,
    }),

    methods: {

        testFn (data) {
            console.log(data)
        },

        // TODO: add to utils / global mixin
        createRandomObj () {
            return Object.assign({}, ... (this.fields.map(field => ({ [field]: field }))), { id: uuidv1() });
        },

        showInfo (row) {
            this.selectedItem = {... row};
            this.showDetails = true;
        },

        toggleState () {
            this.isCreating = !this.isCreating
        },

        addRow () {
            this.addItem(this.createRandomObj());
        },

        deleteRow (prop, rowId) {
            this.deleteItem({ prop, id: rowId });
        },

        addField ([rowId, fieldName, value]) {
            console.log(rowId, fieldName, value)
            this.addFieldValue({ rowId, fieldName, value });
        },

        init () {
            this.reset_arr({ prop: 'newItems' });
            this.addItem(this.createRandomObj());
        },

        update (changesArr) {
            console.log(changesArr)
            this.updateItems(changesArr);
        },

        ...mapActions('document', [
            'fetchData', 'addItem', 'deleteItem', 'addFieldValue', 'reset_arr', 'updateItems'
        ]),
        ...mapActions('product', { 'fetchProducts': 'fetchData' })
    },

    computed: {
        ...mapState('document', ['items', 'fields', 'newItems']),
        ...mapState(['everythingReady']),
        ...mapState('product', { 'products': 'items' })
    },

    created () {
        this.fetchData();
        
        if (!this.products.length) {
            this.fetchProducts();
        }
    }
}
</script>

<style lang="scss" scoped>
    $modal-text-color: darken($color: #394263, $amount: 10%);
    
    @import '../styles/common.scss';
    @import '../styles/modal.scss';
</style>