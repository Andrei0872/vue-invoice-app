export default {
    data: () => ({
        createColumns: [
                "product_name",
                "quantity",
                "quantity_type",
                "buy_price",
                "markup",
                "sell_price",
                "currency"
            ],
            readColumns: [
                "provider_name",
                "total_buy",
                "total_sell",
                "invoice_number",
                "inserted_date",
                "nr_products"
            ]
    })
}