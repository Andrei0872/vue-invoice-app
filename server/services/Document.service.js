const mainService = require('./index');

class DocumentService extends mainService {
    constructor(name) {
        super(name);
        this.documentTableColumns = {
            provider_id: null,
            invoice_number: null
        };
        this.documentProductTableColumns = ['document_id', 'product_id', 'quantity', 'quantity_type', 'buy_price', 'markup', 'sell_price', 'product_vat', 'sell_price_vat', 'currency'];
    }

    async insertOne({
        items,
        provider: {
            id: provider_id,
            invoiceNr,
        }
    }) {
        const documentValues = {
            ...this.documentTableColumns
        };

        documentValues['invoice_number'] = invoiceNr;
        documentValues['provider_id'] = provider_id;

        try {
            const {
                insertId: lastInsertId
            } = await this.table.insertOne(
                Object.keys(documentValues).join(', '),
                [Object.values(documentValues)]
            );

            await this.insertProductsOnly(lastInsertId, items)

            return {
                message: 'success',
                reqType: 'insert'
            }
        } catch (err) {
            console.error(err)
            return {
                message: `something went wrong:${err}`
            }
        }
    }

    async insertProductsOnly (docId, items) {
        const sanitizedItems = items.map(({ id, product_name: { id: product_id }, ...rest }) => ({ product_id, ...rest }));

        this.table.currentTable = 'document_product';

        try {
            await this.table.insertOne(
                this.documentProductTableColumns.join(', '),
                sanitizedItems.map(row => [docId, ...Object.values(row)])
            );

            return { 
                message: 'successfully inserted products in a document',
                reqType: 'insert'
            };

        } catch (err) {
            console.error(err);

            return { message: 'error inserting products in document', erer };
        } finally {
            this.table.currentTable = 'document';
        }
    }

    async getAll() {
        const sql = `
            select
                provider.name as provider_name,
                SUM(document_product.buy_price) as total_buy, SUM(document_product.sell_price) as total_sell,
                document.invoice_number, document.provider_id, document.inserted_date, document.id as id,
                count(document_product.id) as nr_products, sum(document_product.product_vat) as total_vat,
                sum(document_product.sell_price_vat) as total_sell_vat
            from document
            inner join document_product
                on document.id = document_product.document_id
            inner join provider
                on document.provider_id = provider.id
            group by document_id
            order by document_id DESC
        `;

        try {
            const data = await this.table._promisify(sql);

            return {
                message: `Fetched from ${this.table.currentTable} successfully`,
                status: 200,
                data,
            }
        } catch (err) {
            return {
                message: `Failed to fetch from ${this.table.currentTable}`,
                reason: err.message,
                status: 400
            }
        }
    }

    async deleteOne({ id }) {
        return await this.table._promisify(
            `call remove_document(${id}, -1)`
        )
    }

    async getAllByDocument(id) {
        const sql = `
            select * from document_product
            where document_id = ${id}
        `;

        try {
            const data = await (this.table || this.db)._promisify(sql);

            return {
                message: 'successfully retrieved items!',
                data,
                reqType: 'delete'
            }
        } catch (err) {
            console.error(err);

            return { message: 'error fetching data' };
        }
    }

    async updateProducts (data) {
        const [, , ...columns] = this.documentProductTableColumns;
        const columnValues = Object.entries(data).map(([rowId, fields], i) => {
            const vals = columns.map(column => fields[column] || 'null')
            let query = ``;
                
            if (i === 0) {
                const firstLine = columns.map(column => `${fields[column] || 'null'} as new_${column}`);
                firstLine.push(`${rowId} as id`);
                query = `
                    select ${firstLine.join(', ')}
                `
            } else {
                vals.push(rowId)
                query = `
                    union all
                    select ${vals.join(', ')}
                ` 
            }
            
            return query
        });

        const setValues = columns.map(column => {
            return `
                ${column} = case when new_${column} is not null then new_${column} else dp.${column} end 
            `
        });

        const sql = `
        update document_product dp
        join (
            ${columnValues.join(' ')}
        ) vals on vals.id = dp.id
        set ${setValues.join(', ')}
        `;

        try {
            await this.table._promisify(sql);

            return { 
                message: 'Successfully updated!',
                reqType: 'update'
            };
        } catch {
            return { message: 'An error has occurred when updating!' }
        }
    }

    async deleteFromDoc (ids, docId, shouldDeleteDoc) {
        const sql = `
            delete from document_product dp
            where 
                dp.document_id = ${docId}
                and dp.product_id in (${ids.join(', ')});
        `;

        try {
            await this.table._promisify(sql);

            return { message: 'Successfully deleted products!!' }
        } catch (err) {
            console.error(err);

            return { message: 'Error deleting products!!' }
        } finally {
            if (shouldDeleteDoc) {
                this.table._promisify(`
                    delete from document d
                    where d.id = ${docId};
                `
                );
            }
        }
    }

    async updateDocument ({ id, provider_id = null, invoice_number = null }) {        
        let KVpairs = ``;

        if (provider_id) {
            KVpairs += `provider_id = ${provider_id}`
        }

        if (invoice_number) {
            KVpairs += KVpairs === `` ? '' : ', ';
            KVpairs += `invoice_number = ${invoice_number}`
        }

        const sql = `
            update document
            set ${KVpairs}
            where id = ${id}
        `;

        try {
            await this.table._promisify(sql);

            return { 
                message: 'The document has been updated!',
                reqType: 'update'
            }
        } catch {
            return { message: 'There has been an error updating the document' }
        }
    }

    async getPDFData (id) {
        return await (this.table || this.db)._promisify(
            `
            select dp.quantity, dp.quantity_type, dp.buy_price, dp.markup, dp.sell_price, p.* 
            from document_product dp 
            join product p 
            on dp.product_id = p.id 
            where dp.document_id = ?;
            `,
            id
        )
    }

    async updateDocumentVat ([vatType, vatValue]) {
        console.log(vatType, vatValue)
        
        try {
            const data = await this.table._promisify(
                `
                update document_product 
                set product_vat = sell_price * ${vatValue} / 100, sell_price_vat = sell_price + product_vat 
                where (select comestible from product where id = product_id) = ${vatType === 'food_vat' ? 1 : 0};
                `
            )

            return { 
                message: 'Successfully updated in all docd',
                data,
                reqType: 'update'
            }
        } catch {
            return { message: 'There has been an error updating all docs' }
        }
    }

    async updateProvider ({ name, id }) {
        try {
            const data = await this.table._promisify(
                `
                update document
                set provider_name = '${name}'
                where provider_id = ${id}
                `
            )

            return { 
                message: 'Provider updated in doc!', 
                data,
                reqType: 'update'
            }
        } catch (err) {
            console.log(err)
            return { message: 'There has been an error updating provider in doc' }
        }
    }
}

module.exports = DocumentService;