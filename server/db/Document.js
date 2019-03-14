const Database = require('./Database');
const debug = require('debug')('db:Document');

class DocumentDB extends Database {
    constructor() {
        super();
        debug('Document DB init!')
        this.tableName = 'documents';

        this.fields = [
            "id INT(8) AUTO_INCREMENT PRIMARY KEY",
            "provider_id INT(8) NOT NULL",
            "inserted_date TIMESTAMP",
            "deleted_date DATETIME"
        ]

        // this._initTable()
    }

}

module.exports = DocumentDB;