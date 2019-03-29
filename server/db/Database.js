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

            !(await this._tablesExist()) && this._initTablesAndProcedures();

            Database.prototype.isConnecting = false;
            Database.prototype.connection = this.connection;
        } catch (err) {
            console.error(err)
        }
    }

    async _initTablesAndProcedures () {
        await this._createTables();
        await this._initProcedure();
    }

    _initTables () {
        // TODO: do something with this hard-coded array...
        ['product', 'document', 'provider', 'document_product'].forEach(table => {
            Database.prototype[table] = require(`./${capitalizeAndClean(table)}Info.js`);
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

    async _initProcedure () {
        await this._promisify('drop procedure if exists remove_document');

        await this._promisify(
            `
            create procedure remove_document(
                in doc_id int(8), product_id int(8)
            )
            begin
            
            if product_id != -1 then
                delete from document_product 
                where document_product.id = product_id;

                select * from document_product where document_product.document_id = doc_id;
            else
                delete from document_product
                where document_product.document_id = doc_id;

                delete from document where document.id = doc_id;
            end if;
            end;
            `
        )
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

    // TODO: change name to insertMany...
    async insertOne(keys, values) {
        return await this._promisify(
            `INSERT INTO ${this.currentTable} (${keys}) VALUES ?`,
            [values]
        )
    }

    async getAll () {
        return await this._promisify(
            `SELECT * FROM ${this.currentTable}`
        )
    }

    async updateOne (keys, values) {
        return await this._promisify(
            `UPDATE ${this.currentTable} SET ${keys} WHERE id = ?`,
            values
        )
    }

    async deleteOne (id) {
        return await this._promisify(
            `DELETE FROM ${this.currentTable} WHERE id = ?`,
            id
        )
    }

    // async joinTables (t1, t2, ) {

    // }
}

// FIXME: export new Database()
module.exports = Database;
