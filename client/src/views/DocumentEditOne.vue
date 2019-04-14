<template>
    <div class="container" v-if="currentId !== null">
        <VTableRead
            v-if="this.items.length"
            :fields="createColumns"
            :items="items"
            @deleteRow="deleteRow($event)"
            @update="setChange($event)"
        />

        <div class="c-new">
            <div @click="addRow" class="icon icon--add-row">
                <font-awesome-icon icon="plus-circle" />
            </div>

            <VTableCreate 
                @deleteRow="deleteRowInstantly($event)" 
                :fields="createColumns" 
                :items="newItems"
                @addField="addField($event)"
            />
        </div>

        <div class="c-provider-info">
            <VSelect
                v-if="providers.length"
                @change.native="$refs.invoiceNr.$el.value = ''"
                @addProvider="$store.commit('SET_PROVIDER', $event)" 
                class="c-select c-select--no-margin" 
                :items="providers"
                :selectedFieldId="currentItem.provider_id"
            />
            <VInput
                ref="invoiceNr"
                :key="currentItem.provider_id"
                @blur.native="$store.commit('SET_PROVIDER_INVOICE_NR', $event.target.value)" 
                placeholder="Invoice Nr."
                class="c-input" 
            />
            <VVat />
        </div>

        <VTableRead
            v-if="selectedProvider"
            :fields="readColumns" 
            :readonly="true" 
            :items="[results]"
        />
        <!-- Add go back btn -->
        <!-- Add confirm btn -->
        <button @click="$router.push('/documents')">back</button>
        <button @click="sendUpdates">confirm</button>
        
        <VModal :showModal="showDetails" :isAboutToDelete="isAboutToDelete" @closeModal="closeModal">
            <template v-slot:header>
                <span>{{ modalTitle }}</span>
            </template>
            <template v-slot:body>
                <div class="c-modal-buttons">
                    <button class="c-modal-buttons__button c-modal-buttons--yes" @click="confirmDelete">Yes</button>
                    <button class="c-modal-buttons__button c-modal-buttons--no" @click="cancelDelete">No</button>
                </div>
            </template>
        </VModal>
    </div>
</template>

<script>
import VTableRead from '../components/VTableRead';
import VTableCreate from '../components/VTableCreate';
import VModal from '../components/VModal';
import VSelect from '../components/VSelect';
import VInput from '../components/VInput';
import VVat from '../components/VVat';

import documentMixin from '../mixins/documentMixin';
import commonMixin from '../mixins/commonMixin';
import modalMixin from '../mixins/modalMixin';

import * as common from '@/store/modules/common';
import { mapGetters, mapActions, mapState } from 'vuex'

import { hasEmptyValues } from '../utils/';

const entity = 'document_product'

export default {
    components: { VTableRead, VModal, VSelect, VInput, VVat, VTableCreate },

    mixins: [documentMixin, commonMixin, modalMixin],

    data: () => ({
        currentItem: null,
    }),

    computed: {
        id () {
            return parseInt(this.$route.params.id)
        },

        ...mapGetters(entity, { items: 'getItemsById', changes: 'getChanges' }),

        ...mapState('provider', { providers: 'items' }),

        ...mapState('document', ['newItems']),
        
        selectedProvider () {
            return this.$store.state.selectedProvider
        },

        results () {
            const { total_buy, total_sell, total_vat, total_sell_vat } = [...this.items, ...this.newItems].reduce((memo, item) => {
                memo['total_buy'] += +(this.changes[item.id] && this.changes[item.id]['buy_price'] || item['buy_price'])
                memo['total_sell'] += +(this.changes[item.id] && this.changes[item.id]['sell_price'] || item['sell_price'])
                memo['total_vat'] += +(this.changes[item.id] && this.changes[item.id]['product_vat'] || item['product_vat'])
                memo['total_sell_vat'] += +(this.changes[item.id] && this.changes[item.id]['sell_price_vat'] || item['sell_price_vat'])

                return memo;
            }, { total_buy: 0, total_sell: 0, total_vat: 0, total_sell_vat: 0 })

            return { 
                ...this.currentItem, 
                total_buy: total_buy.toFixed(2), 
                total_sell: total_sell.toFixed(2), 
                total_vat: total_vat.toFixed(2), 
                total_sell_vat: total_sell_vat.toFixed(2), 
                provider_name: this.selectedProvider.name, 
                provider_id: this.selectedProvider.id,
                invoice_number: this.selectedProvider.invoiceNr || this.currentItem.invoice_number,
                nr_products: this.items.length + this.newItems.length
            };
        },

        ...mapState(entity, ['currentId', 'alreadyFetched'])
    },

    methods: {

        ...mapActions(entity, ['setId', 'setChange', 'updateItems', 'deleteFromDoc', 'updateDocument', 'setAlreadyFetched']),

        ...mapActions('document', ['addNewItem', 'resetArr', 'deleteItem', 'addFieldValue']),

        shouldUpdateDocument () {
            console.log(this.selectedProvider)

            const changes = {};
            let changeFound = false;

            for (const key of Object.keys(this.selectedProvider)) {
                if (key === 'inserted_date' || key === 'URC')
                    continue;

                // FIXME: switch
                const currentItemKey = key === 'id' 
                    ? 'provider_id' 
                    : key === 'invoiceNr' 
                        ? 'invoice_number'
                        : key === 'id'
                            ? 'provider_id'
                            : key === 'name'
                                ? 'provider_name'
                                : key

                if (this.selectedProvider[key] !== this.currentItem[currentItemKey]) {
                    changes[currentItemKey] = this.selectedProvider[key];
                    changeFound = true;
                }
            }

            return changeFound ? changes : changeFound;
        },

        async sendUpdates () {
            let willChange = false;

            // If the document is updated
            let changes = null;
            if ((changes = this.shouldUpdateDocument())) {
                willChange = true
                await this.updateDocument({ ...changes, id: this.currentItem.id })

                const message = `Update document information`;
                this.$store.dispatch('dashboard/insertHistoryRow', { entity: 'document', message, action_type: 'update' });
            }

            // If any product from this document has been updated
            if (Object.keys(this.changes).length) {
                willChange = true;
                this.updateItems(this.changes);
                
                const message = `Update product in document`;
                this.$store.dispatch('dashboard/insertHistoryRow', { entity: 'document', message, action_type: 'update' });
            }

            if (this.newItems.length && !hasEmptyValues(this.newItems)) {
                willChange = true;
                const url = `${this.$store.getters['api/mainURL']}/documents/insert_products_only`
                const config = {
                    ...this.$store.getters['api/config'],
                    body: JSON.stringify({ items: this.newItems, docId: this.id })
                }

                await this.$store.dispatch('api/makeRequest', { url, config })

                const message = `Add new products in a document`;
                this.$store.dispatch('dashboard/insertHistoryRow', { entity: 'document', message, action_type: 'insert' });
            }

            if (!willChange)
                return;

            this.alreadyFetched && this.setAlreadyFetched(false);


            this.$router.push('/documents');
        },

        confirmDelete () {
            // Send a different request in order to only delete this item from its document
            this.deleteFromDoc(this.selectedItem.id)
            this.closeModal();

            const message = `Delete one product from document`
            this.$store.dispatch('dashboard/insertHistoryRow', { entity: 'document', message, action_type: 'delete' });
        }
    },

    async created () {

        if (!this.$store.state.currentEntity) {
            this.$router.push({ name: 'documents' });
            // Avoid showing any errors
            return;
        }

        this.resetArr({ prop: 'newItems' })
        this.setChange({})
        this.setId(this.id);

        this.currentItem = { ...this.$store.getters['getEntityItems'].find(item => item.id === this.id) };

        !(this.$store && this.$store.state['provider']) 
            && ((this.$store.registerModule('provider', common)), this.$store.dispatch('api/FETCH_DATA', { avoidChangingState: true, anotherEntity: 'providers' }));

        // We want to get the products first, because the items will depend on them
        // Have a look at store/modules/document_product: actions/fetchById
        !(this.$store && this.$store.state['product'])
        && ((this.$store.registerModule('product', common)), await this.$store.dispatch('api/FETCH_DATA', { avoidChangingState: true, anotherEntity: 'products' }));

        this.items.length === 0 && this.$store.dispatch(`${entity}/fetchById`, this.id);
    },

    beforeRouteLeave (to, from, next) {
        this.$store.commit('SET_PROVIDER', null);
        this.$store.commit('document_product/SET_LAST_DELETED_DOC_ID', -1);
        next();   
    },
}
</script>

<style lang="scss" scoped>
    $modal-text-color: darken($color: #394263, $amount: 10%);
    $main-color: #394263;
    @import '../styles/common.scss';
    @import '../styles/modal.scss';

    .container {
        padding: .3rem 1rem;
    }

    .c-provider-info {
        display: flex;
        justify-content: flex-start;

        .c-select {
            margin-left: 5rem;
            padding: 7px;
            border: 1px solid $main-color;
            outline: none;
            background-color: rgba($color: $main-color, $alpha: .1);
            border-radius: 7px;

            &--no-margin {
                margin-left: 2rem;
            }
        }

        .c-input {
            border-radius: 7px;
            margin-left: 5rem;
            padding: .3rem;
            border: 1px solid #303753;
        }
    }

</style>
