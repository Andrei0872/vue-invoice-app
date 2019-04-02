<template>
    <div>
        <!-- TODO: add notification :D - based on a vuex's state property -->
        <VContent v-if="everythingReady === true" entityName="document">
            <template v-slot:existingItems>
                <VTableRead 
                    v-if="items.length"
                    :fields="readColumns" 
                    :items="items"
                    showDelete
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
                    <VInput @blur.native="$store.commit('SET_PROVIDER_INVOICE_NR', $event.target.value)" placeholder="Invoice Nr." class="c-input" />
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
            <template v-slot:body>
                <div
                    v-for="keyVal in Object.entries(selectedItem)"
                    :key="keyVal[1].id"
                    class="modal-body__row"
                >
                    <div class="modal-body__prop"><span>{{ keyVal[0] }}</span></div>
                    <div class="modal-body__arrow"><font-awesome-icon icon="arrow-right" /></div>
                    <div class="modal-body__value">
                        <span>{{ keyVal[1] }}</span>
                    </div>
                </div>

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
import VInput from '../components/VInput';

import modalMixin from '../mixins/modalMixin';
import commonMixin from '../mixins/commonMixin';
import documentMixin from '../mixins/documentMixin';

const entityName = 'document';
const providerEntity = 'provider';

import { createNamespacedHelpers } from 'vuex';
import * as common from '@/store/modules/common';
const { mapState, mapActions } = createNamespacedHelpers(entityName);
const { mapState: mapStateProvider } = createNamespacedHelpers(providerEntity);


export default {
    name: 'documents',

    components: { VContent, VModal, VTableCreate, VTableRead, VSelect, VInput },

    mixins: [modalMixin, commonMixin, documentMixin],

    methods: {
        ...mapActions(['resetArr', 'addNewItem', 'deleteItem', 'addFieldValue', 'updateItems']),

        showInfo ({ id }) {
            this.$router.replace({ name: 'documentEditOne', params: { id } });
        }
    },

    computed: {
        ...mapState(['items', 'newItems']),
        ...mapStateProvider({ providers: 'items' })
    },

    beforeRouteLeave (to, from, next) {
        this.$store.commit('SET_PROVIDER', null);
        next();   
    },

    created () {
        !(this.$store && this.$store.state[entityName]) && (this.$store.registerModule(entityName, common))
        
        !(this.items.length) && this.$store.dispatch('api/FETCH_DATA');
        
        // TODO: make it available only when editing / updating
        !(this.store && this.$store.state['product']) 
            && ((this.$store.registerModule('product', common)), this.$store.dispatch('api/FETCH_DATA', { avoidChangingState: true, anotherEntity: 'products' }));

        // TODO: make it available only when editing / updating
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

        & .c-input {
            border-radius: 7px;
            margin-left: 5rem;
            padding: .3rem;
            border: 1px solid #303753;
        }
    }
</style>