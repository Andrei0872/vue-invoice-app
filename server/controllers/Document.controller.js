const mainController = require('./index');

class DocumentController extends mainController {
    constructor (...args) {
        super(...args);
    }

    async getAllByDocument (req, res) {
        const { id } = req.params;

        const responseFromDB = await this.service.getAllByDocument(id);

        return res.status(200).json(responseFromDB);
    }

    async updateProducts(req, res) {
        const { body } = req;

        const responseFromDB = await this.service.updateProducts(body);

        return res.json(responseFromDB)
    }

    async deleteFromDoc ({ body: { ids, docId, shouldDeleteDoc } }, res) {
        const responseFromDB = await this.service.deleteFromDoc(ids, docId, shouldDeleteDoc);

        return res.json(responseFromDB);
    }

    async updateDocument ({ body }, res) {
        const responseFromDB = (await this.service.updateDocument(body)) || { test: 'ok!' };

        res.json(responseFromDB);
    }

    async updateDocumentVat ({ body } , res) {
        return res.json(
            (await this.service.updateDocumentVat(body))
        );
    }

    async insertProductsOnly (req, res) {
        const { docId, createdProducts } = req.body;
        
        const response = await this.service.insertProductsOnly(docId, createdProducts);
        return res.json(response);
    }

    async updateProvider ({ body }, res) {
        return res.json((await this.service.updateProvider(body)))
    }
}

module.exports = DocumentController