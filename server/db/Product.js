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
        "expiration_date DATE",
        "inserted_date TIMESTAMP",
    ]
};