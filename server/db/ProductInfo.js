module.exports = {
    fields: [
        "id INT(8) AUTO_INCREMENT PRIMARY KEY",
        "name VARCHAR(255) NOT NULL",
        "category VARCHAR(255) NOT NULL",
        "sub_category VARCHAR(255) NOT NULL",
        "comestible BOOLEAN",
        "expiration_date DATE",
        "inserted_date TIMESTAMP",
    ]
};