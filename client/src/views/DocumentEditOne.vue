<template>
    <div class="container" v-if="currentId !== null">
        <VTableRead 
            :fields="createColumns"
            :items="items"
            @update="setChange($event)"
        />

        <VTableRead :fields="readColumns" :readonly="true" :items="[results]" />

        <button @click="$router.push('/documents')">back</button>
        <button @click="sendUpdates">confirm</button>

        <br>
        <br>
        <!-- Add select component with providers -->
            <!-- The first provider should be the current one -->
        <!-- Add go back btn -->
        <!-- Add confirm btn -->
    </div>
</template>

<script>
import VTableRead from '../components/VTableRead';

import documentMixin from '../mixins/documentMixin';

import { mapGetters, mapActions, mapState } from 'vuex'

const entity = 'document_product'

export default {
    components: { VTableRead },

    mixins: [documentMixin],

    data: () => ({
        currentItem: null,
    }),

    computed: {
        id () {
            return this.$route.params.id
        },

        ...mapGetters(entity, { items: 'getItemsById', changes: 'getChanges' }),

        results () {
            const { total_buy, total_sell } = this.items.reduce((memo, item) => {
                memo['total_buy'] += +(this.changes[item.id] && this.changes[item.id]['buy_price'] || item['buy_price'])
                memo['total_sell'] += +(this.changes[item.id] && this.changes[item.id]['sell_price'] || item['sell_price'])

                return memo;
            }, { total_buy: 0, total_sell: 0 })

            return { ...this.currentItem, total_buy, total_sell };
        },

        ...mapState(entity, ['currentId'])
    },

    methods: {
        ...mapActions(entity, ['setId', 'setChange']),

        sendUpdates () {
            if (!(Object.keys(this.changes).length))
                return;
            // Go on..
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
    }
}
</script>

<style lang="scss" scoped>
    
    .container {
        padding: .3rem 1rem;
    }


</style>
