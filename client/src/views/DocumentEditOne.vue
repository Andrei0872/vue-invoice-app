<template>
    <div class="container">
        <VTableRead
            v-if="this.documentProducts.length"
            :fields="createColumns"
            :items="documentProducts"
            @deleteRow="prepareRowForDeletion($event)"
            @update="addUpdatedProduct($event)"
        />

        <div class="c-new">
            <div @click="addCreatedProduct(createNewItem())" class="icon icon--add-row">
                <font-awesome-icon icon="plus-circle" />
            </div>

            <VTableCreate 
                v-if="createdProducts.length"
                @deleteRow="deleteCreatedProduct($event)" 
                :fields="createColumns" 
                :items="createdProducts"
                @addField="addFieldToCreatedProduct($event)"
                :listItems="products"
            />
        </div>

        <div class="c-provider-info" :style="{ 'margin-top':  createdProducts.length ? 0 : '2rem' }">
            <VSelect
                v-if="providers.length"
                @change.native="$refs.invoiceNr.$el.value = ''"
                @addProvider="$store.commit('SET_PROVIDER', $event)" 
                class="c-select c-select--no-margin" 
                :items="providers"
                :selectedFieldId="currentDocument.provider_id"
            />
            <VInput
                ref="invoiceNr"
                :key="currentDocument.provider_id"
                @blur.native="$store.commit('SET_PROVIDER_INVOICE_NR', $event.target.value)" 
                placeholder="Invoice Nr."
                class="c-input" 
            />
            <VVat />
        </div>

        <VTableRead
            v-if="selectedProvider && documentProducts.length + createdProducts.length > 0"
            :fields="readColumns" 
            :readonly="true" 
            :items="[results]"
        />

        <div v-if="documentProducts.length + createdProducts.length === 0" style="margin-top: 2rem;"></div>
        
        <span class="h-mleft"></span>
        <VButton @click="$router.push('/documents')">Back</VButton>
        <span class="h-mleft"></span>
        <VButton @click="sendUpdates">Confirm</VButton>

        <VModal 
            :showModal="showDetails" 
            :isAboutToDelete="isAboutToDelete" 
            @closeModal="closeModal"
        >
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
import VButton from '../components/VButton';

import documentMixin from '../mixins/documentMixin';
import commonMixin from '../mixins/commonMixin';
import modalMixin from '../mixins/modalMixin';

import * as common from '@/store/modules/common';
import { mapGetters, mapActions, mapState } from 'vuex'

import { hasEmptyValues } from '../utils/';

const entity = 'singleDocument';

export default {
    components: { VTableRead, VModal, VSelect, VInput, VVat, VTableCreate, VButton },

    mixins: [documentMixin, commonMixin, modalMixin],

    data: () => ({
        currentDocument: null,
    }),

    computed: {
        currentDocumentId () {
            return parseInt(this.$route.params.id)
        },

        ...mapGetters(entity, { 
            documentProducts: 'getProductsAsArr', 
            createdProducts: 'getCreatedProductsAsArr',
            updatedProducts: 'getUpdatedProducts',
        }),

        ...mapGetters('provider', { providers: 'getItemsAsArr' }),

        ...mapGetters('product', { products: 'getItemsAsArr' }),

        ...mapGetters('document', { documents: 'getItemsAsArr', }),
        
        selectedProvider () {
            return this.$store.state.selectedProvider
        },

        results () {
            const { total_buy, total_sell, total_vat, total_sell_vat } = [...this.documentProducts, ...this.createdProducts].reduce((memo, product) => {

                const currentUpdatedItem = this.updatedProducts.get(product.id);
                
                memo['total_buy'] += +(currentUpdatedItem && currentUpdatedItem['buy_price'] || product['buy_price'])
                memo['total_sell'] += +(currentUpdatedItem && currentUpdatedItem['sell_price'] || product['sell_price'])
                memo['total_vat'] += +(currentUpdatedItem && currentUpdatedItem['product_vat'] || product['product_vat'])
                memo['total_sell_vat'] += +(currentUpdatedItem && currentUpdatedItem['sell_price_vat'] || product['sell_price_vat'])

                return memo;
            }, { total_buy: 0, total_sell: 0, total_vat: 0, total_sell_vat: 0 })

            return { 
                ...this.currentDocument, 
                total_buy: total_buy.toFixed(2), 
                total_sell: total_sell.toFixed(2), 
                total_vat: total_vat.toFixed(2), 
                total_sell_vat: total_sell_vat.toFixed(2), 
                provider_name: this.selectedProvider.name, 
                provider_id: this.selectedProvider.id,
                invoice_number: this.selectedProvider.invoiceNr || this.currentDocument.invoice_number,
                nr_products: this.documentProducts.length + this.createdProducts.length
            };
        },
    },

    methods: {

        ...mapActions(entity, [
            'setId', 
            'setChange', 
            'updateItems', 
            'deleteFromDoc', 
            'updateDocument', 
            'setAlreadyFetched', 
            'resetDeletedItems',
            'fetchProductsByDocumentId', 
            'resetUpdatedProducts',
            'resetCreatedProducts', 
            'addUpdatedProduct', 
            'addCreatedProduct',
            'deleteCreatedProduct', 
            'addFieldToCreatedProduct', 
            'resetDeletedProducts', 
            'addDeletedProduct',
            'sendUpdatedProducts',
            'sendCreatedProducts',
            'sendDeletedProducts',
            'resetProducts',
        ]),

        ...mapActions('document', ['addNewItem', 'resetArr', 'deleteItem', 'addFieldValue']),

        shouldUpdateDocument () {
            console.log(this.selectedProvider)

            const changes = {};
            let changeFound = false;

            for (const key of Object.keys(this.selectedProvider)) {
                if (key === 'inserted_date' || key === 'URC')
                    continue;

                const currentItemKey = key === 'id' 
                    ? 'provider_id' 
                    : key === 'invoiceNr' 
                        ? 'invoice_number'
                        : key === 'id'
                            ? 'provider_id'
                            : key === 'name'
                                ? 'provider_name'
                                : key

                if (`${this.selectedProvider[key]}` !== `${this.currentDocument[currentItemKey]}`) {
                    changes[currentItemKey] = this.selectedProvider[key];
                    changeFound = true;
                }
            }

            return changeFound ? changes : changeFound;
        },
        
        // ? closer look!
        verifyChanges (changed, pristine) {
            let prevState = ``,
                currentState = ``,
                additionalInfo = ``,
                changeFound = false;
            
            for (const [key, valueObj] of Object.entries(changed)) {
                const pristineItem = pristine.get(+key);
                console.log(pristineItem)

                prevState !== `` && (prevState = prevState.slice(0, -1) + '\n', currentState = currentState.slice(0, -1) + '\n');
                changeFound = false;

                for (const k of Object.keys(valueObj)) {
                    if (`${valueObj[k]}` !== `${pristineItem[k]}`) {
                        prevState += `${k}:${pristineItem[k]}|`
                        currentState += `${valueObj[k]}|`;

                        changeFound = true;
                    }
                }

                changeFound && (additionalInfo += `${pristineItem['product_name']}|`)
            }
            
            return [prevState, currentState, additionalInfo]
        },

        async sendUpdates () {

            return;

            let willChange = false;

            // If the document is updated
            let changes = null;
            if ((changes = this.shouldUpdateDocument())) {
                willChange = true
                await this.updateDocument({ ...changes, id: this.currentDocument.id })

                let prevState = ``,
                    currentState = ``;

                console.log(changes)
                Object.entries(changes).forEach(([key, value]) => {
                    if (key !== 'provider_id') {
                        prevState += `${key}:${this.currentDocument[key]}|`
                        currentState += `${value}|`
                    }
                })

                const message = `Update document information`;
                this.$store.dispatch('dashboard/insertHistoryRow', {
                    entity: `documents/edit/${this.id}`, 
                    message, action_type: 'update',
                    prev_state: prevState.slice(0, -1),
                    current_state: currentState.slice(0, -1),
                });
            }

            // If any product from this document has been updated
            let productsChangedLen = Object.keys(this.changes).length;
            if (productsChangedLen) {
                const [prevState, currentState, additionalInfo] = this.verifyChanges(this.changes, this.pristineData)
                
                console.log(prevState, currentState, additionalInfo)
                
                if (prevState === ``)
                    return;
    
                willChange = true;
                this.updateItems(this.changes);
                
                const message = `Update product${productsChangedLen > 1 ? 's' : ''} in document`;
                this.$store.dispatch('dashboard/insertHistoryRow', {
                    entity: `documents/edit/${this.id}`, 
                    message, 
                    action_type: 'update',
                    prev_state: prevState.slice(0, -1),
                    current_state: currentState.slice(0, -1),
                    additional_info: additionalInfo.slice(0, -1)
                });
            }

            if (this.createdProducts.length && !hasEmptyValues(this.createdProducts)) {
                willChange = true;
                const url = `${this.$store.getters['api/mainURL']}/documents/insert_products_only`
                const config = {
                    ...this.$store.getters['api/config'],
                    body: JSON.stringify({ documentProducts: this.createdProducts, docId: this.id })
                }
                
                await this.$store.dispatch('api/makeRequest', { url, config })

                const message = `Add new products in a document`;
                this.$store.dispatch('dashboard/insertHistoryRow', {
                    entity: `documents/edit/${this.id}`, 
                    message,
                    action_type: 'insert',
                    additional_info: JSON.stringify(this.createdProducts)
                });
            }

            if (!willChange)
                return;

            this.alreadyFetched && this.setAlreadyFetched(false);

            // this.alreadyFetched && this.setAlreadyFetched(false);

            this.$router.push('/documents');
        },

        confirmDelete () {
            this.addDeletedProduct(this.selectedItem);
            this.closeModal();
        }
    },

    async created () {
        /** 
         * Avoid showing any errors when we're in this view
         * and we refresh the page
         */
        if (!this.$store.state.currentEntity) {
            this.$router.push({ name: 'documents' });
            
            return;
        }

        this.currentDocument = { ...this.documents.find(document => document.id === this.currentDocumentId) };

        if (this.$store && !this.$store.state['provider']) {
            this.$store.dispatch('api/FETCH_DATA', { 
                avoidChangingState: true, 
                anotherEntity: 'providers',
            });
        }

        if (this.$store && !this.$store.state['product']) {
            await this.$store.dispatch('api/FETCH_DATA', { 
                avoidChangingState: true, 
                anotherEntity: 'products' 
            });
        }

        // if singleDocument.currentDoc id !== this.currentDocumentId... 
        // || this.documentProducts.length === 0
        await this.fetchProductsByDocumentId(this.currentDocumentId);
    },
}
</script>

<style lang="scss" scoped>
    $modal-text-color: darken($color: #394263, $amount: 10%);
    $main-color: #394263;
    @import '../styles/common.scss';
    @import '../styles/modal.scss';

    .h-mleft {
        margin-left: 1.3rem;
    }
    
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
