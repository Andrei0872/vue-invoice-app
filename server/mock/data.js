
const products = [
    {
        "id": 1,
        "name": "Mozzarella",
        "category": "diary",
        "subcategory": "mozzarrella special type",
        "price": 23,
        "markup": 5,
        "provider_id": 1,
        "comestible": 1,
        "inserted_date": "2019-03-06T18:35:46.000Z",
        "deleted_date": null
    }, {
        "id": 2,
        "name": "Butter",
        "category": "Diary",
        "subcategory": "butter from romania",
        "price": 10,
        "markup": 2,
        "provider_id": 2,
        "comestible": 1,
        "inserted_date": "2019-03-06T18:37:42.000Z",
        "deleted_date": null
    }, {
        "id": 3,
        "name": "PS4",
        "category": "Electronics",
        "subcategory": "PS4 from UK",
        "price": 400,
        "markup": 20,
        "provider_id": 1,
        "comestible": 0,
        "inserted_date": "2019-03-06T18:38:20.000Z",
        "deleted_date": null
    }
];

const providers = [
    {
        id: 1,
        name: "Company 1",
        URC: "301939210",
        inserted_date: "2019-03-06T18:38:20.000Z",
        deleted_date: 'null'
    },
    {
        id: 2,
        name: "Company 2",
        URC: "761039123",
        inserted_date: "2019-03-06T18:38:20.000Z",
        deleted_date: 'null'
    }
]

const documents = [
    {
        id: 1,
        nr_doc: 1,
        provider: "p1",
        nr_products: 3
    },
    {
        id: 2,
        nr_doc: 2,
        provider: "p3",
        nr_products: 10
    },
    {
        id: 3,
        nr_doc: 2,
        provider: "p4",
        nr_products: 20
    }
]

module.exports = {
    products,
    providers,
    documents,
}