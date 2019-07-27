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
    
    // TODO: write docs about data format
    async getUpdatedDocumentsByProviders (req, res, next) {
        const updatedProvidersIds = Object.keys(req.body[0]);

        const oldDocuments = await this.service.getAlteredDocumentsByProviders(updatedProvidersIds);

        req.oldDocuments = oldDocuments;
        req.updatedProvidersIds = updatedProvidersIds;
        
        return next();
    }

    async sendUpdatedDocumentsToHistory (req, res) {
        const { actionMessage, oldDocuments, updatedProvidersIds } = req;

        if (!oldDocuments.length) {
            return res.json({ actionMessage });
        }

        const newDocuments = await this.service.getAlteredDocumentsByProviders(updatedProvidersIds);

        const updatedDocuments = this._getTheActualUpdatedDocuments(newDocuments, oldDocuments);
        
        console.log('updatedDocuments', updatedDocuments)

        const historyMessage = await this.service.sendUpdatedDocumentsToHistory(JSON.stringify(updatedDocuments));

        return res.json({
            actionMessage,
            historyMessage,
            shouldReloadHistoryAndDocuments: true,
        });
    }

    /**
     * We don't want to show in history a document whose provider only
     * updated its URC. 
     * The URC of a provider won't be shown within a document,
     * so we only want those changes of `provider_name`.
     * 
     */
    _getTheActualUpdatedDocuments (newDocs, oldDocs, propToCheck = 'provider_name') {
        const result = {};

        newDocs.forEach((newDoc, index) => {
            const docId = newDoc.id;

            result[docId] = {};
            result[docId]['from'] = {};
            result[docId]['to'] = {};

            if (newDoc[propToCheck] !== oldDocs[index][propToCheck]) {
                result[docId]['from'][propToCheck] = oldDocs[index][propToCheck];
                result[docId]['to'][propToCheck] = newDoc[propToCheck];
            }
        })

        return result;
    }
}

module.exports = DocumentController