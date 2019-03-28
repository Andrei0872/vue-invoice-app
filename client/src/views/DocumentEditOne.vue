<template>
    <div class="container">
        <VTableRead 
            :fields="createColumns"
            :items="items"
            @update="update"
        />
        {{ currentItem }}
        <br>
        <!-- {{ items }} -->

        <button @click="$router.push('/documents')">back</button>

        <!-- Add select component with providers -->
        <!-- Final result -->
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

        ...mapGetters(entity, { items: 'getItemsById' }),
    },

    methods: {
        ...mapActions(entity, ['setId']),

        update (data) {
            console.log('updating', data)
        }
    },

    // beforeRouteLeave (to, from, next) {
    //     console.log(to)
    //     // this.$router.push('/providers')
    // },

    created () {

        if (!this.$store.state.currentEntity) {
            this.$router.push({ name: 'documents' });
            // Avoid showing any errors
            return;
        }

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
