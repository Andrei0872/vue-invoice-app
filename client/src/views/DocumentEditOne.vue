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
                :listItems="productsAsList"
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
import { mapGetters, mapActions, mapState } from 'vuex'

import { hasEmptyValues } from '../utils/';

const entity = 'singleDocument';

export default {
    components: { VTableRead, VModal, VSelect, VInput, VVat, VTableCreate, VButton },

    mixins: [documentMixin, commonMixin, modalMixin],

    data: () => ({
        currentDocument: null,
        documentNeedsUpdate: false,

        // Determine whether some products were deleted or not
        initialProductsLen: 0,
    }),

    computed: {
        currentDocumentId () {
            return parseInt(this.$route.params.id)
        },

        ...mapGetters(entity, { 
            documentProducts: 'getProductsAsArr',
            existingProductsIds: 'getExistingProductsIds',
            createdProducts: 'getCreatedProductsAsArr',
            createdProductsIds: 'getCreatedProductsIds',
            updatedProducts: 'getUpdatedProducts',
            shouldEnableConfirmButton: 'getWhetherItShouldEnableConfirmBtn'
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

        productsAsList () {
            return this.products.filter(
                ({ id: productId }) => !this.existingProductsIds[productId] && !this.createdProductsIds[productId]
            )
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

        getDocumentChanges () {
            console.log(this.selectedProvider)

            const changes = {};
            const previousData = {};
            let changeFound = false;

            for (const key of Object.keys(this.selectedProvider)) {
                if (key === 'inserted_date' || key === 'URC')
                    continue;

                const currentItemKey =
                    key === 'id'
                        ? 'provider_id'
                        : key === 'invoiceNr' 
                            ? 'invoice_number'
                                : key === 'name'
                                    ? 'provider_name'
                                    : key

                if (`${this.selectedProvider[key]}` !== `${this.currentDocument[currentItemKey]}`) {
                    changes[currentItemKey] = this.selectedProvider[key];
                    previousData[currentItemKey] = this.currentDocument[currentItemKey];
                    changeFound = true;
                }
            }

            return changeFound ? { changes, previousData } : changeFound;
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
            const documentChanges = this.getDocumentChanges();
            if (documentChanges) {
                this.documentNeedsUpdate = true;
                
                await this.updateDocument({ ...documentChanges, id: this.currentDocument.id })
            }

            if (this.initialProductsLen !== this.documentProducts.length) {
                this.documentNeedsUpdate = true;
                
                const deleteResponse = await this.sendDeletedProducts(this.currentDocumentId);
                console.log('deleteResponse', deleteResponse)
            }

            if (this.updatedProducts.size) {
                this.documentNeedsUpdate = true;

                const updateResponse = await this.sendUpdatedProducts();
                console.log('updateResponse', updateResponse)
            }

            if (this.createdProducts.length) {
                this.documentNeedsUpdate = true;

                const createResponse = await this.sendCreatedProducts(this.currentDocumentId);
                console.log('createResponse', createResponse);
            }

            if (this.documentNeedsUpdate) {
                const documentsUrl = this.mainUrl + 'documents';
                const documentEntity = 'document';

                await this.fetchItems(documentsUrl, documentEntity);
            }

            this.$router.push('/documents'); 
        },

        confirmDelete () {
            this.addDeletedProduct(this.selectedItem);
            this.closeModal();
        }
    },

    beforeRouteLeave (to, from, next) {
        this.resetProducts();
        // this.$store.commit('SET_PROVIDER', null);

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
