<template>
    <div class="list" contenteditable="false" v-if="this.items.length">
        <div
            v-for="(item, index) in filteredItems"
            :class="['list__row', index === currentIndex ? 'selected-row' : null ]"
            :key="item.id"
        >   
            {{ item.name }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'list',

    props: {
        filterKey: {
            type: String,
            default: ''
        }
    },

    data: () => ({
        items: [],
        currentIndex: 0,
    }),

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

        selectItem () {
            this.$emit('itemSelected', this.items[this.currentIndex].name);
        }
    },

    computed: {
        filteredItems () {
            return this.items.filter(
                ({ name }) => ~(name.toLowerCase().indexOf(this.filterKey.toLowerCase()))
            )
        }
    },

    mounted () {
        window.addEventListener("keyup", this.handleKeys);
        this.$emit('ready', this.$el.getBoundingClientRect());
    },

    created () {
        this.items = [
    {
        "id": 1,
        "name": "Mozzarella",
        "category": "diary",
        "subcategory": "mozzarrella special type",
        "price": 23,
        "markup": 5,
        "provider_id": 1,
        "comestible": 1,
        "inserted_date": "2019-03-06T18:35:46.000Z",
        "deleted_date": null
    }, {
        "id": 2,
        "name": "Butter",
        "category": "Diary",
        "subcategory": "butter from romania",
        "price": 10,
        "markup": 2,
        "provider_id": 2,
        "comestible": 1,
        "inserted_date": "2019-03-06T18:37:42.000Z",
        "deleted_date": null
    }, {
        "id": 3,
        "name": "PS4",
        "category": "Electronics",
        "subcategory": "PS4 from UK",
        "price": 400,
        "markup": 20,
        "provider_id": 1,
        "comestible": 0,
        "inserted_date": "2019-03-06T18:38:20.000Z",
        "deleted_date": null
    }
]
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