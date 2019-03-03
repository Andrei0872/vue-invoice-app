const path = require('path');
const mysql = require('mysql');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const debug = require('debug')('db:Database');
/* 
TODO:
check if table exists, if not, create it
as a future plan: scaffold tables
*/

class Database {
    constructor() {

        !!this.connection || this.connect()
    }

    updateState () {
        // this - will be the context from which this fn was called
        debug('db connection can now be shared across subclasses')
        Database.prototype.connection = this.connection;
        console.log(Database.prototype.connection.query)
    }

    async connect () {
        this.connection = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });

        this.updateState();

        this.connection.connect((err, data) => {
            if (err) {
                console.error(err)
                return;
            }

            // console.log('data', data)
        })
    }

    _executeQuery (...params) {
        this.connection.query(...params, err => {
            if (err) {
                return console.log(err)
            }
            console.log('query OK')
        });
    }

    _getClassName () {
        return this.constructor.name.toLowerCase();
    }

    _initTable () {
        const tableName = this._getClassName();
        const sql = `SHOW TABLES LIKE '${tableName}s'`;

        this.connection.query(sql, (err, data) => {
            if (err) {
                return console.log(err)
            }

            data.length === 0 && this._creatTable(tableName);
        })
    }

    _creatTable(tableName) {
        console.log(tableName)
        const sql = `CREATE TABLE IF NOT EXISTS ${tableName}s (?)`
        this.connection.query(sql, [mysql.raw(this.fields.join(', '))], (err, data) => {
            if (err) {
                return console.log(err)
            }

            console.log(data)
        });
    }
}

module.exports = Database;
