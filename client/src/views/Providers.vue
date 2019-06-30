<template>
    <div>
        <VContent v-if="isEverythingLoaded" entityName="provider">
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

import modalMixin from '../mixins/modalMixin';
import commonMixin from '../mixins/commonMixin';
import titleMixin from '../mixins/titleMixin';

const entityName = 'provider';

import uuidv1 from 'uuid/v1';

import { createNamespacedHelpers } from 'vuex';
import * as common from '@/store/modules/common';
const { mapState, mapActions, mapGetters } = createNamespacedHelpers(entityName)

export default {
    name: 'providers',

    title: 'Providers',

    components: { VContent, VModal, VTableCreate, VTableRead },

    mixins: [modalMixin, commonMixin, titleMixin],

    data: () => ({
        readColumns: ['name', 'URC', 'inserted_date'],
        createColumns: ['name', 'URC'],
        isEverythingLoaded: false
    }),

    methods: mapActions(['resetArr', 'addNewItem', 'deleteItem', 'addFieldValue', 'updateItems']),

    computed: {
        ...mapState([/* 'items',  */'newItems']),
        
        ...mapGetters({
            items: 'getItemsAsArr'
        })
    },

    async created () {
        if (this.$store && !this.$store.state[entityName]) {
            this.$store.registerModule(entityName, common);

            await this.$store.dispatch('api/FETCH_DATA');
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