module.exports = {
    fields: [
        'id enum("1") default 1',
        'food_vat decimal(4, 2) default null',
        'non_food_vat decimal(4, 2) default null'
    ],
    fieldsSimplified: ['food_vat', 'non_food_vat']
}