module.exports = {
    fields: [
        "id INT(8) AUTO_INCREMENT PRIMARY KEY",
        "email varchar(255) not null",
        "password varchar(255) not null",
        "inserted_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP",
    ]
};