<template>
    <div class="container" v-if="currentId !== null">
        <VTableRead 
            :fields="createColumns"
            :items="items"
            @deleteRow="deleteRow($event)"
            @update="setChange($event)"
        />

        <div class="c-provider-info">
            <VSelect @addProvider="$store.commit('SET_PROVIDER', $event)" class="c-select" :items="providers" />
        </div>

        <VTableRead :fields="readColumns" :readonly="true" :items="[results]" />
        {{ currentItem }}
        <button @click="$router.push('/documents')">back</button>
        <button @click="sendUpdates">confirm</button>

        <br>
        <br>
        <!-- Add select component with providers -->
            <!-- The first provider should be the current one -->

        <!-- Add go back btn -->
        <!-- Add confirm btn -->
        
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

import documentMixin from '../mixins/documentMixin';
import commonMixin from '../mixins/commonMixin';
import modalMixin from '../mixins/modalMixin';

import { mapGetters, mapActions, mapState } from 'vuex'

const entity = 'document_product'

export default {
    components: { VTableRead, VModal, VSelect },

    mixins: [documentMixin, commonMixin, modalMixin],

    data: () => ({
        currentItem: null,
    }),

    computed: {
        id () {
            return this.$route.params.id
        },

        ...mapGetters(entity, { items: 'getItemsById', changes: 'getChanges' }),
        ...mapState('provider', { providers: 'items' }),

        results () {
            const { total_buy, total_sell } = this.items.reduce((memo, item) => {
                memo['total_buy'] += +(this.changes[item.id] && this.changes[item.id]['buy_price'] || item['buy_price'])
                memo['total_sell'] += +(this.changes[item.id] && this.changes[item.id]['sell_price'] || item['sell_price'])

                return memo;
            }, { total_buy: 0, total_sell: 0 })

            return { ...this.currentItem, total_buy, total_sell, };
        },

        ...mapState(entity, ['currentId'])
    },

    methods: {
        ...mapActions(entity, ['setId', 'setChange', 'updateItems', 'deleteFromDoc']),

        async sendUpdates () {
            if (!(Object.keys(this.changes).length))
                return;
            
            const resp = await this.updateItems(this.changes);
            console.log(resp)

            this.$router.push('/documents');
        },

        confirmDelete () {
            // this.selectedItem.id
            // Send a different request in order to only delete this item from its documnet
            this.deleteFromDoc(this.selectedItem.id)
            this.closeModal();
        }
    },

    created () {

        if (!this.$store.state.currentEntity) {
            this.$router.push({ name: 'documents' });
            // Avoid showing any errors
            return;
        }

        this.setChange({})
        this.setId(this.id);

        this.currentItem = this.$store.getters['getEntityItems'].find(item => item.id === this.id);

        this.items.length === 0 && this.$store.dispatch(`${entity}/fetchById`, this.id);
    },

    beforeRouteLeave (to, from, next) {
        this.$store.commit('SET_PROVIDER', null);
        next();   
    },
}
</script>

<style lang="scss" scoped>
    $modal-text-color: darken($color: #394263, $amount: 10%);

    @import '../styles/modal.scss';

    .container {
        padding: .3rem 1rem;
    }


</style>
