const path = require('path');
const mysql = require('mysql2');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const debug = require('debug')('db:Database');

const { capitalizeAndClean } = require('../utils/index');

class Database {
    constructor() {
        debug('Database constructor');
        (!!this.isConnecting) || this.connect();
    }

    async connect () {
        this.tables = ['product', 'document', 'provider', 'document_product', 'history', 'vat', 'user'];
        // Avoid connecting multiple times while awaiting for the first connection to resolve
        Database.prototype.isConnecting = true;
        debug('connecting to db')
        this.pool = mysql.createPool({
            // This is set in the `docker-compose.yml` file.
            host: process.env.DB_HOST,
            // user: process.env.DB_USERNAME,
            user: 'root',
            // password: process.env.DB_PASSWORD,
            password: process.env.DB_ROOT_PASSWORD,
            database: process.env.DB_NAME
        });

        this.pool.on('error', err => {
            process.exit(1);
        });
        
        try {
            this._initTables();
            await this._testConnection();

            !(await this._tablesExist()) && this._initTablesAndProcedures();

            Database.prototype.isConnecting = false;
            Database.prototype.pool = this.pool;
        } catch (err) {
            console.error(err)
        }
    }

    async _initTablesAndProcedures () {
        await this._createTables();
        await this._addDefaultValues();
        await this._initTrigger();
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

    _testConnection () {
        return new Promise((resolve, reject) => {
            this.pool.query('SELECT 1 + 1 AS solution', (err, results) => {
                if (err) return reject(err);

                console.log('Connection successful.');
                resolve();
            });
        })
    }

    async _initTrigger () {
        await this._promisify('drop trigger if exists delete_document_if_it_has_no_products');

        await this._promisify(
            `   
                create trigger delete_document_if_it_has_no_products after delete on document_product 
                for each row 
                begin 
                    if (select count(*) from document_product dp where dp.document_id = (@docId:=old.document_id) ) = 0 
                    then 
                        delete from document d where d.id = @docId; 
                    end if; 
                end;
            `
        );    
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
                select max(total_sell_vat) from(
                    select sum(sell_price_vat) as total_sell_vat from document_product group by document_id
                ) tab
            )
            limit 1;

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

            select row_count() as affectedRows;
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
            this.pool.getConnection((err, conn) => {
                if (err) {
                    return reject(err);
                }

                conn.query(...neededParams, (err, data) => {
                if (err) {
                    console.log(err)
                    reject(err);
                }

                conn.release();
                resolve(data);
            });
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
