module.exports = {
    fields: [
        "id INT(8) AUTO_INCREMENT PRIMARY KEY",
        "provider_id INT(8) NOT NULL",
        "total_buy DECIMAL(7, 2)",
        "total_sell DECIMAL(7, 2)",
        "invoice_number DECIMAL(7, 2)",
        "inserted_date TIMESTAMP",
    ]
};