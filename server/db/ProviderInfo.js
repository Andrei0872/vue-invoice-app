module.exports = {
    fields: [
        "id INT(8) AUTO_INCREMENT PRIMARY KEY",
        "name VARCHAR(50) NOT NULL",
        "URC INT(9) NOT NULL", // Unique Registration Code
        "inserted_date TIMESTAMP",
    ]
};