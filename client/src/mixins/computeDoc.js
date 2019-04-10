export default {
    methods: {
        // TODO: add pairs to func: buy_price, markup => sell_price; sell_price, vat => product_vat; product_vat, sell_price => sell_price_vat
        computeSellPrice (row, fieldName, currentFieldValue) {
            // Compute a new value for `sell_price` depending on which values can be found
            // in `buy_price` / `markup` fields
            currentFieldValue = parseFloat(currentFieldValue);
            currentFieldValue = isNaN(currentFieldValue) ? 0 : currentFieldValue;

            const otherField = fieldName === 'buy_price' ? 'markup' : 'buy_price';
            let existingValueInOtherField = parseFloat(row[otherField]);
            existingValueInOtherField = isNaN(existingValueInOtherField) ? 0 : existingValueInOtherField;

            const sellPriceValue = this.getValueAfterMarkup(...fieldName === 'buy_price' ? ([currentFieldValue, existingValueInOtherField]) : ([existingValueInOtherField, currentFieldValue]))

            return sellPriceValue.toFixed(2)
        },

        getValueAfterMarkup (buyPrice, markup) {
            return buyPrice + (markup / 100) * buyPrice
        },

        getVatValue (isComestible, sellPriceValue, vat) {
            return ((parseFloat(isComestible === 1 ? vat['food_vat'] : vat['non_food_vat'])) / 100) * sellPriceValue
        }
    }
}