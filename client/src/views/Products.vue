<template>
    <div>
        
        <VContent v-if="everythingReady" :isCreating="isCreating" :entityName="entityName">
            <template v-slot:existingItems>
                <VTable @showInfo="showInfo" :items="items" :fields="fields" />
            </template>
            <template v-slot:createItems>
                 <div @click="addRow" class="icon icon--add-row">
                    <font-awesome-icon icon="plus-circle" />
                </div>
                <VTable :isCreating="isCreating" :items="newItems" :fields="fields" />
            </template>
        </VContent>
        <div v-else-if="everythingReady === false">
            There are no providers
        </div>

        <VModal :showModal="showDetails" @closeModal="closeModal">
            <template v-slot:header>
                {{ selectedItem.name || 'name' }}
            </template>
            <template v-slot:body>
                <div
                    v-for="field in fields"
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
            <template v-slot:footer>
                <!-- {{ selectedItem }} -->
            </template>
        </VModal>
    </div>
</template>

<script>
import VContent from '../components/VContent';
import VTable from '../components/VTable';
import VModal from '../components/VModal';
import fetchMixin from '../mixins/fetchMixin';
import modalMixin from '../mixins/modalMixin';


export default {
    name: 'products',

    components: { VContent, VTable, VModal },

    mixins: [fetchMixin, modalMixin],

    data: () => ({
        items: [],
        fields: [],
        newItems: [{ id: 1 }],
        selectedItem: {},
        entityName: 'product',
        isCreating: false,
        everythingReady: null
    }),

    methods: {
        showInfo (id) {
            this.selectedItem = this.items.find(product => product.id === id)
            this.showDetails = true;
        },

        toggleState () {
            this.isCreating = !this.isCreating
        },

        addRow () {
            this.newItems.push(
                { id: Math.floor(Math.random() * (500) ) + 1 }
            )
        },
    },
}
</script>

<style lang="scss" scoped>
    $modal-text-color: darken($color: #394263, $amount: 10%);
    
    @import '../styles/common.scss';
    @import '../styles/modal.scss';
</style>