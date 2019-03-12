<template>
    <!-- FIXME: exclude dates when creating new items -->
    <div class="c-container">
        <div class="c-container__main-buttons">
            <div>
                <VButton @toggleState="$parent.toggleState" :btnClass="btnState">
                {{ mainButtonContent }}
                </VButton>
            </div>
            <div>
                <VButton 
                @createItems="isCreating = false"
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
import VButton from '../components/VButton';

export default {

    components: { VButton },

    props: {
        entityName: String,
        isCreating: Boolean
    },

    computed: {
        mainButtonContent () {
            return this.isCreating ? 'Go Back' : `Add ${this.entityName}`
        },

        btnState () {
            return this.isCreating ? 'danger' : 'primary'
        },
    },

    data: () => ({
        ok: true,
    }),

    methods: {
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
