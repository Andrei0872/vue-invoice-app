<template>
    <div>
        <h1>{{ $route.params.id }}</h1>
        {{ currentItem }}
        <br>
        {{ items }}
        <button @click="$router.push('/documents')">back</button>
    </div>
</template>

<script>
import VTableRead from '../components/VTableRead';

import { mapGetters, mapActions } from 'vuex'

const entity = 'document_product'

export default {
    components: { VTableRead },

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
        ...mapActions(entity, ['setId'])
    },

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
