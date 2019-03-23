<template>
    <div class="c-container">
        <div class="c-container__main-buttons">
            <div>
                <VButton @toggleState="isCreating = !isCreating" :btnClass="btnState">
                {{ mainButtonContent }}
                </VButton>
            </div>
            <div>
                <VButton 
                @createItems="addNewItems"
                :showBtn="isCreating"
                btnClass="success"
            >
                Create
            </VButton>
            </div>
        </div>

        <transition name="fade" mode="out-in">
            <div v-if="!isCreating" key="showExisting">
                <slot name="existingItems"></slot>
            </div>
            <div v-else key="createNewEntity">
                <slot name="createItems"></slot>
            </div>
        </transition>

        <!-- Modal here.. -->
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';

import VButton from '../components/VButton';

export default {

    components: { VButton },

    props: {
        entityName: String,
    },

    computed: {
        mainButtonContent () {
            return this.isCreating ? 'Go Back' : `Add ${this.entityName}`
        },

        btnState () {
            return this.isCreating ? 'danger' : 'primary'
        },

        ...mapGetters({
            newItems: 'getEntityNewItems'
        }),

        ...mapState(['currentEntity'])
    },

    data: () => ({
        isCreating: false,
    }),

    methods: {
        addNewItems () {
            
            if (!this.newItems.length)
                return;

            const entityName = this.currentEntity.slice(0, -1);
    
            this.$store.dispatch('api/insertItem', this.newItems);

            this.isCreating = false

            // const allValid = this.filterNewItems(this.newItems)

            // allValid && (this.isCreating = false, console.log('creating data..'))
        },

        filterNewItems (arr) {
            return !(arr.some(
                item => Object.entries(item).some(([key, value]) => key !== 'id' && key === value)
            ))
            // const errors = arr.reduce((memo, currentItem) => {
            //     const id = currentItem.id;

            //     Object.entries(currentItem).forEach(([key, value]))
            // }, {})
        },
    },
}
</script>

<style lang="scss" scoped>

    .c-container {
        position: relative;
        padding: 1rem;
        width: 100%;
        height: 100%;

        &__main-buttons {
            display: flex;
    
            div:first-child {
                flex-basis: 180px;
            }
        }
    }

    /* Transitions */

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .4s;
    }
</style>
