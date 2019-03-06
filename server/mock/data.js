const faker = require('faker');

const products = [];

for (let i = 0; i < 20; i++) {
    const category = faker.commerce.department();

    products.push({
        name: faker.commerce.product(),
        category,
        sub_category: `${category}__sub_category`,
        price: faker.commerce.price(),
        markup: faker.commerce.price() / 10,
        provider_id: i  % 5 === 0 ? 1 : i % 4 === 0 ? 2 : 3,
        quantity: '',
        quantity_type: '',
        comestible: '',
        inserted_date: 
    });
}
console.log(faker.commerce.product())
console.log(faker.commerce.productName())

module.exports = {
    products
}