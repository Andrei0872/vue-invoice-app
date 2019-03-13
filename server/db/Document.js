const Database = require('./Database');
const debug = require('debug')('db:Document');

class DocumentDB extends Database {
    constructor() {
        super();
        debug('Document DB init!')
        this.tableName = 'documents';

        this.fields = [
            "id INT(8) AUTO_INCREMENT PRIMARY KEY",
            "name VARCHAR(255) NOT NULL",
            "category VARCHAR(255) NOT NULL",
            "sub_category VARCHAR(255) NOT NULL",
            "price DECIMAL(7, 2) NOT NULL",
            "markup DECIMAL(7, 2) NOT NULL",
            "provider_id INT(8) NOT NULL",
            "comestible BOOLEAN",
            "inserted_date TIMESTAMP",
            "deleted_date DATETIME"
        ]

        // this._initTable()
    }

}

module.exports = DocumentDB;