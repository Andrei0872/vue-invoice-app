const path = require('path');
const mysql = require('mysql');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const debug = require('debug')('db:Database');

const { capitalizeAndClean } = require('../utils/index');

class Database {
    constructor() {
        debug('Database constructor');
        (!!this.isConnecting) || this.connect();
    }

    async connect () {
        this.tables = ['product', 'document', 'provider', 'document_product', 'history', 'vat'];
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
        await this._addDefaultValues();
        await this._initProcedure();
    }

    static newDBInstance () {
        return new Database();
    }

    async _addDefaultValues () {
        const tablesWithDefaultValues = ['vat'];

        tablesWithDefaultValues.forEach(table => {
            const columns = Database.prototype[table].fieldsSimplified;
            this._promisify(
                `
                INSERT INTO ${table}(${columns.join(', ')}) VALUES (?)
                `,
                [columns.map(() => null)]
            )
        });
    }

    _initTables () {
        this.tables.forEach(table => {
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
        await this._promisify('drop procedure if exists get_main_overview');
        await this._promisify('drop procedure if exists remove_provider');

        this._promisify(
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

        this._promisify(
            `
            create procedure get_main_overview ()
            begin

            declare total_products int;
            declare total_providers int;
            declare total_documents int;
            declare most_expensive_doc tinytext;

            select count(*) into total_products from product;
            select count(*) into total_providers from provider;
            select count(*) into total_documents from document;
            select concat(document_id, '|', sum(sell_price_vat)) into most_expensive_doc
            from document_product
            group by document_id
            having sum(sell_price_vat) = (
                select max(total_sell_vat)
                from (
                    select sum(sell_price_vat) as total_sell_vat
                    from document_product
                    group by document_id
                ) tab
            );

            select total_products, total_providers, total_documents, most_expensive_doc;
            end;
            `
        );

        this._promisify(
            `
            create procedure remove_provider (in provider_id int)
            begin

            delete from provider where id = provider_id;

            delete from document_product where document_product.document_id = any (select id from document where document.provider_id = provider_id);

            delete from document where document.provider_id = provider_id;
            end;
            `
        )
    }

    async _createTables () {
        await Promise.all(this.tables.map(table => {
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
        return tableName 
            ? class extends Database {
                constructor () {
                    super();
                    this.currentTable = tableName
                }
            }
            : (this.db = Database.newDBInstance()); 
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

    async getAll (reversed = false) {
        return await this._promisify(
            `SELECT * FROM ${this.currentTable} ${reversed ? 'ORDER BY id DESC' : ''}`
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
}

// FIXME: export new Database()
module.exports = Database;
