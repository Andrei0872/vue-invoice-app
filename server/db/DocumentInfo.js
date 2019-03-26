module.exports = {
    fields: [
        "id INT(8) AUTO_INCREMENT PRIMARY KEY",
        "provider_id INT(8) NOT NULL",
        "provider_name VARCHAR(50) NOT NULL",
        "invoice_number INT(10)",
        "inserted_date TIMESTAMP",
    ]
};