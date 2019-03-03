const Database = require('./Database');
const debug = require('debug')('db:Product');

class Product extends Database {
    constructor () {
        super();
        debug('Product init!')
        this.tableName = this._getClassName();

        this.fields = [
            "id INT(6) AUTO_INCREMENT PRIMARY KEY", 
            "name VARCHAR(255) NOT NULL"
        ]

        this._initTable()
    }

    insertOne (params) {
        const sql = `INSERT INTO ${this.tableName}s SET ?`;

        this.connection.query(sql, params, (err, data) => {
            if (err) {
                return console.log(err)
            }

            console.log(data)
        })
    }
}

module.exports = Product;