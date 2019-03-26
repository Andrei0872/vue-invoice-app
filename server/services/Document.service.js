const mainService = require('./index');

class DocumentService extends mainService {
    constructor (name) {
        super(name);
        this.documentTableColumns = { provider_id: null, provider_name: null, total_buy: 0, total_sell: 0, invoice_number: null };
        this.documentProductTableColumns = ['document_id', 'product_id', 'quantity', 'quantity_type', 'buy_price', 'markup', 'sell_price','currency'];
    }

    async insertOne ({ items, provider: { id: provider_id, invoiceNr, name: provider_name } }) {
        const documentValues = { ...this.documentTableColumns };
        
        const sanitizedItems = items.map(({ id, product_name: { id: product_id }, ...rest }) => {
            documentValues['total_buy'] += +rest['buy_price'];
            documentValues['total_sell'] += +rest['sell_price'];
            
            return { product_id, ...rest }
        });
        documentValues['invoice_number'] = invoiceNr;
        documentValues['provider_name'] = provider_name;
        documentValues['provider_id'] = provider_id;

        try {
            // select SUM(buy_price) as total_buy, SUM(sell_price) as total_sell from document_product group by document_id;
            const { insertId: lastInsertId } = await this.table.insertOne(
                Object.keys(documentValues).join(', '),
                [Object.values(documentValues)]
            );

            this.table.currentTable = 'document_product';
            await this.table.insertOne(
                this.documentProductTableColumns.join(', '),
                sanitizedItems.map(row => [lastInsertId, ...Object.values(row)])
            );

            return { message: 'success' }
        } catch (err) {
            console.error(err)
            return { message: `something went wrong:${err}` }
        } finally {
            this.table.currentTable = 'document';
        }   
    }

    // TODO: make joinTables() method
    async getAll () {
        const sql = `
            select
            document.provider_name,
                SUM(document_product.buy_price) as total_buy, SUM(document_product.sell_price) as total_sell,
                document.invoice_number, document.provider_id, document.inserted_date, document.id as id
            from document
            inner join document_product
            on document.id = document_product.document_id
            group by document_id
        `;

        try {
            const data = await this.table._promisify(sql);
            
            return {
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
    }

    async deleteOne ({ id }) {
        return await this.table._promisify(
            `call remove_document(${id})`
        )
    }
}

module.exports = DocumentService;