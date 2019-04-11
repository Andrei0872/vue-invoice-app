export default {
    data: () => ({
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
            ]
    })
}