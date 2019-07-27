const mainController = require('./index');

class DocumentController extends mainController {
    
    constructor (...args) {
        if (!!DocumentController.instance) {
            return DocumentController.instance;
        }

        super(...args);

        DocumentController.instance = this;
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
        /**
         * For the moment, the provider is also sent
         * and we only need the created products and the document id
         */
        const { items: { docId, createdProducts } } = req.body;

        const response = await this.service.insertProductsOnly(docId, createdProducts);
        return res.json(response);
    }

    async updateProvider ({ body }, res) {
        return res.json((await this.service.updateProvider(body)))
    }

    async getOneDocument (req, res) {
        const response = await this.service.getAll([req.query.id]);

        console.log(response)

        return res.json(response);
    }

    async getDeletedDocumentsByProviders (req, res, next) {
        const { deletedItemsIds: deletedProvidersIds } = req.body;

        const deletedDocuments = await this.service.getAlteredDocumentsByProviders(deletedProvidersIds);

        req.deletedDocuments = deletedDocuments;

        return next();
    }

    async sendDeletedDocumentsToHistory (req, res) {
        const { actionMessage, deletedDocuments } = req;

        if (!deletedDocuments.length) {
            return res.json({
                actionMessage
            });
        }

        const historyMessage = await this.service.sendDeletedDocumentsToHistory(JSON.stringify(deletedDocuments));

        return res.json({
            actionMessage,
            historyMessage,
            shouldReloadHistoryAndDocuments: true,
        });
    }
}

module.exports = DocumentController