module.exports = {
    fields: [
        "id INT(8) AUTO_INCREMENT PRIMARY KEY",
        "provider_id INT(8) NOT NULL",
        "provider_name VARCHAR(50) NOT NULL",
        "total_buy DECIMAL(7, 2)",
        "total_sell DECIMAL(7, 2)",
        "invoice_number INT(10)",
        "inserted_date TIMESTAMP",
    ]
};