const path = require('path');
const mysql = require('mysql');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const debug = require('debug')('db:Database');

// TODO: add to utils
function capitalizeAndClean(name) {
    return name.replace(
        /(?<=_|^)([a-z]+)/g, match => {
            return match[0].toUpperCase() + match.slice(1)
        }
    )
}

class Database {
    constructor() {
        debug('Database constructor')
        !!this.connection || this.connect()
    }

    async connect () {
        this.connection = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });

        this.connection.connect(async (err, data) => {
            if (err) {
                console.error(err)
                return;
            }
            
            ['product', 'document', 'provider', 'document_product'].forEach(tableName => {
                this[tableName] = require(`./${capitalizeAndClean(tableName)}.js`);
            });

            !(await this._tablesExist()) && this._createTables();
        })
    }

    async _createTables () {
        ['product', 'document', 'provider', 'document_product'].forEach(tableName => {
            this._creatTable(tableName, this[tableName].fields);
        });
    }

    async _tablesExist () {
        const sql = 'SHOW TABLES';
        
        const tables = await this._promisify(sql);

        return tables.length !== 0
    }

    useTable (tableName) {
        return class extends Database {
            constructor () {
                super();
                this.currentTable = tableName
            }
        }
    }

    _creatTable (tableName, tableFields) {
        const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (?)`;

        this.connection.query(sql, [mysql.raw(tableFields.join(', '))], (err, data) => {
            if (err) {
                return console.log(err)
            }

            debug(`tabel ${tableName} created!`)
        });
    }

    _promisify (sql, params = null) {
        const neededParams = [sql];
        params !== null && neededParams.push(params);

        return new Promise((resolve, reject) => {
            this.connection.query(...neededParams, (err, data) => {
                if (err) reject(err);

                resolve(data)
            });
        });
    }

    async insertOne(params) {
        return await this._promisify(
            `INSERT INTO ${this.currentTable} SET ?`,
            params
        );
    }

    async getAll () {
        return await this._promisify(
            `SELECT * FROM ${this.currentTable}`
        )
    }

    async selectOneByID (params) {
        return await this._promisify(
            `SELECT * FROM ${this.currentTable} WHERE ?`,
            params
        )
    }
}

module.exports = Database;
