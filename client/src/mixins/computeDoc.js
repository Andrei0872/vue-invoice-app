export default {
    methods: {
        /**
         * Compute a new value for `sell_price` depending on which values can be found
         * in `buy_price` / `markup` fields
         */
        computeSellPrice (row, fieldName, currentFieldValue) {
            currentFieldValue = parseFloat(currentFieldValue);
            currentFieldValue = isNaN(currentFieldValue) ? 0 : currentFieldValue;

            const otherField = fieldName === 'buy_price' ? 'markup' : 'buy_price';
            let existingValueInOtherField = parseFloat(row[otherField]);
            existingValueInOtherField = isNaN(existingValueInOtherField) ? 0 : existingValueInOtherField;

            const sellPriceValue = this.getValueAfterMarkup(...fieldName === 'buy_price' ? ([currentFieldValue, existingValueInOtherField]) : ([existingValueInOtherField, currentFieldValue]))

            return +sellPriceValue.toFixed(2)
        },

        getValueAfterMarkup (buyPrice, markup) {
            return buyPrice + markup;
        },

        getVatValue (isComestible, sellPriceValue, vat) {
            return ((parseFloat(isComestible === 1 ? vat['food_vat'] : vat['non_food_vat'])) / 100) * sellPriceValue
        },
    }
}