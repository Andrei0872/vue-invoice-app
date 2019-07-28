<template>
    <div v-if="isEverythingLoaded">
        <VContent 
            :entityName="entity"
            @insertCreatedItems="onInsertCreatedItems"
            :disableCreateButton="disableCreateButton" 
            :shouldDisplayConfirmCancelButtons="shouldDisplayConfirmCancelButtons"
            @confirmChanges="onConfirmChanges"
            @cancelChanges="onCancelChanges"
        >
            <template v-slot:existingItems>
                <VTableRead 
                    v-if="items.length"
                    :fields="readColumns" 
                    :items="items" 
                    @update="updateRow($event)"
                    @showInfo="showInfo($event)"
                    @deleteRow="prepareRowForDeletion($event)"
                />
                <div v-else class="no-items">
                    There are no products!
                </div>
            </template>
            <template v-slot:createItems>
                 <div @click="addRow" class="icon icon--add-row">
                    <font-awesome-icon icon="plus-circle" />
                </div>
                <VTableCreate 
                    @deleteRow="deleteRowInstantly($event)" 
                    :fields="createColumns" 
                    :items="createdItems"
                    @addField="addField($event)"
                    @tableCreateReady="onTableCreateReady"
                />
            </template>
        </VContent>

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
                        <span>{{ selectedItem[field] !== null ? selectedItem[field] : 'Not Defined' }}</span>
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

import modalMixin from '../mixins/modalMixin';
import commonMixin from '../mixins/commonMixin';
import titleMixin from '../mixins/titleMixin';
import documentUtilityMixin from '../mixins/documentUtilityMixin';

const entityName = 'product';

import { createNamespacedHelpers } from 'vuex';
import * as common from '@/store/modules/common';
const { mapState, mapActions, mapGetters } = createNamespacedHelpers(entityName)

export default {
    name: 'products',

    title: 'Products',

    components: { VContent, VModal, VTableCreate, VTableRead },

    mixins: [modalMixin, commonMixin, titleMixin, documentUtilityMixin],

    data: () => ({
        createColumns: [
            "name",
            "category",
            "sub_category",
            "comestible",
            "expiration_date",
        ],
        readColumns: [
            "name",
            "category",
            "sub_category",
            "comestible",
            "expiration_date",
            "inserted_date"
        ],
        isEverythingLoaded: false,
        entity: entityName,
    }),

    methods: {
        ...mapActions([
            'deleteCreatedItem', 'addFieldValue', 
            'updateItem', 'addCreatedItem', 'resetCreatedItems',
            'insertCreatedItems', 'deleteItem',
            'resetCUDItems',
            'sendModifications',
            'sendHistoryData',
            'resetChanges',
        ]),

        async onInsertCreatedItems () {
            await this.insertCreatedItems();

            this.fetchItems();

            this.sendCreatedHistoryData();
        },

        async onConfirmChanges () {
            console.log('confirm')

            const results =  await this.sendModifications();
            
            results.length && this.fetchItems();

            const [firstReq, secondReq = {}] = results;

            if (
                this.$store.state['document'] && this.$store.state['document'].items.size
                    && (firstReq.shouldReloadDocuments || secondReq.shouldReloadDocuments)
            ) {
                this.refetchDocuments();
            }

            this.deletedItems.size && this.sendDeletedHistoryData();
            
            this.updatedItemsMap.size && this.sendUpdatedHistoryData();

            this.resetCUDItems();
        },

        onCancelChanges () {
            console.log('cancel');

            this.resetCUDItems();
            this.resetChanges();
        },
    },

    computed: {
        ...mapGetters({
            items: 'getItemsAsArr',
            createdItems: 'getCreatedItemsAsArr',
            createdItemsAsArrWithoutIds: 'getCreatedItemsAsArrWithoutIds',
            updatedItems: 'getUpdatedItemsAsArr',
            deletedItems: 'getDeletedItems',
            updatedItemsMap: 'getUpdatedItems',
            itemsMap: 'getItems',
            shouldDisplayConfirmCancelButtons: 'getWhetherItShouldEnableConfirmBtn'
        })
    },

    async created () {
        if (this.$store && !this.$store.state[entityName]) {
            this.$store.registerModule(entityName, common);

            this.fetchItems();
        }

        this.isEverythingLoaded = true;
    }
}
</script>

<style lang="scss" scoped>
    $modal-text-color: darken($color: #394263, $amount: 10%);

    @import '../styles/common.scss';
    @import '../styles/modal.scss';
</style>