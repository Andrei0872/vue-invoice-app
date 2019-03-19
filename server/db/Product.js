module.exports = {
    fields: [
        "id INT(8) AUTO_INCREMENT PRIMARY KEY",
        "name VARCHAR(255) NOT NULL",
        "category VARCHAR(255) NOT NULL",
        "sub_category VARCHAR(255) NOT NULL",
        "price_buy DECIMAL(7, 2) NOT NULL",
        "markup DECIMAL(7, 2) NOT NULL",
        "price_sell DECIMAL(7, 2) NOT NULL",
        "comestible BOOLEAN",
        "currency CHAR(1)",
        "expiration_date DATETIME",
        "inserted_date TIMESTAMP",
        "deleted_date DATETIME"
    ],
    newItemsColumns: [
        "id",
        "name",
        "category",
        "sub_category",
        "price_buy",
        "markup",
        "price_sell",
        "comestible",
        "currency",
        "expiration_date",
        "inserted_date",
        "deleted_date"
    ]
};