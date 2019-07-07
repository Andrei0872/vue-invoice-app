<template>
    <div v-if="isEverythingLoaded">
        <VContent 
            :disableCreateButton="disableCreateButton" 
            :entityName="entity"
            @insertCreatedItems="onInsertCreatedItems"
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
                    There are no providers!
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

import modalMixin from '../mixins/modalMixin';
import commonMixin from '../mixins/commonMixin';
import titleMixin from '../mixins/titleMixin';

const entityName = 'provider';

import uuidv1 from 'uuid/v1';

import { createNamespacedHelpers, mapMutations } from 'vuex';
import * as common from '@/store/modules/common';
const { mapActions, mapGetters } = createNamespacedHelpers(entityName)

import { canJoinMapsBasedOnProp } from '@/utils/';

export default {
    name: 'providers',

    title: 'Providers',

    components: { VContent, VModal, VTableCreate, VTableRead },

    mixins: [modalMixin, commonMixin, titleMixin],

    data: () => ({
        readColumns: ['name', 'URC', 'inserted_date'],
        createColumns: ['name', 'URC'],
        isEverythingLoaded: false,
        entity: entityName
    }),

    methods: {
        ...mapActions([
            'deleteCreatedItem', 'addFieldValue', 
            'updateItem', 'addCreatedItem', 'resetCreatedItems',
            'insertCreatedItems', 'deleteItem',
            'sendModifications',
            'resetCUDItems',
        ]),

        async onConfirmChanges () {
            console.log('confirm')

            const results =  await this.sendModifications();
            
            results.length && this.fetchItems();

            this.deleteDocumentsOfDeletedProviders();

            this.resetCUDItems();
        },

        onCancelChanges () {
            console.log('cancel');

            this.resetCUDItems();
        },

        deleteDocumentsOfDeletedProviders () {
            const documents = this.$store.state['document'] && this.$store.state['document'].items;
            const deletedProviders = this.$store.state['provider'].deletedItems

            if (
                documents
                && documents.size
                && canJoinMapsBasedOnProp(documents, deletedProviders, 'provider_id')
            ) {
                const endpoint = 'documents';
                const entity = 'document';
                const url = this.$store.getters['mainUrl'] + endpoint;

                this.$store.dispatch('api/makeGETRequest', { url, entity });
            }
        },

        // TODO: add to common
        async onInsertCreatedItems () {
            await this.insertCreatedItems();

            await this.$store.dispatch('api/makeGETRequest', { url: this.backendUrl, entity: this.entity });
        }
    },

    computed: {
        ...mapGetters({
            items: 'getItemsAsArr',
            createdItems: 'getCreatedItemsAsArr',
            updatedItems: 'getUpdatedItemsAsArr',
            shouldDisplayConfirmCancelButtons: 'getWhetherItShouldCancelOrConfirmChanges'
        }),
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