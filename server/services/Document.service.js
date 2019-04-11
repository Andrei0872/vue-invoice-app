const mainService = require('./index');

class DocumentService extends mainService {
    constructor(name) {
        super(name);
        this.documentTableColumns = {
            provider_id: null,
            provider_name: null,
            invoice_number: null
        };
        this.documentProductTableColumns = ['document_id', 'product_id', 'quantity', 'quantity_type', 'buy_price', 'markup', 'sell_price', 'product_vat', 'sell_price_vat', 'currency'];
    }

    async insertOne({
        items,
        provider: {
            id: provider_id,
            invoiceNr,
            name: provider_name
        }
    }) {
        const documentValues = {
            ...this.documentTableColumns
        };

        const sanitizedItems = items.map(({ id, product_name: { id: product_id }, ...rest }) => ({ product_id, ...rest }));

        documentValues['invoice_number'] = invoiceNr;
        documentValues['provider_name'] = provider_name;
        documentValues['provider_id'] = provider_id;

        try {
            const {
                insertId: lastInsertId
            } = await this.table.insertOne(
                Object.keys(documentValues).join(', '),
                [Object.values(documentValues)]
            );

            this.table.currentTable = 'document_product';
            await this.table.insertOne(
                this.documentProductTableColumns.join(', '),
                sanitizedItems.map(row => [lastInsertId, ...Object.values(row)])
            );

            return {
                message: 'success'
            }
        } catch (err) {
            console.error(err)
            return {
                message: `something went wrong:${err}`
            }
        } finally {
            this.table.currentTable = 'document';
        }
    }

    // TODO: make joinTables() method
    async getAll() {
        const sql = `
            select
            document.provider_name,
                SUM(document_product.buy_price) as total_buy, SUM(document_product.sell_price) as total_sell,
                document.invoice_number, document.provider_id, document.inserted_date, document.id as id,
                count(document_product.id) as nr_products, sum(document_product.product_vat) as total_vat,
                sum(document_product.sell_price_vat) as total_sell_vat
            from document
            inner join document_product
            on document.id = document_product.document_id
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
        const data = await (this.table || this.db)._promisify(
            `
            select * from document_product
            where document_id = ?
            `,
            id
        );

        return data;
    }

    async updateProducts (data) {
        // TODO: only use the used columns
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

            return { message: 'Successfully updated!' }
        } catch {
            return { message: 'An error has occurred when updating!' }
        }
    }

    async deleteFromDoc (id, docId) {
        return (await this.table._promisify(
            `call remove_document(${docId}, ${id})`
        ))[0]
    }

    async updateDocument ({ id, ...otherFields }) {
        const keys = Object.keys(otherFields).join(' = ?, ') + ' = ?';
        const values = [...Object.values(otherFields), id];
        
        try {
            await this.table.updateOne(keys, values);

            return { message: 'The document has been updated!' }
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
}

module.exports = DocumentService;