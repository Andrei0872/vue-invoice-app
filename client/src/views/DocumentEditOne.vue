<template>
    <div class="container" v-if="currentDocument">
        <VTableRead
            v-if="this.documentProducts.length"
            :fields="createColumns"
            :items="documentProducts"
            @deleteRow="prepareRowForDeletion($event)"
            @update="addUpdatedProduct($event)"
        />

        <div class="c-new">
            
            <VButton 
                @click="addCreatedProduct(createNewItem())" 
                :disabled="!productsAsList.length"
            >
                <font-awesome-icon class="is-base-icon" icon="plus-circle" />
            </VButton>

            <VTableCreate 
                v-if="createdProducts.length"
                @deleteRow="deleteCreatedProduct($event)" 
                :fields="createColumns" 
                :items="createdProducts"
                @addField="addFieldToCreatedProduct($event)"
                :listItems="productsAsList"
            />
        </div>

        <!-- TODO: delete from global store: invoice nr and provider -->
        <div class="c-provider-info" :style="{ 'margin-top':  createdProducts.length ? 0 : '2rem' }">
            <VSelect
                v-if="providers.length"
                @change.native="$refs.invoiceNr.$el.value = ''"
                @addProvider="setCurrentDocumentNewData({ provider_id: $event.id })"
                class="c-select c-select--no-margin" 
                :items="providers"
                :selectedFieldId="currentDocument.provider_id"
            />
            <VInput
                ref="invoiceNr"
                :key="currentDocument.provider_id"
                @blur.native="setCurrentDocumentNewData({ invoice_number: $event.target.value })" 
                placeholder="Invoice Nr."
                class="c-input" 
            />
            <VVat />
        </div>

        <VTableRead
            v-if="currentDocument.provider_id && documentProducts.length + createdProducts.length > 0"
            :fields="readColumns" 
            :readonly="true" 
            :items="[results]"
        />

        <div v-if="documentProducts.length + createdProducts.length === 0" style="margin-top: 2rem;"></div>
        
        <span class="h-mleft"></span>
        <VButton @click="$router.push('/documents')">Back</VButton>
        <span class="h-mleft"></span>
        <VButton :disabled="!shouldEnableConfirmButton" @click="sendUpdates">Confirm</VButton>

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
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'

import { hasEmptyValues } from '../utils/';

const entity = 'singleDocument';

export default {
    components: { VTableRead, VModal, VSelect, VInput, VVat, VTableCreate, VButton },

    mixins: [documentMixin, commonMixin, modalMixin],

    data: () => ({
        currentDocument: null,
        documentNeedsUpdate: false,
        createdItemsObservee: 'singleDocument/getCreatedProductsAsArr',
        // Determine whether some products were deleted or not
        initialProductsLen: 0,
    }),

    computed: {
        currentDocumentId () {
            return parseInt(this.$route.params.id)
        },

        ...mapState(entity, {
            currentDocumentNewData: 'currentDocumentNewData'
        }),

        ...mapGetters(entity, { 
            documentProducts: 'getProductsAsArr',
            existingProductsIds: 'getExistingProductsIds',
            createdProducts: 'getCreatedProductsAsArr',
            createdProductsIds: 'getCreatedProductsIds',
            updatedProducts: 'getUpdatedProducts',
            shouldEnableConfirmButton: 'getWhetherItShouldEnableConfirmBtn',
            hasDocumentDataChanged: 'getHasDocumentDataChanged'
        }),

        ...mapGetters('provider', { providers: 'getItemsAsArr', providersMap: 'getItems' }),

        ...mapGetters('product', { products: 'getItemsAsArr' }),

        ...mapGetters('document', { documents: 'getItemsAsArr', }),

        results () {

            const { total_buy, total_sell, total_vat, total_sell_vat } = [...this.documentProducts, ...this.createdProducts].reduce((memo, product) => {

                const currentUpdatedItem = this.updatedProducts.get(product.id);
                
                memo['total_buy'] += +(currentUpdatedItem && currentUpdatedItem['buy_price'] || product['buy_price'])
                memo['total_sell'] += +(currentUpdatedItem && currentUpdatedItem['sell_price'] || product['sell_price'])
                memo['total_vat'] += +(currentUpdatedItem && currentUpdatedItem['product_vat'] || product['product_vat'])
                memo['total_sell_vat'] += +(currentUpdatedItem && currentUpdatedItem['sell_price_vat'] || product['sell_price_vat'])

                return memo;
            }, { total_buy: 0, total_sell: 0, total_vat: 0, total_sell_vat: 0 })

            const newProviderId = this.currentDocumentNewData && this.currentDocumentNewData.provider_id || false;
            const currentProviderId = newProviderId || this.currentDocument.provider_id;
            const currentInvoiceNumber = 
                this.currentDocumentNewData && this.currentDocumentNewData.invoice_number 
                    || this.currentDocument.invoice_number;

            console.log('this.currentDocumentNewData', this.currentDocumentNewData)
            console.log(currentInvoiceNumber)

            return { 
                ...this.currentDocument, 
                total_buy: total_buy.toFixed(2), 
                total_sell: total_sell.toFixed(2), 
                total_vat: total_vat.toFixed(2), 
                total_sell_vat: total_sell_vat.toFixed(2), 
                provider_name: this.providersMap.get(currentProviderId).name, 
                provider_id: currentProviderId,
                invoice_number: currentInvoiceNumber,
                nr_products: this.documentProducts.length + this.createdProducts.length,
            };
        },

        productsAsList () {
            return this.products.filter(
                ({ id: productId }) => !this.existingProductsIds[productId] && !this.createdProductsIds[productId]
            )
        },
    },

    methods: {

        ...mapMutations(entity, {
            setCurrentDocumentOwnPristineData: 'SET_CURRENT_DOCUMENT_OWN_PRISTINE_DATA',
            setCurrentDocumentNewData: 'SET_CURRENT_DOCUMENT_NEW_DATA',
            resetDocumentData: 'RESET_DOCUMENT_DATA',
        }),

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
            'fetchOneDocument',
        ]),

        ...mapActions('document', ['addNewItem', 'resetArr', 'deleteItem', 'addFieldValue']),

        async sendUpdates () {            
            if (this.hasDocumentDataChanged) {
                this.documentNeedsUpdate = true;

                const invoice_number = this.currentDocumentNewData.invoice_number || false;
                const provider_id = this.currentDocumentNewData.provider_id || false;
                const provider_name = provider_id
                        && this.providersMap.get(provider_id).name
                        || false;

                const newDocumentData = {
                    ...invoice_number && { invoice_number },
                    ...provider_name && { provider_name },
                };

                const oldDocumentData = {
                    ...invoice_number && { invoice_number: this.currentDocument.invoice_number },
                    ...provider_name && { provider_name: this.currentDocument.provider_name },
                };
                
                const response = await this.updateDocument({
                    docId: this.currentDocument.id,
                    ...provider_id && { provider_id },
                    newDocumentData,
                    oldDocumentData,
                });

                this.openModalBox(response.message);
            }

            if (this.initialProductsLen !== this.documentProducts.length) {
                this.documentNeedsUpdate = true;
                
                const deleteResponse = await this.sendDeletedProducts(this.currentDocumentId);

                if (deleteResponse.message) {
                    this.openModalBox(deleteResponse.message);
                }

                if (deleteResponse.shouldDeletedDoc) {
                    this.openModalBox('Document has been deleted because its provider has been removed');
                }
            }

            if (this.updatedProducts.size) {
                this.documentNeedsUpdate = true;

                const updateResponse = await this.sendUpdatedProducts();
                
                if (updateResponse.message) {
                    this.openModalBox(updateResponse.message);
                }
            }

            if (this.createdProducts.length) {
                this.documentNeedsUpdate = true;

                const createResponse = await this.sendCreatedProducts(this.currentDocumentId);
                
                if (createResponse.message) {
                    this.openModalBox(createResponse.message);
                }
            }
            
            const documentHasNoProducts = this.documentProducts.length + this.createdProducts.length === 0;

            if (this.documentNeedsUpdate) {
                if (documentHasNoProducts) {
                    this.fetchItems(null, 'document');
                } else {
                    const documentsUrl = this.mainUrl + 'documents';
    
                    this.fetchOneDocument(documentsUrl + `?id=${this.currentDocumentId}`);
                }
            }

            this.$router.push('/documents'); 
        },

        confirmDelete () {
            this.addDeletedProduct(this.selectedItem);
            this.closeModal();
        },
    },

    beforeRouteLeave (to, from, next) {
        this.resetProducts();
        this.resetCreatedProducts();
        this.resetDocumentData();

        next();
    },

    beforeRouteEnter (to, from, next) {
        /** 
         * Avoid showing any errors when we're in this view
         * and we refresh the page
         */
        if (from.name === null) {
            return next({ name: 'documents' });
        }

        next();
    },

    async created () {

        this.currentDocument = { ...this.documents.find(document => document.id === this.currentDocumentId) };

        this.setCurrentDocumentOwnPristineData({
            provider_id: this.currentDocument.provider_id,
            invoice_number: this.currentDocument.invoice_number,
        });

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
        
        this.initialProductsLen = this.documentProducts.length;
        this.initialListItemsLen = this.productsAsList.length;

        this.initCreatedItemsWatcher();
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

    .is-base-icon {
        width: 2rem;
        height: 2rem;
        color: green;
    }

</style>
