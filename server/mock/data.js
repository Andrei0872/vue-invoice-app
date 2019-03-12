
const products = [
    {
        "id": 2,
        "name": "Mozzarella",
        "category": "diary",
        "subcategory": "mozzarrella special type",
        "price": 23,
        "markup": 5,
        "provider_id": 1,
        "quantity": 10,
        "quantity_type": "kg",
        "comestible": 1,
        "inserted_date": "2019-03-06T18:35:46.000Z",
        "deleted_date": null
    }, {
        "id": 3,
        "name": "Butter",
        "category": "Diary",
        "subcategory": "butter from romania",
        "price": 10,
        "markup": 2,
        "provider_id": 2,
        "quantity": 5,
        "quantity_type": "kg",
        "comestible": 1,
        "inserted_date": "2019-03-06T18:37:42.000Z",
        "deleted_date": null
    }, {
        "id": 4,
        "name": "PS4",
        "category": "Electronics",
        "subcategory": "PS4 from UK",
        "price": 400,
        "markup": 20,
        "provider_id": 1,
        "quantity": 5,
        "quantity_type": "piece",
        "comestible": 0,
        "inserted_date": "2019-03-06T18:38:20.000Z",
        "deleted_date": null
    }
];

// for (let i = 0; i < 20; i++) {
//     const category = faker.commerce.department();

//     products.push({
//         name: faker.commerce.product(),
//         category,
//         sub_category: `${category}__sub_category`,
//         price: faker.commerce.price(),
//         markup: faker.commerce.price() / 10,
//         provider_id: i  % 5 === 0 ? 1 : i % 4 === 0 ? 2 : 3,
//         quantity: '',
//         quantity_type: '',
//         comestible: '',
//         inserted_date: 
//     });
// }
// console.log(faker.commerce.product())
// console.log(faker.commerce.productName())

module.exports = {
    products
}