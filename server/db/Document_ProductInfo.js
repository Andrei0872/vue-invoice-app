// Junction Table
module.exports = {
    fields: [
        "id INT(8) AUTO_INCREMENT PRIMARY KEY",
        "document_id INT(8) NOT NULL",
        "product_id INT(8) NOT NULL",
        "quantity INT(8) NOT NULL",
        "quantity_type VARCHAR(15) NOT NULL",
        "buy_price DECIMAL(7, 2) NOT NULL",
        "markup DECIMAL(7, 2) NOT NULL",
        "sell_price DECIMAL(7, 2) NOT NULL",
        "currency CHAR(3)",
    ]
};