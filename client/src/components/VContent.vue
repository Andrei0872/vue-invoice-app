<template>
    <div class="c-container">
        <div class="c-container__main-buttons">
            <div>
                <VButton :disabled="disableButton" @toggleState="isCreating = !isCreating" :btnClass="btnState">
                {{ mainButtonContent }}
                </VButton>
            </div>
            <div>
                <VButton 
                    :disabled="disableCreateButton"
                    @createItems="isCreating = false; $emit('insertCreatedItems')"
                    :showBtn="isCreating"
                    btnClass="success"
                >
                    Create
                </VButton>
            </div>
            
            <template v-if="shouldDisplayConfirmCancelButtons">
                <div>
                    <VButton @cancelChanges="$emit('cancelChanges')">
                        Cancel Changes
                    </VButton>
                </div>
    
                <div style="margin-left: 1rem;">
                    <VButton @confirmChanges="$emit('confirmChanges')">
                        Confirm Changes
                    </VButton>
                </div>
            </template>
        </div>

        <transition name="fade" mode="out-in">
            <div v-if="!isCreating" key="showExisting">
                <slot name="existingItems"></slot>
            </div>
            <div v-else key="createNewEntity">
                <slot name="createItems"></slot>
            </div>
        </transition>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';

import VButton from '../components/VButton';

export default {

    components: { VButton },

    props: {
        entityName: String,
        disableButton: {
            type: Boolean,
            default: false
        },
        disableCreateButton: {
            type: Boolean,
            default: false,
        },
        shouldDisplayConfirmCancelButtons: {
            type: Boolean,
            default: false
        }
    },
    // TODO: test created btn disabled states
    computed: {
        mainButtonContent () {
            return this.isCreating ? 'Go Back' : `Add ${this.entityName}`
        },

        btnState () {
            return this.isCreating ? 'danger' : 'primary'
        },
    },

    data: () => ({
        isCreating: false,
    }),
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
