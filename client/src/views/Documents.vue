<template>
    <div>
        <!-- TODO: add notification :D - based on a vuex's state property -->
        <VContent v-if="everythingReady === true" entityName="document">
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
                <div class="l-flex">
                    <div @click="addRow" class="icon icon--add-row">
                        <font-awesome-icon icon="plus-circle" />
                    </div>
                    <VSelect @addProvider="$store.commit('SET_PROVIDER', $event)" class="c-select" :items="providers" />
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
import VSelect from '../components/VSelect';

import modalMixin from '../mixins/modalMixin';
import commonMixin from '../mixins/commonMixin';

const entityName = 'document';
const providerEntity = 'provider';

import { createNamespacedHelpers } from 'vuex';
import * as common from '@/store/modules/common';
const { mapState, mapActions } = createNamespacedHelpers(entityName);
const { mapState: mapStateProvider } = createNamespacedHelpers(providerEntity);


export default {
    name: 'documents',

    components: { VContent, VModal, VTableCreate, VTableRead, VSelect },

    mixins: [modalMixin, commonMixin],

    data: () => ({
        createColumns: [
            "product_name",
            "quantity",
            "quantity_type",
            "buy_price",
            "markup",
            "sell_price",
            "currency"
        ],
        readColumns: [
            "provider_name",
            "total_buy",
            "total_sell",
            "invoice_number",
            "inserted_date"
        ]
    }),

    methods: mapActions(['resetArr', 'addNewItem', 'deleteItem', 'addFieldValue', 'updateItems']),

    computed: {
        ...mapState(['items', 'newItems']),
        ...mapStateProvider({ providers: 'items' })
    },

    beforeRouteLeave (to, from, next) {
        this.$store.commit('SET_PROVIDER', null);
        next();   
    },

    async created () {
        !(this.$store && this.$store.state[entityName]) && (this.$store.registerModule(entityName, common))
        
        !(this.items.length) && this.$store.dispatch('api/FETCH_DATA');

        !(this.store && this.$store.state['product']) 
            && ((this.$store.registerModule('product', common)), this.$store.dispatch('api/FETCH_DATA', { avoidChangingState: true, anotherEntity: 'products' }));

        !(this.store && this.$store.state['provider']) 
            && ((this.$store.registerModule('provider', common)), this.$store.dispatch('api/FETCH_DATA', { avoidChangingState: true, anotherEntity: 'providers' }));
    },
}
</script>

<style lang="scss" scoped>
    $modal-text-color: darken($color: #394263, $amount: 10%);

    @import '../styles/common.scss';
    @import '../styles/modal.scss';

    .l-flex {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;

        & .c-select {
            margin-left: 5rem;
            padding: 7px;
            border: 1px solid $main-color;
            outline: none;
            background-color: rgba($color: $main-color, $alpha: .1);
            border-radius: 7px;
        }
    }
</style>