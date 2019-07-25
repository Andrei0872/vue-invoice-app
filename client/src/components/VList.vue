<template>
    <div class="list" v-if="this.listItems.length" :style="{ width: currentTdWidth + 'px' }">
        <div
            v-for="(item, index) in filteredItems"
            :class="['list__row', index === currentIndex ? 'selected-row' : null ]"
            :key="item.id"
            @click="selectItem(index)"
        >   
            {{ item.name }}
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'list',

    props: {
        filterKey: {
            type: String,
            default: ''
        },

        currentTdWidth: Number,

        listItems: Array
    },

    data: () => ({
        currentIndex: 0,
        filteredItems: []
    }),

    watch: {
        filterKey (newVal) {
            this.updateItems();
        },
    },

    methods: {

        handleKeys (ev) {
            const keyUp = ev.which === 38;
            const keyDown = ev.which === 40;

            if (ev.which === 13) {
                this.selectItem();
                return;
            }

            if (this.currentIndex === 0 && keyUp && !keyDown) 
                this.currentIndex = this.filteredItems.length - 1, console.log('last elem')
            else if (this.currentIndex === this.filteredItems.length -1 && !keyUp && keyDown) 
                this.currentIndex = 0;
            else if (keyUp || keyDown) 
                this.currentIndex += keyDown ? 1 : keyUp ? -1 : 0;
        },

        selectItem (index = null) {
            index && (this.currentIndex = index);

            this.$emit('itemSelected', this.filteredItems[index || this.currentIndex]);
        },

        updateItems () {
            this.filteredItems = this.listItems.filter(
                ({ name }) => ~(name.toLowerCase().indexOf(this.filterKey.toLowerCase()))
            )

            this.$emit('displayOrHideList', this.filteredItems.length !== 0);
        }
    },

    created () {
        this.updateItems();
        
        window.addEventListener("keyup", this.handleKeys);
    },

    destroyed() {
        window.removeEventListener("keyup", this.handleKeys);
    },
}
</script>

<style lang="scss" scoped>
    $bg-color: lighten(#F4F4F7, 20%);
    $text-color: #303753;

    .list {
        background-color: $bg-color;
        color: $text-color;
        position: absolute;
        z-index: 100;
        width: 100px;
        user-select: none;
        transform: translateY(.9rem);

        &__row {
            padding: .2rem;

            &:first-child {
                border-top: 1px solid rgba($color: $text-color, $alpha: .4);
            }

            &:not(:last-child) {
                border-bottom: 1px solid rgba($color: $text-color, $alpha: .4);
            }

            &:hover {
                cursor: pointer;
                background-color: lighten($color: $text-color, $amount: 53%);
            }

            &.selected-row {
                background-color: lighten($color: $text-color, $amount: 53%);
            }
        }
    }
</style>