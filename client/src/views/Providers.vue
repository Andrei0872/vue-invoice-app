<template>
    <div>
        <!-- <VContent v-if="everythingReady === true" :entityName="entityName">
            <template v-slot:existingItems>
                <VTableRead 
                    v-if="items.length"
                    :fields="fields" 
                    :items="items" 
                    @update="update($event)"
                    @showInfo="showInfo($event)"
                    @deleteRow="deleteRow('items', $event)"
                />
                <div v-else class="no-items">
                    There are no providers!
                </div>
            </template>
            <template v-slot:createItems>
                 <div @click="addRow" class="icon icon--add-row">
                    <font-awesome-icon icon="plus-circle" />
                </div>
                <VTableCreate 
                    @deleteRow="deleteRow('newItems', $event)" 
                    :fields="fieldsWhenCreating" 
                    :items="newItems"
                    @addField="addField($event)"
                    @init="init"
                />
            </template>
        </VContent>
        <div v-else-if="everythingReady === null">
            Some other error happened
        </div> -->
        {{ items }}
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
        fields: ['test1', 'test2', 'test3'],
    }),

    methods: {

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

        // ...mapActions(entityName, [
        //     'fetchData', 'addItem', 'deleteItem', 'addFieldValue', 'reset_arr', 'updateItems'
        // ])
    },

    computed: {
        everythingReady () {
            console.log(mapState)
            return this.$store.state['everyrthingReady']
        },
        ...mapState(['items'])
    },

    async created () {
        // this.fetchData();
        !(this.$store && this.$store.state[entityName]) && (this.$store.registerModule(entityName, common))

        const r = await this.$store.dispatch('api/FETCH_DATA', 'http://localhost:3000/providers');

        this.$store.commit(`${entityName}/UPDATE_DATA`, r.data);
        
    }
}
</script>

<style lang="scss" scoped>
    $modal-text-color: darken($color: #394263, $amount: 10%);
    
    @import '../styles/common.scss';
    @import '../styles/modal.scss';
</style>