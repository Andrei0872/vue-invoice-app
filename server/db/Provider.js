const Database = require('./Database');
const debug = require('debug')('db:Provider');

class ProviderDB extends Database {
    constructor () {
        super();
        this.tableName = 'providers';
        debug('Provider init!')

        this.fields = [
            "id INT(8) AUTO_INCREMENT PRIMARY KEY",
            "name VARCHAR(255) NOT NULL",
            "URC INT(9) NOT NULL", // Unique Registration Code
            "inserted_date TIMESTAMP",
            "deleted_date DATETIME"
        ]

        this._initTable();
    }

}

module.exports = ProviderDB;