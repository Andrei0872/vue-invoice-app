const path = require('path');
const mysql = require('mysql');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const debug = require('debug')('db:Database');

const { capitalizeAndClean } = require('../utils/index');
class Database {
    constructor() {
        debug('Database constructor');
        // TODO: make this an object so that subclasses can send the columns if the the a tables is empty

        (!!this.isConnecting) || this.connect()
    }

    async connect () {
        // Avoid connecting multiple times while awaiting for the first connection to resolve
        Database.prototype.isConnecting = true;
        debug('connecting to db')
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        
        try {
            this._initTables();
            await this._promisifyConn();

            !(await this._tablesExist()) && this._createTables();

            Database.prototype.isConnecting = false;
            Database.prototype.connection = this.connection;
        } catch (err) {
            console.error(err)
        }
    }

    _initTables () {
        // TODO: do something with this hard-coded array...
        ['product', 'document', 'provider', 'document_product'].forEach(table => {
            Database.prototype[table] = require(`./${capitalizeAndClean(table)}.js`);
        })
    }

    _promisifyConn () {
        return new Promise((resolve, reject) => {
            this.connection.connect((err, data) => {
                if (err) reject(err)

                resolve(data)
            })
        })
    }

    async _createTables () {
        await Promise.all(['product', 'document', 'provider', 'document_product'].map(table => {
            return this._creatTable(table, Database.prototype[table].fields)
        }))

        debug('tables created!')
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

    async _creatTable (tableName, tableFields) {
        const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (?)`;

        await this._promisify(sql, [mysql.raw(tableFields.join(', '))])
    }

    _promisify (sql, params = null) {
        const neededParams = [sql];
        params !== null && neededParams.push(params);

        return new Promise((resolve, reject) => {
            this.connection.query(...neededParams, (err, data) => {
                if (err) {
                    console.log(err)
                    reject(err);
                }

                resolve(data)
            });
        });
    }

    async insertOne(params) {
        return await this._promisify(
            `INSERT INTO ${this.currentTable} (${Object.keys(params[0]).join(', ')}) VALUES ?`,
            [params.map(row => Object.values(row))]
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
