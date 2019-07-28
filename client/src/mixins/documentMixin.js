export default {
    data() {
        return {
            createColumns: [
                "product_name",
                "quantity",
                "quantity_type",
                "buy_price",
                "markup",
                "sell_price",
                "product_vat",
                "sell_price_vat",
                "currency"
            ],
            readColumns: [
                "provider_name",
                "total_buy",
                "total_sell",
                "total_vat",
                "total_sell_vat",
                "invoice_number",
                "inserted_date",
                "nr_products"
            ],

            initialListItemsLen: 0,
            unwatchStore: null,
            isDeletingCreatedItems: false,
        }
    },

    methods: {
        initCreatedItemsWatcher () {

            this.unwatchStore = this.$store.watch(
                (state, getters) => getters[this.createdItemsObservee],
                (createdItems) => {
                    if (this.isDeletingCreatedItems)
                        return;

                    if (createdItems.length > this.initialListItemsLen && !this.productsAsList.length) {
                        console.log('should delete');

                        this.deleteExcessiveCreatedItems();
                    }
                }
            )
        },

        deleteExcessiveCreatedItems () {
            this.isDeletingCreatedItems = true;

            (this.createdItems || this.createdProducts).forEach(({ id: deletedId, product_name }) => {
                if (product_name === '' || typeof product_name !== 'object')
                    (this.deleteCreatedItem || this.deleteCreatedProduct)(deletedId);
            })

            this.isDeletingCreatedItems = false;
        }
    },

    destroyed () {
        this.unwatchStore();
    },
}