const router = require('express').Router()

const Controller = require('../controllers');
const controller = new Controller('provider');

const DocumentController = require('../controllers/Document.controller');
const documentController = new DocumentController('document', 'Document');

router.route('/')
    .get(controller.getAll.bind(controller))
    .put(controller.updateOne.bind(controller))
    .delete(
        documentController.getDeletedDocumentsByProviders.bind(documentController),
        controller.delete.bind(controller),
        documentController.sendDeletedDocumentsToHistory.bind(documentController),
    )
    .post(controller.insertOne.bind(controller))

module.exports = router;