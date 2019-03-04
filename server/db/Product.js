const Database = require('./Database');
const debug = require('debug')('db:Product');

class ProductDB extends Database {
    constructor () {
        super();
        debug('Product DB init!')
        this.tableName = 'products';

        this.fields = [
            "id INT(8) AUTO_INCREMENT PRIMARY KEY", 
            "name VARCHAR(255) NOT NULL",
            "category VARCHAR(255) NOT NULL",
            "sub_category VARCHAR(255) NOT NULL",
            "price DECIMAL(7, 2) NOT NULL",
            "markup DECIMAL(7, 2) NOT NULL",
            "provider_id INT(8) NOT NULL",
            "quantity DECIMAL(7, 2) NOT NULL",
            "quantity_type VARCHAR(255) NOT NULL",
            "comestible BOOLEAN",
            "inserted_date TIMESTAMP",
            "deleted_date DATETIME"
        ]

        this._initTable()
    }

}

module.exports = ProductDB;