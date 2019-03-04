const Database = require('./Database');
const debug = require('debug')('db:Product');

class ProductDB extends Database {
    constructor () {
        super();
        debug('Product DB init!')
        this.tableName = 'products';

        this.fields = [
            "id INT(6) AUTO_INCREMENT PRIMARY KEY", 
            "name VARCHAR(255) NOT NULL"
        ]

        this._initTable()
    }

}

module.exports = ProductDB;