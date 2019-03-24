<template>
    <div class="list" v-if="this.items.length">
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
import { mapState } from 'vuex';

export default {
    name: 'list',

    props: {
        filterKey: {
            type: String,
            default: ''
        }
    },

    data: () => ({
        currentIndex: 0,
        filteredItems: []
    }),

    watch: {
        filterKey (newVal) {
            this.updateItems();
        }
    },

    destroyed() {
        window.removeEventListener("keyup", this.handleKeys);
    },

    methods: {

        handleKeys (ev) {

            if (ev.which === 13) {
                this.selectItem();
                return;
            }

            this.currentIndex += ev.which === 40 
                ? 1 : ev.which === 38 ? -1 : 0;

            if (this.currentIndex === -1) 
                this.currentIndex = this.items.length - 1;
            else if (this.currentIndex === this.items.length) 
                this.currentIndex = 0;
        },

        selectItem (index = null) {
            index && (this.currentIndex = index);

            this.$emit('itemSelected', this.filteredItems[index || this.currentIndex]);
        },

        updateItems () {
            this.filteredItems = this.items.filter(
                ({ name }) => ~(name.toLowerCase().indexOf(this.filterKey.toLowerCase()))
            )
        }
    },

    computed: {
        ...mapState('product', ['items'])
    },

    mounted () {
        window.addEventListener("keyup", this.handleKeys);
    },

    created () {
        this.updateItems();
    }
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
        max-height: 15rem;
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