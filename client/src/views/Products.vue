<template>
    <div class="products">
        <button @click="isCreating = !isCreating">{{ buttonTitle }}</button>
        <br><br>
        <!-- TODO: table component -->
        <transition name="main" mode="out-in">
            <div v-if="!isCreating" key="table" class="table_responsive">
                <table border="1" class="table">
                    <thead>
                        <tr>
                            <th v-for="field in shownFields" :key="field">{{ field }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="product in products"
                            :key="product.id"
                        >
                            <td>{{ product.id }}</td>
                            <td>{{ product.name }}</td>
                            <td>{{ product.category }}</td>
                            <td>{{ product.subcategory }}</td>
                            <td>{{ product.price }}</td>
                            <td>{{ product.markup }}</td>
                            <td>{{ product.provider_id }}</td>
                            <td>{{ product.quantity }}</td>
                            <td>{{ product.quantity_type }}</td>
                            <td>{{ product.comestible }}</td>
                            <td>{{ product.inserted_date }}</td>
                            <td>{{ product.deleted_date || 'NULL' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div key="create" v-else>
                Time to create!
            </div>
        </transition>
    </div>
</template>

<script>

export default {
    name: 'products',

    data: () => ({
        // TODO: getters from vuex
        products: [],
        shownFields: [],
        isCreating: false
    }),

    created () {
        // TODO: vuex
        fetch('http://localhost:3000/product/', {
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            method: "POST",
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            this.products = res.data
            this.shownFields = Object.keys(res.data[0])
        })
    },

    computed: {
        buttonTitle () {
            return this.isCreating ? 'Create' : 'Add Product'
        }
    },
}
</script>

<style lang="scss" scoped>
    .table {
        border-collapse: collapse;
        background-color: #ccc;
        border-radius: 13px;
        width: 100%;

        td, th {
            padding: 15px;
        }
    }

    .table_responsive {
        overflow-x: auto;
    }

    .main-enter, .main-leave-to {
        opacity: 0;
    }

    .main-enter-active, .main-leave-active {
        transition: opacity 1s;
    }

</style>