const mainService = require('./index');

class DocumentService extends mainService {
    constructor (name) {
        super(name);
    }

    _processParams (params) {
        const documentRows = [];
        const documentProductRows = [];

        params.reduce((memo, row) => {
            const { product_name: { id: ProductId }, id, ...rest } = row;

            memo.documentRows.push(rest);
            memo.documentProductRows.push(ProductId);

            return memo;
        }, { documentRows, documentProductRows })

        const keys = {
            document: Object.keys(documentRows[0]),
            product: 'id'
        }
        const values = {
            document: documentRows.map(Object.values),
            product: documentProductRows
        }

        return { keys, values }
    }

    async insertOne ({ items, provider }) {        
        const { keys, values } = this._processParams(items)
        // Compute the total values
        // Use a procedure to create a document and retrieve the last inserted it
        // After that, create a new record in the document_product table
        console.log(keys)
        console.log(values)
        console.log(provider)

        // const responseFromDB = await this.table.insertOne(keys.document.join(', '), values.document)
        // console.log(responseFromDB)
    }
}

module.exports = DocumentService;