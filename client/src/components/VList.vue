<template>
    <div class="list" contenteditable="false">
        <div
            class="list__row"
            v-for="item in items"
            :key="item.id"
        >   
            {{ item.name }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'list',

    data: () => ({
        items: [],
    }),

    // props: {
    //     isTyping: Boolean
    // },

    mounted () {
        this.$root.$emit('ready', this.$el.getBoundingClientRect());
    },

    // watch: {
    //     isTyping (val) {
    //         if (val) {
    //             this.$root.$emit('ready', this.$el.getBoundingClientRect());
    //         }
    //     }
    // },

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
        // position: absolute;
        z-index: 100;
        max-height: 15rem;
        user-select: none;

        &__row {
            padding: .2rem;

            &:not(:last-child) {
                border-bottom: 1px solid rgba($color: $text-color, $alpha: .4);
            }

            &:hover {
                cursor: pointer;
                background-color: lighten($color: $text-color, $amount: 53%);
            }
        }
    }
</style>