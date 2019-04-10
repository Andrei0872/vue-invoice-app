<template>
    <div class="container" v-if="currentId !== null">
        <VTableRead
            v-if="this.items.length"
            :fields="createColumns"
            :items="items"
            @deleteRow="deleteRow($event)"
            @update="setChange($event)"
        />
        <div v-else>
            There are no items left!
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
import VModal from '../components/VModal';
import VSelect from '../components/VSelect';
import VInput from '../components/VInput';
import VVat from '../components/VVat';

import documentMixin from '../mixins/documentMixin';
import commonMixin from '../mixins/commonMixin';
import modalMixin from '../mixins/modalMixin';

import * as common from '@/store/modules/common';
import { mapGetters, mapActions, mapState } from 'vuex'

const entity = 'document_product'

export default {
    components: { VTableRead, VModal, VSelect, VInput, VVat },

    mixins: [documentMixin, commonMixin, modalMixin],

    data: () => ({
        currentItem: null,
    }),

    watch: {
        'items': {
            deep: true,

            handler (newVal) {
                !this.items.length && this.$router.replace({ name: 'documents' });
            }
        }
    },

    computed: {
        id () {
            return parseInt(this.$route.params.id)
        },

        ...mapGetters(entity, { items: 'getItemsById', changes: 'getChanges' }),

        ...mapState('provider', { providers: 'items' }),
        
        selectedProvider () {
            return this.$store.state.selectedProvider
        },

        results () {
            const { total_buy, total_sell } = this.items.reduce((memo, item) => {
                memo['total_buy'] += +(this.changes[item.id] && this.changes[item.id]['buy_price'] || item['buy_price'])
                memo['total_sell'] += +(this.changes[item.id] && this.changes[item.id]['sell_price'] || item['sell_price'])

                return memo;
            }, { total_buy: 0, total_sell: 0 })

            return { 
                ...this.currentItem, 
                total_buy, 
                total_sell, 
                provider_name: this.selectedProvider.name, 
                provider_id: this.selectedProvider.id,
                invoice_number: this.selectedProvider.invoiceNr || this.currentItem.invoice_number,
                nr_products: this.items.length
            };
        },

        ...mapState(entity, ['currentId', 'alreadyFetched'])
    },

    methods: {

        ...mapActions(entity, ['setId', 'setChange', 'updateItems', 'deleteFromDoc', 'updateDocument', 'setAlreadyFetched']),

        shouldUpdateDocument () {
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

        sendUpdates () {
            let hasChanges = false;
            (Object.keys(this.changes).length) && (hasChanges = true, this.updateItems(this.changes))
            
            let changes = null;
            (changes = this.shouldUpdateDocument()) &&  this.updateDocument({ ...changes, id: this.currentItem.id });

            hasChanges = !hasChanges ? changes : hasChanges;

            if (!hasChanges)
                return;

            this.alreadyFetched && this.setAlreadyFetched(false)
            this.$router.push('/documents');
        },

        confirmDelete () {
            // Send a different request in order to only delete this item from its document
            this.deleteFromDoc(this.selectedItem.id)
            this.closeModal();
        }
    },

    async created () {

        if (!this.$store.state.currentEntity) {
            this.$router.push({ name: 'documents' });
            // Avoid showing any errors
            return;
        }

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
