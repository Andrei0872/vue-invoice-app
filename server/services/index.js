const debug = require('debug')('service')
const mysql = require('mysql2');

class Service {
    constructor (name) {
        debug('new service', name)
        this[`${name ? 'table' : 'db'}`] = require('../db').useTable(name);
        name && (this.table = new this.table());
    }

    // FIXME: refactor this one. This serves for single / multiple updates; separate the jobs!
    async insertOne (params) {
        let response = {};
        const paramsIsArr = Array.isArray(params);

        paramsIsArr && (params = params.map(({ id, ...row }) => row));

        // Some products might not have an expiration date
        if ((params[0] || params).hasOwnProperty('expiration_date'))
            params = params.map(row => ({ ...row, expiration_date: row['expiration_date'] !== '' ? row['expiration_date'] : null }))

        try {
            const keys = Object.keys((paramsIsArr ? params[0] : params)).join(', ');
            const values = paramsIsArr ? params.map(Object.values) : [Object.values(params)];
            
            const resp = await this.table.insertOne(keys, values);
            const tableName = this.table.currentTable;

            response = {
                message: `${tableName}${values.length > 1 ? 's have' : ' has'} been added successfully`,
                status: 200,
                data: resp,
                reqType: 'insert'
            }
        } catch (err) {
            console.log(err)
            response = {
                message: `Failed to insert into ${this.tableName}`,
                status: 400
            }
        }

        return response;
    }

    async getAll (reversed) {
        let response = {};

        try {
            const data = await this.table.getAll(reversed);

            response = {
                message: `Fetched from ${this.table.currentTable} successfully`,
                status: 200,
                data,
            }
        } catch (err) {
            response = {
                message: `Failed to fetch from ${this.table.currentTable}`,
                reason: err.message,
                status: 400
            }
        }

        return response;
    }

    /**
     * 
     *  
     *  ```javascript
     *  const idsAndKVPairs = {
     *   '51': { name: 'provider123', URC: '2222' },
     *   '54': { name: 'provider222' } 
     *  };
     *  const columnNames = [ 'name', 'URC' ];
     *  ```
     */
    /* 
    Computed query:
    update provider t
        join (
            select null as new_name, null as new_URC, null as id 
            union all  
            select  'provider123',  '2222', 51  
            union all  
            select  'provider222',  null, 54 
        ) vals on vals.id = t.id
    set 
        t.name = case when vals.new_name is not null then vals.new_name else t.name end, 
        t.URC = case when vals.new_URC is not null then vals.new_URC else t.URC end 

    */
    async updateOne ([idsAndKVPairs, columnNames]) {
        const punctuation = [', ', ' '];
        const columnNamesLen = columnNames.length;
        
        let updatedRows = 0;
        let areDocumentsAlteredBecauseOfProducts = false;

        let setValues = ``;
        let columnValues = ``;
        
        columnValues += `select `;
        
        columnNames.forEach((columnName, columnNameIndex) => {
            columnValues += `null as new_${columnName}, `;
            setValues += `t.${columnName} = case when vals.new_${columnName} is not null then vals.new_${columnName} else t.${columnName} end`;

            setValues += punctuation[+(columnNameIndex === columnNamesLen - 1)]
        });

        columnValues += `null as id`;
        
        for (const id in idsAndKVPairs) {
            updatedRows++;

            const KVPair = idsAndKVPairs[id];

            columnValues += ` union all `;
            columnValues += ` select `

            columnNames.forEach(columnName => {
                columnValues += ` ${KVPair[columnName] ? mysql.escape(KVPair[columnName]) : null}, `;
            })

            columnValues += `${id} `
        }

        const tableName = this.table.currentTable;
        let additionalMiddleQuery = ``;
        let additionalEndingQuery = ``;

        if (tableName === 'product' && columnValues.includes('comestible')) {
            areDocumentsAlteredBecauseOfProducts = true;

            // `t` is referring to the alias set to the table in question
            additionalMiddleQuery = `
                inner join document_product
                    on document_product.product_id = t.id
            `;

            additionalEndingQuery = `
                ,document_product.product_vat = case 
                    when vals.new_comestible = 1 then
                        (@productVatFood:=document_product.sell_price * (select food_vat from vat) / 100)
                    when vals.new_comestible = 0 then
                        (@productVatNonFood:=document_product.sell_price * (select non_food_vat from vat) / 100)
                    else document_product.product_vat
                end,
                document_product.sell_price_vat = case
                    when vals.new_comestible = 1 then
                        @productVatFood + document_product.sell_price
                    when vals.new_comestible = 0 then
                        @productVatNonFood + document_product.sell_price
                    else document_product.product_vat
                end
            `;
        }

        const sql = `
            update ${tableName} t
            join (
                ${columnValues}
            ) vals on vals.id = t.id
            ${additionalMiddleQuery}
            set ${setValues}
            ${additionalEndingQuery}
        `;

        console.log(sql)
        
        try {
            await this.table._promisify(sql);

            return { 
                message: `${tableName}${updatedRows > 1 ? 's' : ''} successfully updated`,
                reqType: 'update',
                shouldRedirect: tableName === 'provider',
                ...areDocumentsAlteredBecauseOfProducts && { shouldReloadDocuments: true }
            };
        } catch (err) {
            console.error(err);

            return { message: 'err updating items!', err }
        }
        
    }

    async delete ({ deletedItemsIds }) {
        let sql = ``;
        const tableName = this.table.currentTable;
        const isCurrentEntityProvider = tableName === 'provider';
        const isCurrentEntityProduct = tableName === 'product';
        if (isCurrentEntityProvider) {
            /**
             * Using left join so a provider is still deleted
             * even though it does not own any documents
             */
            sql = `
                delete p, d
                from provider p
                left join document d
                on p.id = d.provider_id
                where p.id in (${deletedItemsIds.join(', ')})
            `;
        } else if (isCurrentEntityProduct) {
            sql = `
                delete p, dp
                from product p
                left join document_product dp
                on p.id = dp.product_id
                where p.id in (${deletedItemsIds.join(', ')})
            `;
        } else {
            sql = `
                delete
                from ${tableName}
                where id in (${deletedItemsIds.join(', ')})
            `;
        }

        try {
            const tableName = this.table.currentTable;
            const response = await this.table._promisify(sql);

            console.log(response)

            return { 
                message: `${tableName}${deletedItemsIds.length > 1 ? 's' : ''} successfully deleted`,
                response,
                reqType: 'delete',
                shouldRedirect: isCurrentEntityProvider,

                /**
                 * If the condition `response.affectedRows > deletedItemsIds.length` evaluates to true
                 * it means that rows from `document_product` have also been deleted.
                 */
                shouldReloadDocuments: isCurrentEntityProduct && response.affectedRows > deletedItemsIds.length
            };
        } catch (err) {
            return { message: 'error deleting', err };
        }
    }

    async simpleUpdate ([key, val]) {

        const tableName = this.table.currentTable;

        const sql = `
            update ${tableName}
            set ${key} = ${val}
        `;

        try {
            await this.table._promisify(sql);

            return { message: `successfully updated ${tableName}` }
        } catch (err) {
            console.error(err);
            
            return { message: `error updating ${vat}`, err }
        }
    }
}

module.exports = Service;