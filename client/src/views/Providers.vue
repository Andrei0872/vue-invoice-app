<template>
    <div>
        <VContent v-if="everythingReady" :isCreating="isCreating" entityName="provider">
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
    </div>
</template>

<script>
import VContent from '../components/VContent';
import fetchMixin from '../mixins/fetchMixin';
import VTable from '../components/VTable';

export default {
    name: 'providers',

    components: { VContent, VTable },

    mixins: [fetchMixin],

    data: () => ({
        items: [],
        fields: [],
        newItems: [{ id: 1 }],
        entityName: 'provider',
        isCreating: false,
        everythingReady: null
    }),

    methods: {
        showInfo (id) {
            // this.selectedProduct = this.products.find(product => product.id === id)
            console.log(id)
            // this.showDetails = true;
        },

        toggleState () {
            this.isCreating = !this.isCreating
        },

        addRow () {
            this.newItems.push(
                { id: Math.floor(Math.random() * (500) ) + 1 }
            )
        }
    },
}
</script>

<style lang="scss" scoped>
    @import '../styles/common.scss';
</style>
