<template>
    <div class="products">
        <VButton @toggleState="isCreating = !isCreating">
            Add Product
        </VButton>
        <br><br>
        <transition name="main" mode="out-in">
            <div v-if="!isCreating" key="table">
                <VTable :data="products" :fields="shownFields" />
            </div>
            <div key="create" v-else>
                Time to create!
            </div>
        </transition>
    </div>
</template>

<script>
import VButton from '../components/VButton';
import VTable from '../components/VTable';

export default {
    name: 'products',

    components: {
        VButton,
        VTable,
    },

    data: () => ({
        // TODO: getters from vuex
        products: [],
        shownFields: [],
        isCreating: false
    }),

    created () {
        // TODO: vuex
        // fetch('http://localhost:3000/product/', {
        //     headers: new Headers({
        //         'Content-Type': 'application/json',
        //     }),
        //     method: "POST",
        // })
        // .then(res => res.json())
        // .then(res => {
        //     console.log(res)
        //     this.products = res.data
        //     this.shownFields = Object.keys(res.data[0])
        // })
        this.products = [
            { id: 1, name: 'P1', category: 'c1', price: 10, markup: 2 },
            { id: 2, name: 'P2', category: 'c2', price: 123, markup: 12 },
            { id: 3, name: 'P3', category: 'c3', price: 701, markup: 32 },
            { id: 4, name: 'P4', category: 'c4', price: 30, markup: 10 },
        ];

        this.shownFields = ["name", "category", "price", "markup"];
    },

    methods: {
        fn () {
            alert(1);
        }
    },

    computed: {
        buttonTitle () {
            return this.isCreating ? 'Create' : 'Add Product'
        }
    },
}
</script>

<style lang="scss" scoped>

    .main-enter, .main-leave-to {
        opacity: 0;
    }

    .main-enter-active, .main-leave-active {
        transition: opacity 1s;
    }

</style>