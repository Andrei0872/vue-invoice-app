<template>
    <div class="products">
        <div class="c-buttons">
            <div class="c-buttons__first">
                <VButton :btnClass="btnState" @toggleState="toggleState">
                    {{ isCreating ? "Go back" : `Add ${$options.name}` }}
                </VButton>
            </div>
            <div class="c-buttons__second">
                <VButton @createItems="willCreate = false" :showBtn="isCreating" btnClass="success">
                    Create
                </VButton>
            </div>
        </div>
        
        <transition name="main" mode="out-in">
            <div v-if="!isCreating" key="table">
                <VTable @showInfo="showInfo" :items="products" :fields="shownFields" />
            </div>
            <div v-else key="createTable">
                <div @click="addRow" class="icon">
                    <font-awesome-icon icon="plus-circle" />
                </div>
                <VTable :willCreate="willCreate" :items="newItems" :fields="shownFields" />
            </div>
        </transition>
        
        <VModal :showModal="showDetails" @closeModal="closeModal">
            <template v-slot:header>
                <div class="modal-header">
                    <div class="modal-header__title">
                        <span>Details about </span>
                        <span>{{ selectedProduct.name || 'name' }}</span>
                    </div>
                </div>
            </template>
            <template v-slot:body>
                <div
                    v-for="field in shownFields"
                    :key="field"
                    class="modal-body__row"
                >
                    <div class="modal-body__prop"><span>{{ field }}</span></div>
                    <div class="modal-body__arrow"><font-awesome-icon icon="arrow-right" /></div>
                    <div class="modal-body__value">
                        <span>{{ selectedProduct[field] }}</span>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <!-- {{ selectedProduct }} -->
            </template>
        </VModal>
    </div>
</template>

<script>
import VButton from '../components/VButton';
import VTable from '../components/VTable';
import VModal from '../components/VModal';

export default {
    name: 'product',

    components: {
        VButton,
        VTable,
        VModal,
    },

    data: () => ({
        // TODO: getters from vuex
        products: [],
        shownFields: [],
        isCreating: false,
        selectedProduct: {},
        showDetails: false,
        newItems: [],
        willCreate: true
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
            this.products = res.data
            const fields = res.data[0];
            const { provider_id, ...rest } = fields;
            this.shownFields = Object.keys(rest)
        })
        // this.products = [
        //     { id: 1, name: 'P1', category: 'c1', price: 10, markup: 2 },
        //     { id: 2, name: 'P2', category: 'c2', price: 123, markup: 12 },
        //     { id: 3, name: 'P3', category: 'c3', price: 701, markup: 32 },
        //     { id: 4, name: 'P4', category: 'c4', price: 30, markup: 10 },
        // ];

        // this.shownFields = ["name", "category", "price", "markup"];

        this.$root.$on('createItems', data => {
            console.log('data', data)
        })
    },

    methods: {
        showInfo (id) {
            this.selectedProduct = this.products.find(product => product.id === id)

            this.showDetails = true;
        },

        shouldCloseModal (ev) {
            if (ev.which === 27) {
                this.closeModal();
            }
        },

        closeModal () {
            this.showDetails = false;
            this.selectedProduct = {};
        },

        addRow () {
            this.newItems.push(
                { id: Math.floor(Math.random() * (500) ) + 1 }
            )
        },

        toggleState () {
            this.newItems = [{ id: 1 }];
            this.isCreating = !this.isCreating;
            // When it is false, it will create emit the 'createItems' events from the VTable component and toggleState from this component 
            this.willCreate = this.isCreating;
        }
    },

    watch: {
        showDetails (newVal) {
            if (newVal) {
                window.addEventListener("keyup", this.shouldCloseModal)
            } else {
                window.removeEventListener("keyup", this.shouldCloseModal)
            }
        }
    },

    computed: {
        btnState () {
            return this.isCreating ? "danger" : "primary";
        }
    }
}
</script>

<style lang="scss" scoped>
    $modal-text-color: darken($color: #394263, $amount: 10%);

     .icon {
        padding: .9rem;
        max-width: 40px;
        transform: translateY(35%);

        svg {
            width: 32px;
            height: 32px;
            color: green;
            border-radius: 50%;
            background-color: darken($color: #fff, $amount: 8%);
            cursor: pointer;

            &:hover {
                transform: scale(1.1);
            }
        }
    }

    .c-buttons {
        display: flex;
    
        &__first {
            flex-basis: 180px;
        }
    }

    .modal-header {
        width: 100%;
        color: $modal-text-color;
        font-weight: bold; 
        font-size: 1.25rem;
        display: inline-block;

        &__title {
            text-align: center;
        }
    }

    .modal-body {
        
        &__value, &__prop {
            display: inline-block;
            flex: 1 1 45%;
        }

        &__arrow {
            font-size: 1.2rem;
        }

        &__prop {
            text-align: left;

            span {
                background-color: $modal-text-color;
                color: #fff;
                padding: 5px;
                font-size: 1.1rem;
                letter-spacing: 1px;
                border-radius: 5px;
            }
        }

        &__value {
            color: $modal-text-color;
            font-size: 1.2rem;
            font-style: italic;
            font-weight: bold;
            text-align: right;
            padding-right: 1rem;
        }

        &__row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 1rem;
        }

        &__row:not(:last-child) {
            margin-bottom: 6px;
        }
    }

    .separator {
        width: 100%;
        height: 1px;
        color: #000;
    }

    .products {
        position: relative;
        padding: 1rem;
        width: 100%;
        height: 100%;
    }

    /* Transitions */

    .main-enter, .main-leave-to {
        opacity: 0;
    }

    .main-enter-active, .main-leave-active {
        transition: opacity .4s;
    }
</style>